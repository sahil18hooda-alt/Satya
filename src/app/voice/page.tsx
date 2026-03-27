"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { Mic, Languages } from "lucide-react";
import { useTabs } from "@/contexts/TabContext";
import { motion } from "framer-motion";

export default function VoicePage() {
    const { voiceSubTab } = useTabs();

    return (
        <main className="min-h-screen bg-transparent font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-left mb-12 border-b-4 border-blue-600 pb-6"
                >
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest text-blue-700">
                        <Languages className="w-3 h-3" />
                        Multilingual Support
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <Mic className="w-12 h-12 text-blue-600" />
                        Voice AI Assistant
                    </h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl">
                        Multilingual support for the visually impaired and regional speakers. Get election answers in your local language through our safe AI voice bridge.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="max-w-4xl mx-auto"
                >
                    <div id="voice-assistant" className={`bg-white/80 backdrop-blur-sm border border-slate-200 p-6 shadow-xl ${voiceSubTab === 'assistant' ? 'ring-2 ring-blue-600' : ''}`}>
                        <VoiceAssistant />
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
