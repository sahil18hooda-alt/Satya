"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { T } from "./TranslatedText";

const NOTIFICATIONS = [
    {
        type: "new",
        label: "New",
        text: "S.A.T.Y.A. WhatsApp Assistant is now active — verify rumors via the official number",
    },
    {
        type: "notice",
        label: "Notice",
        text: "Voter list registration for the 2026 General Elections ends on October 15th",
    },
    {
        type: "live",
        label: "Live",
        text: "Simulation: Try the One Nation One Election voter tool now",
    },
];

export function NotificationTicker({ isHighContrast }: { isHighContrast?: boolean }) {
    const [isPaused, setIsPaused] = useState(false);
    const [duration, setDuration] = useState(30);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Duplicate list for infinite scroll
    const displayItems = [...NOTIFICATIONS, ...NOTIFICATIONS];

    const getBadgeClass = (type: string) => {
        switch (type) {
            case "new": return "bg-[#138808] text-white";
            case "notice": return "bg-[#EFF6FF] text-[#1557B0]";
            case "live": return "bg-[#0B1F4F] text-white";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className={`satya-update-bar relative flex flex-col w-full overflow-hidden border-b transition-colors ${isHighContrast ? "bg-black border-yellow-400" : "bg-white border-[#E0DDD4]"}`}>
            {/* Tricolor top stripe */}
            <div className={`h-1 w-full ${isHighContrast ? "bg-yellow-400" : "bg-gradient-to-r"}`} 
                 style={!isHighContrast ? {
                     backgroundImage: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.33%, #ffffff 33.33%, #ffffff 66.66%, #138808 66.66%, #138808 100%)'
                 } : {}}>
            </div>

            <div className="flex items-center h-10 w-full overflow-hidden">
                {/* Left Label */}
                <div className={`h-full px-5 flex items-center shrink-0 font-bold text-[10px] uppercase tracking-widest transition-colors ${
                    isHighContrast 
                        ? "bg-yellow-400 text-black border-r-2 border-black" 
                        : "bg-[#0B1F4F] text-white border-r-[3px] border-[#FF9933]"
                }`}>
                    <T>Latest Updates</T>
                </div>

                {/* Live Pill */}
                <div className={`flex items-center gap-1.5 px-3 py-1 mx-3 rounded-full border shrink-0 transition-colors ${
                    isHighContrast 
                        ? "bg-black border-yellow-400 text-yellow-400" 
                        : "bg-[#FFF3E0] border-[#FF9933]/30 text-[#c45000]"
                }`}>
                    <motion.div 
                        animate={{ opacity: [1, 0.35, 1], scale: [1, 0.65, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className={`w-1.5 h-1.5 rounded-full ${isHighContrast ? "bg-yellow-400" : "bg-[#e64000]"}`}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider"><T>Live</T></span>
                </div>

                {/* Ticker Track */}
                <div className={`flex-1 overflow-hidden h-full relative flex items-center border-l ${isHighContrast ? "border-yellow-400" : "border-[#E0DDD4]"}`}>
                    <div className="absolute inset-x-0 h-full pointer-events-none z-10" 
                         style={{ 
                             maskImage: 'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)',
                             WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)'
                         }} 
                    />
                    
                    <motion.div
                        animate={{ x: isPaused ? undefined : ["0%", "-50%"] }}
                        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
                        className="flex items-center whitespace-nowrap px-4"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        {displayItems.map((note, idx) => (
                            <div key={idx} className="flex items-center shrink-0 pr-12">
                                <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-sm uppercase shrink-0 mr-3 ${isHighContrast ? "bg-yellow-400 text-black" : getBadgeClass(note.type)}`}>
                                    <T>{note.label}</T>
                                </span>
                                <span className={`text-[12.5px] font-medium transition-colors ${isHighContrast ? "text-yellow-400" : "text-[#1a1a1a]"}`}>
                                    <T>{note.text}</T>
                                </span>
                                <span className={`ml-8 text-xl font-light ${isHighContrast ? "text-yellow-400" : "text-[#BB8700]"}`}>·</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Pause Button */}
                <button
                    onClick={() => setIsPaused(!isPaused)}
                    className={`h-full w-10 flex items-center justify-center shrink-0 border-l transition-colors hover:bg-black/5 ${isHighContrast ? "border-yellow-400 text-yellow-400" : "border-[#E0DDD4] text-gray-400"}`}
                    aria-label={isPaused ? "Play ticker" : "Pause ticker"}
                >
                    {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
                </button>
            </div>
        </div>
    );
}
