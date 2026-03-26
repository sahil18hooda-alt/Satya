"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, Loader2, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTabs } from "@/contexts/TabContext";

interface Message {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export function VoiceAssistant() {
    const { voiceSubTab: subTab } = useTabs();
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [detectedLanguage, setDetectedLanguage] = useState("en-IN");
    const [error, setError] = useState("");

    const recognitionRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            synthRef.current = window.speechSynthesis;
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false; 
                recognition.interimResults = false;
                recognition.lang = detectedLanguage;

                recognition.onresult = async (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    if (transcript.trim().length > 0) {
                        setIsListening(false);
                        await sendTextToBackend(transcript);
                    }
                };

                recognition.onerror = (event: any) => {
                    if (event.error !== 'no-speech' && event.error !== 'aborted') {
                        setError(`Microphone error: ${event.error}. Try clicking again.`);
                    }
                    setIsListening(false);
                };

                recognition.onend = () => {
                     // We manually manage stating/stopping so we do nothing here unless auto-restart is needed
                     if (!isProcessing && !isSpeaking && recognitionRef.current) {
                         setIsListening(false);
                     }
                };
                
                recognitionRef.current = recognition;
            } else {
                setError("Your browser does not support Speech Recognition. Please try Chrome or Edge.");
            }
        }
        return () => {
            if (synthRef.current) {
                synthRef.current.cancel();
            }
            if (recognitionRef.current) {
                try { recognitionRef.current.stop(); } catch(e){}
            }
        };
    }, [detectedLanguage, isProcessing, isSpeaking]); 

    const toggleListening = () => {
        if (isSpeaking && synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
            // Optionally, we could auto-restart listening here
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {}
            return;
        }
        if (isListening && recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch(e){}
            setIsListening(false);
        } else if (recognitionRef.current && !isProcessing) {
            setError("");
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (e) {
                // If it's already started
            }
        }
    };

    const sendTextToBackend = async (query: string) => {
        setIsProcessing(true);
        const userMessage: Message = {
            role: "user",
            content: query,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const API_URL =
                process.env.NODE_ENV === "development"
                    ? "http://localhost:8000"
                    : process.env.NEXT_PUBLIC_API_URL ?? "";

            const response = await fetch(`${API_URL}/chat-text`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: query,
                    language: detectedLanguage,
                    conversation_history: messages.map((m) => ({
                        role: m.role,
                        content: m.content,
                    })),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Processing failed");
            }

            const data = await response.json();

            const assistantMessage: Message = {
                role: "assistant",
                content: data.text_response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
            playTTS(data.text_response);
        } catch (err: any) {
            setError(err.message || "Failed to process request");
            setIsProcessing(false);
        }
    };

    const playTTS = (text: string) => {
        if (!synthRef.current) return;
        
        synthRef.current.cancel(); 
        const utterance = new SpeechSynthesisUtterance(text);
        
        const voices = synthRef.current.getVoices();
        const indianVoice = voices.find(v => v.lang.includes('IN') && v.lang.includes('en')) || 
                           voices.find(v => v.lang.includes('IN'));
        if (indianVoice) {
            utterance.voice = indianVoice;
        }

        utterance.lang = "en-IN"; 
        utterance.rate = 1.0;
        
        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsProcessing(false);
        };
        
        utterance.onend = () => {
            setIsSpeaking(false);
            // Auto restart listening for continuous conversation!
            if (recognitionRef.current) {
                 try {
                     recognitionRef.current.start();
                     setIsListening(true);
                 } catch (e) {}
            }
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
            setIsProcessing(false);
        };

        synthRef.current.speak(utterance);
    };

    const clearConversation = () => {
        setMessages([]);
        setError("");
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
        if (isListening && recognitionRef.current) {
            try { recognitionRef.current.stop(); } catch(e){}
            setIsListening(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                    Live Conversation AI
                </h2>
                <p className="text-slate-600">
                    Just speak! S.A.T.Y.A will listen and reply immediately.
                </p>
                {detectedLanguage !== "en-IN" && (
                    <p className="text-sm text-blue-600 font-medium">
                        Language: {detectedLanguage}
                    </p>
                )}
            </div>

            <div id="voice-control" className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-none p-8 border-2 transition-all ${subTab === 'assistant' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-blue-100'}`}>
                <div className="flex flex-col items-center space-y-6">
                    <motion.button
                        onClick={toggleListening}
                        className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all ${isListening
                            ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/50"
                            : isSpeaking ? "bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/50" 
                            : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/50"
                            } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                        whileTap={{ scale: 0.95 }}
                        animate={isListening ? { scale: [1, 1.05, 1] } : isSpeaking ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ repeat: isListening || isSpeaking ? Infinity : 0, duration: 1.5 }}
                    >
                        {isProcessing ? (
                            <Loader2 className="w-16 h-16 text-white animate-spin" />
                        ) : isSpeaking ? (
                            <Volume2 className="w-16 h-16 text-white animate-pulse" />
                        ) : isListening ? (
                            <MicOff className="w-16 h-16 text-white" />
                        ) : (
                            <Mic className="w-16 h-16 text-white" />
                        )}

                        {(isListening || isSpeaking) && (
                            <motion.div
                                className={`absolute inset-0 rounded-full border-4 ${isListening ? 'border-red-400' : 'border-green-400'}`}
                                animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                        )}
                    </motion.button>

                    <p className="text-lg font-medium text-slate-700">
                        {isProcessing
                            ? "Thinking..."
                            : isSpeaking
                                ? "AI is speaking... (Click to interrupt)"
                                : isListening
                                    ? "Listening... (Just start speaking)"
                                    : "Click to start conversation"}
                    </p>

                    {error && (
                        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-none text-sm">
                            {error}
                        </div>
                    )}
                </div>
            </div>

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
                                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
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
        </div>
    );
}
