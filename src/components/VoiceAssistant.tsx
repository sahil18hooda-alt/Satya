"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, Volume2, Loader2, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

// Extend Window for webkit speech recognition and audio context
interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
    AudioContext: typeof AudioContext;
    webkitAudioContext: typeof AudioContext;
}
declare const window: IWindow;

import { useTabs } from "@/contexts/TabContext";

export function VoiceAssistant() {
    const { voiceSubTab: subTab } = useTabs();
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [detectedLanguage, setDetectedLanguage] = useState("en-IN");
    const [error, setError] = useState("");

    // Live transcription state
    const [liveTranscript, setLiveTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [liveWords, setLiveWords] = useState<string[]>([]);
    const [processingStatus, setProcessingStatus] = useState("");

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const liveTranscriptRef = useRef("");
    const interimTranscriptRef = useRef("");
    const audioChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    // Audio Queue Logic
    const audioQueueRef = useRef<string[]>([]);
    const isPlayingQueueRef = useRef(false);

    // VAD Logic
    const vadIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Speech Recognition
    const recognitionRef = useRef<any>(null);
    const isRecordingRef = useRef(false);

    // Keep ref in sync with state
    useEffect(() => {
        isRecordingRef.current = isRecording;
    }, [isRecording]);

    const playNextInQueue = useCallback(() => {
        if (audioQueueRef.current.length === 0) {
            isPlayingQueueRef.current = false;
            setIsSpeaking(false);
            return;
        }
        isPlayingQueueRef.current = true;
        setIsSpeaking(true);
        const audioBase64 = audioQueueRef.current.shift();
        if (!audioBase64) { playNextInQueue(); return; }

        const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
        audio.onended = playNextInQueue;
        audio.play().catch(e => {
            console.error("Queue playback error", e);
            playNextInQueue();
        });
    }, []);

    // --- Web Speech API for live transcription ---
    const startSpeechRecognition = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Web Speech API not supported in this browser");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN"; // Default, auto-detects most languages
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
            let interim = "";
            let final = "";
            const allWords: string[] = [];

            for (let i = 0; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final += transcript + " ";
                } else {
                    interim = transcript;
                }
                // Split into words for animation
                const words = transcript.trim().split(/\s+/);
                allWords.push(...words);
            }

            setLiveTranscript(final.trim());
            liveTranscriptRef.current = final.trim();
            setInterimTranscript(interim);
            interimTranscriptRef.current = interim;
            setLiveWords(allWords.filter(w => w.length > 0));
        };

        recognition.onerror = (event: any) => {
            // Silently handle — this is just visual feedback
            if (event.error !== "no-speech" && event.error !== "aborted") {
                console.warn("Speech recognition error:", event.error);
            }
        };

        recognition.onend = () => {
            // Auto-restart if still recording (recognition can timeout)
            if (isRecordingRef.current) {
                try { recognition.start(); } catch (e) { /* ignore */ }
            }
        };

        try {
            recognition.start();
            recognitionRef.current = recognition;
        } catch (e) {
            console.warn("Could not start speech recognition:", e);
        }
    }, []);

    const stopSpeechRecognition = useCallback(() => {
        if (recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
            recognitionRef.current = null;
        }
    }, []);

    const startVAD = useCallback((stream: MediaStream) => {
        // Reuse existing AudioContext if available
        const audioContext = audioContextRef.current && audioContextRef.current.state !== "closed"
            ? audioContextRef.current
            : new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let silenceStart = Date.now();
        const threshold = 15;

        const checkSilence = () => {
            if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") return;
            analyser.getByteFrequencyData(dataArray);
            const sum = dataArray.reduce((a, b) => a + b, 0);
            const average = sum / bufferLength;

            if (average < threshold) {
                // Reduced from 1500ms to 1000ms for faster auto-stop
                if (Date.now() - silenceStart > 1000) {
                    stopRecording();
                    return;
                }
            } else {
                silenceStart = Date.now();
            }
            vadIntervalRef.current = setTimeout(checkSilence, 100);
        };

        audioContextRef.current = audioContext;
        checkSilence();
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "audio/webm;codecs=opus",
            });

            audioChunksRef.current = [];
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                // Stop speech recognition
                stopSpeechRecognition();

                // Immediately show what was captured as a user message (blue bubble)
                const capturedText = (liveTranscriptRef.current + " " + interimTranscriptRef.current).trim();
                if (capturedText) {
                    setMessages(prev => [...prev, {
                        role: "user",
                        content: capturedText,
                        timestamp: new Date()
                    }]);
                }
                setProcessingStatus("Recognizing speech...");

                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                await sendAudioToBackend(audioBlob, !!capturedText);

                // Cleanup stream
                stream.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            };

            mediaRecorderRef.current = mediaRecorder;
            // Use timeslice of 250ms for faster chunk assembly
            mediaRecorder.start(250);
            startVAD(stream);

            // Start live speech recognition in parallel
            setLiveTranscript("");
            setInterimTranscript("");
            setLiveWords([]);
            startSpeechRecognition();

            setIsRecording(true);
            setError("");
        } catch (err) {
            setError("Microphone access denied.");
            console.error("Recording error:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecordingRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (vadIntervalRef.current) clearTimeout(vadIntervalRef.current);
        }
    };

    const sendAudioToBackend = async (audioBlob: Blob, hasPreviewMessage: boolean = false) => {
        setIsProcessing(true);
        audioQueueRef.current = [];

        try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64Audio = (reader.result as string).split(",")[1];
                const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:8000" : process.env.NEXT_PUBLIC_API_URL ?? "";

                const response = await fetch(`${API_URL}/voice/stream`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        audio_base64: base64Audio,
                        conversation_history: messages.map((m) => ({ role: m.role, content: m.content })),
                    }),
                });

                if (!response.ok) throw new Error("Voice processing failed");
                if (!response.body) return;

                // Clear live transcript once backend starts responding
                setLiveTranscript("");
                setInterimTranscript("");
                setLiveWords([]);

                const streamReader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";

                while (true) {
                    const { done, value } = await streamReader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        if (!line.trim()) continue;
                        try {
                            const data = JSON.parse(line);

                            if (data.type === "detection") {
                                // Update the preview message with authoritative STT text,
                                // or add a new one if no preview was shown
                                if (hasPreviewMessage) {
                                    setMessages(prev => {
                                        const updated = [...prev];
                                        // Find the last user message and update it
                                        for (let i = updated.length - 1; i >= 0; i--) {
                                            if (updated[i].role === "user") {
                                                updated[i].content = data.text;
                                                break;
                                            }
                                        }
                                        return updated;
                                    });
                                } else {
                                    setMessages(prev => [...prev, { role: "user", content: data.text, timestamp: new Date() }]);
                                }
                                setDetectedLanguage(data.language);
                                setProcessingStatus("Generating response...");
                            } else if (data.type === "chunk") {
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    const lastMsg = newMessages[newMessages.length - 1];
                                    if (lastMsg && lastMsg.role === "assistant") {
                                        lastMsg.content += " " + data.text;
                                        return [...newMessages];
                                    } else {
                                        return [...prev, { role: "assistant", content: data.text, timestamp: new Date() }];
                                    }
                                });

                                if (data.audio) {
                                    audioQueueRef.current.push(data.audio);
                                    if (!isPlayingQueueRef.current) playNextInQueue();
                                }
                            }
                        } catch (parseErr) {
                            console.warn("Failed to parse stream line:", line);
                        }
                    }
                }
            };
        } catch (err: any) {
            setError(err.message || "Failed to process voice");
            console.error("Voice processing error:", err);
        } finally {
            setIsProcessing(false);
            setProcessingStatus("");
        }
    };

    const clearConversation = () => {
        setMessages([]);
        setError("");
        setLiveTranscript("");
        setInterimTranscript("");
        setLiveWords([]);
        setProcessingStatus("");
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            stopSpeechRecognition();
            if (vadIntervalRef.current) clearTimeout(vadIntervalRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
        };
    }, [stopSpeechRecognition]);

    const fullLiveText = liveTranscript + (interimTranscript ? " " + interimTranscript : "");

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                    Voice Assistant
                </h2>
                <p className="text-slate-600">
                    Ask me anything about Indian elections in any of the 22 scheduled languages
                </p>
                {detectedLanguage !== "en-IN" && (
                    <p className="text-sm text-blue-600 font-medium">
                        Speaking in: {detectedLanguage}
                    </p>
                )}
            </div>

            {/* Voice Control */}
            <div id="voice-control" className={`bg-gradient-to-br from-orange-50 via-white to-green-50 rounded-none p-8 border-2 transition-all ${subTab === 'assistant' ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-100'}`}>
                <div className="flex flex-col items-center space-y-6">
                    {/* Microphone Button */}
                    <motion.button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isProcessing || isSpeaking}
                        className={`relative w-32 h-32 rounded-none flex items-center justify-center transition-all ${isRecording
                            ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50"
                            : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50"
                            } ${isProcessing || isSpeaking ? "opacity-50 cursor-not-allowed" : ""}`}
                        whileTap={{ scale: 0.95 }}
                        animate={isRecording ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ repeat: isRecording ? Infinity : 0, duration: 1.5 }}
                    >
                        {isProcessing ? (
                            <Loader2 className="w-12 h-12 text-white animate-spin" />
                        ) : isSpeaking ? (
                            <Volume2 className="w-12 h-12 text-white animate-pulse" />
                        ) : isRecording ? (
                            <MicOff className="w-12 h-12 text-white" />
                        ) : (
                            <Mic className="w-12 h-12 text-white" />
                        )}

                        {/* Pulsing ring when recording */}
                        {isRecording && (
                            <motion.div
                                className="absolute inset-0 rounded-none border-4 border-red-400"
                                animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                        )}
                    </motion.button>

                    {/* Status Text */}
                    <p className="text-lg font-medium text-slate-700">
                        {isProcessing
                            ? (processingStatus || "Processing your voice...")
                            : isSpeaking
                                ? "Speaking..."
                                : isRecording
                                    ? "Listening... (Click to stop)"
                                    : "Click to speak"}
                    </p>

                    {/* Live Transcription Display */}
                    <AnimatePresence>
                        {(isRecording || (isProcessing && liveWords.length > 0)) && liveWords.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="w-full max-w-lg"
                            >
                                <div className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-lg px-5 py-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                        </span>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Capture</span>
                                    </div>
                                    <p className="text-base text-slate-800 leading-relaxed min-h-[1.5rem]">
                                        {liveWords.map((word, i) => (
                                            <motion.span
                                                key={`${i}-${word}`}
                                                initial={{ opacity: 0, y: 4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.15, delay: Math.min(i * 0.03, 0.3) }}
                                                className={`inline-block mr-1 ${i >= liveWords.length - (interimTranscript.trim().split(/\s+/).length || 0)
                                                    ? "text-blue-500"
                                                    : "text-slate-800"
                                                    }`}
                                            >
                                                {word}
                                            </motion.span>
                                        ))}
                                        {isRecording && (
                                            <motion.span
                                                animate={{ opacity: [1, 0] }}
                                                transition={{ repeat: Infinity, duration: 0.8 }}
                                                className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 align-middle"
                                            />
                                        )}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-none text-sm">
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Conversation History */}
            {messages.length > 0 && (
                <div className="bg-white rounded-none border shadow-sm p-6 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-900">Conversation</h3>
                        <button
                            onClick={clearConversation}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Clear
                        </button>
                    </div>

                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        <AnimatePresence>
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[80%] px-4 py-3 rounded-none ${message.role === "user"
                                            ? "bg-blue-600 text-white"
                                            : "bg-slate-100 text-slate-900"
                                            }`}
                                    >
                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                        <p className="text-xs opacity-70 mt-1">
                                            {message.timestamp.toLocaleTimeString()}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Instructions */}
            <div id="voice-instructions" className={`bg-slate-50 rounded-none p-4 text-sm text-slate-600 transition-all ${subTab === 'upload' ? 'bg-orange-50 border border-orange-200' : ''}`}>
                <p className="font-semibold mb-2">How to use:</p>
                <ul className="list-disc list-inside space-y-1">
                    <li>Click the microphone to start speaking</li>
                    <li>Watch your words appear in real-time as you speak</li>
                    <li>Recording auto-stops after 1 second of silence</li>
                    <li>Listen to the AI response in your language</li>
                </ul>
            </div>
        </div>
    );
}
