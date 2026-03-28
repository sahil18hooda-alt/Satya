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

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: "audio/webm;codecs=opus",
            });

            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
                await sendAudioToBackend(audioBlob);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsRecording(true);
            setError("");
        } catch (err) {
            setError("Microphone access denied. Please enable microphone permissions.");
            console.error("Recording error:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const sendAudioToBackend = async (audioBlob: Blob) => {
        setIsProcessing(true);
        try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64Audio = (reader.result as string).split(",")[1];

                const API_URL =
                    process.env.NODE_ENV === "development"
                        ? "http://localhost:8000"
                        : process.env.NEXT_PUBLIC_API_URL ?? "";

                const response = await fetch(`${API_URL}/voice/chat`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        audio_base64: base64Audio,
                        conversation_history: messages.map((m) => ({
                            role: m.role,
                            content: m.content,
                        })),
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Voice processing failed");
                }

                const data = await response.json();

                // Add user message (transcribed)
                const userMessage: Message = {
                    role: "user",
                    content: data.text_query,
                    timestamp: new Date(),
                };

                // Add assistant response
                const assistantMessage: Message = {
                    role: "assistant",
                    content: data.text_response,
                    timestamp: new Date(),
                };

                setMessages((prev) => [...prev, userMessage, assistantMessage]);
                setDetectedLanguage(data.detected_language);

                // Play audio response
                playAudioResponse(data.audio_base64);
            };
        } catch (err: any) {
            setError(err.message || "Failed to process voice");
            console.error("Voice processing error:", err);
        } finally {
            setIsProcessing(false);
        }
    };

    const playAudioResponse = (audioBase64: string) => {
        setIsSpeaking(true);
        const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
        audioRef.current = audio;

        audio.onended = () => {
            setIsSpeaking(false);
        };

        audio.play().catch((err) => {
            console.error("Audio playback error:", err);
            setIsSpeaking(false);
        });
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
            <div id="voice-control" className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-none p-8 border-2 transition-all ${subTab === 'assistant' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-blue-100'}`}>
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
