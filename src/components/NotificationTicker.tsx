"use client";

import { motion } from "framer-motion";
import { Info, Volume2, ShieldAlert, BadgeCheck } from "lucide-react";
import { T } from "./TranslatedText";

const NOTIFICATIONS = [
  {
    text: "S.A.T.Y.A: WhatsApp Assistant is now active. Verify rumors instantly via our official number.",
    icon: <BadgeCheck className="w-4 h-4 text-green-600" />,
  },
  {
    text: "Fact Check: Voter list registration for the 2026 General Elections ends on October 15th.",
    icon: <Info className="w-4 h-4 text-blue-600" />,
  },
  {
    text: "Simulation: Try the One Nation One Election 'Civic Game' to see the impact of synchronized polls.",
    icon: <Volume2 className="w-4 h-4 text-orange-600" />,
  },
  {
    text: "Security Alert: Do not share your OTP or EPIC number with unverified sources. Stay safe.",
    icon: <ShieldAlert className="w-4 h-4 text-red-600" />,
  },
  {
    text: "Deepfake Detective: Use our AI tools to verify any suspicious election-related videos or audio.",
    icon: <BadgeCheck className="w-4 h-4 text-indigo-600" />,
  },
];

export function NotificationTicker({ isHighContrast }: { isHighContrast?: boolean }) {
  // Triple the list to ensure smooth infinite loop
  const displayItems = [...NOTIFICATIONS, ...NOTIFICATIONS, ...NOTIFICATIONS];

  return (
    <div className={`relative flex items-center h-10 overflow-hidden border-b ${
      isHighContrast 
        ? "bg-black border-yellow-400 text-yellow-400" 
        : "bg-orange-50/50 border-orange-100 text-slate-700"
    }`}>
      {/* Fixed "Latest Updates" header */}
      <div className={`z-10 px-4 h-full flex items-center shadow-lg transition-colors ${
        isHighContrast 
          ? "bg-yellow-400 text-black" 
          : "bg-[#f97316] text-white"
      }`}>
        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest whitespace-nowrap">
          <T>Latest Updates</T>
        </span>
        <div className={`absolute -right-3 top-0 h-full w-4 flex items-center justify-center pointer-events-none`}>
            <div className={`w-0 h-0 border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent border-l-[12px] ${
                isHighContrast ? "border-l-yellow-400" : "border-l-[#f97316]"
            }`}></div>
        </div>
      </div>

      {/* The Ticker Track */}
      <div className="flex-1 overflow-hidden relative h-full">
        <motion.div
          animate={{
            x: ["0%", "-50%"]
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear"
          }}
          className="flex items-center gap-12 whitespace-nowrap px-8 h-full"
        >
          {displayItems.map((note, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="opacity-80">{note.icon}</span>
              <span className="text-[11px] md:text-sm font-bold tracking-tight">
                <T>{note.text}</T>
              </span>
              <span className="mx-2 text-gray-300">•</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right gradient for fade effect */}
      {!isHighContrast && (
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-orange-50/50 to-transparent pointer-events-none z-10" />
      )}
    </div>
  );
}
