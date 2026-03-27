"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, Loader2, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

import { useTabs, VoiceSubTabType } from "@/contexts/TabContext";

export function VoiceAssistant() {
    const { voiceSubTab: subTab } = useTabs();
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [detectedLanguage, setDetectedLanguage] = useState("en-IN");
    const [error, setError] = useState("");

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    // Audio Queue Logic
    const audioQueueRef = useRef<string[]>([]);
    const isPlayingQueueRef = useRef(false);
    
    // VAD Logic
    const vadIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const playNextInQueue = () => {
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
    };

    const startVAD = (stream: MediaStream) => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
                if (Date.now() - silenceStart > 1500) {
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
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "audio/webm;codecs=opus",
            });

            audioChunksRef.current = [];
            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                await sendAudioToBackend(audioBlob);
                stream.getTracks().forEach((track) => track.stop());
                if (audioContextRef.current) audioContextRef.current.close();
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            startVAD(stream);
            setIsRecording(true);
            setError("");
        } catch (err) {
            setError("Microphone access denied.");
            console.error("Recording error:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (vadIntervalRef.current) clearTimeout(vadIntervalRef.current);
        }
    };

    const sendAudioToBackend = async (audioBlob: Blob) => {
        setIsProcessing(true);
        audioQueueRef.current = []; // Clear queue for new interaction
        
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
                        const data = JSON.parse(line);

                        if (data.type === "detection") {
                            setMessages(prev => [...prev, { role: "user", content: data.text, timestamp: new Date() }]);
                            setDetectedLanguage(data.language);
                        } else if (data.type === "chunk") {
                            // Update assistant message text cumulatively
                            setMessages(prev => {
                                const newMessages = [...prev];
                                const lastMsg = newMessages[newMessages.length - 1];
                                if (lastMsg && lastMsg.role === "assistant") {
                                    lastMsg.content += " " + data.text;
                                    return newMessages;
                                } else {
                                    return [...prev, { role: "assistant", content: data.text, timestamp: new Date() }];
                                }
                            });

                            // Add to playback queue
                            if (data.audio) {
                                audioQueueRef.current.push(data.audio);
                                if (!isPlayingQueueRef.current) playNextInQueue();
                            }
                        }
                    }
                }
            };
        } catch (err: any) {
            setError(err.message || "Failed to process voice");
        } finally {
            setIsProcessing(false);
        }
    };

    const clearConversation = () => {
        setMessages([]);
        setError("");
    };

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
                            ? "Processing your voice..."
                            : isSpeaking
                                ? "Speaking..."
                                : isRecording
                                    ? "Listening... (Click to stop)"
                                    : "Click to speak"}
                    </p>

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
                    <li>Speak your question in any Indian language</li>
                    <li>Click again to stop and process your voice</li>
                    <li>Listen to the AI response in your language</li>
                </ul>
            </div>
        </div>
    );
}
