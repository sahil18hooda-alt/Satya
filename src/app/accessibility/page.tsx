"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { AccessibilityAssistant } from "@/components/AccessibilityAssistant";
import { Globe, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function AccessibilityPage() {
    return (
        <main className="min-h-screen bg-transparent font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-left mb-12 border-b-4 border-green-600 pb-6"
                >
                    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest text-green-700">
                        <Heart className="w-3 h-3" />
                        Inclusive Design
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <Globe className="w-12 h-12 text-green-600" />
                        Accessibility & Voting Rights
                    </h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl">
                        A comprehensive guide and AI assistant tailored for PwD (Persons with Disabilities) to ensure no voter is left behind.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <AccessibilityAssistant />
                </motion.div>
            </div>
        </main>
    );
}
