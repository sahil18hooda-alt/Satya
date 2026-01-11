"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { Mic } from "lucide-react";
import { useTabs } from "@/contexts/TabContext";

export default function VoicePage() {
    const { voiceSubTab } = useTabs();

    return (
        <main className="min-h-screen bg-white font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="text-left mb-12 border-b-4 border-blue-600 pb-6">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <Mic className="w-12 h-12 text-blue-600" />
                        Voice AI Assistant
                    </h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl">
                        Multilingual support for the visually impaired and regional speakers. Get election answers in your local language through our safe AI voice bridge.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div id="voice-assistant" className={`bg-white border p-6 shadow-xl ${voiceSubTab === 'assistant' ? 'ring-2 ring-blue-600' : ''}`}>
                        <VoiceAssistant />
                    </div>
                </div>
            </div>
        </main>
    );
}
