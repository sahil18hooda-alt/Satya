"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { StoryInput } from "@/components/StoryInput";
import { ElectionStory } from "@/components/ElectionStory";
import { motion, AnimatePresence } from "framer-motion";
import { History, Share2, Info } from "lucide-react";
import { T } from "@/components/TranslatedText";

export default function ElectionStoryPage() {
    const [userData, setUserData] = useState<{ age: number; state: string } | null>(null);

    const handleStart = (age: number, state: string) => {
        setUserData({ age, state });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleReset = () => {
        setUserData(null);
    };

    return (
        <main className="min-h-screen bg-transparent font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <header className="mb-12 border-b-4 border-slate-900 pb-8 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest text-blue-700">
                        <History className="w-3.5 h-3.5" />
                        <T>Participatory Timeline Builder</T>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        <T>My Election Story</T>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                        <T>Reconstruct every election you've been eligible for in your lifetime and discover how the proposed "One Nation One Election" (ONOE) framework would have personal impact on your state and your savings.</T>
                    </p>
                </header>

                <AnimatePresence mode="wait">
                    {!userData ? (
                        <motion.div
                            key="input"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="py-12"
                        >
                            <StoryInput onStart={handleStart} />
                            
                            {/* Educational Tooltip/Banner */}
                            <div className="mt-16 max-w-3xl mx-auto bg-orange-50 border-l-4 border-orange-500 p-6 flex gap-4">
                                <Info className="w-6 h-6 text-orange-600 shrink-0" />
                                <div>
                                    <h4 className="font-bold text-orange-900 mb-1 leading-none uppercase text-xs tracking-widest">
                                        <T>Why it matters</T>
                                    </h4>
                                    <p className="text-sm text-orange-800 leading-relaxed">
                                        <T>The debate around ONOE is often about macro-economics and constitutional theories. We believe voters should see the ground reality — how often the Model Code of Conduct freezes their local government and how much of their tax money goes into fragmented cycles.</T>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="story"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        >
                            <ElectionStory 
                                age={userData.age} 
                                state={userData.state} 
                                onReset={handleReset} 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
