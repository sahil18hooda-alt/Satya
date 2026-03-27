"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { MarginOfErrorVisualizer } from "@/components/MarginOfErrorVisualizer";
import { Globe, Target } from "lucide-react";
import { useTabs } from "@/contexts/TabContext";
import { motion } from "framer-motion";

export default function MarginPage() {
    const { marginSubTab } = useTabs();

    return (
        <main className="min-h-screen bg-transparent font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-left mb-12 border-b-4 border-purple-600 pb-6"
                >
                    <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest text-purple-700">
                        <Target className="w-3 h-3" />
                        Statistical Modeling
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <Globe className="w-12 h-12 text-purple-600" />
                        Margin of Error Simulator
                    </h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl">
                        Interactive visualization tool to understand statistical margins of error in election polls and their impact on predictions.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <div id="margin-simulator" className={`bg-white/80 backdrop-blur-sm border border-slate-200 p-6 shadow-lg ${marginSubTab === 'simulator' ? 'ring-2 ring-primary' : ''}`}>
                        <MarginOfErrorVisualizer />
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
