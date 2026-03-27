"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ConstitutionalLogic } from "@/components/ConstitutionalLogic";
import { Landmark, Scale } from "lucide-react";
import { motion } from "framer-motion";

export default function LogicPage() {
    return (
        <main className="min-h-screen bg-transparent font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-left mb-12 border-b-4 border-blue-800 pb-6"
                >
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest text-blue-800">
                        <Scale className="w-3 h-3" />
                        Constitutional Framework
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <Landmark className="w-12 h-12 text-blue-800" />
                        Constitutional Logic Layer
                    </h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl">
                        Symmetrical constitutional analysis for sensitive election reforms. Powered by the "Veil of Ignorance" framework.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <ConstitutionalLogic />
                </motion.div>
            </div>
        </main>
    );
}
