"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { DemocracyDividend } from "@/components/DemocracyDividend";
import { Landmark, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export default function DividendPage() {
    return (
        <main className="min-h-screen bg-transparent font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-left mb-12 border-b-4 border-indigo-600 pb-6"
                >
                    <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest text-indigo-700">
                        <BarChart3 className="w-3 h-3" />
                        Data-Driven Analysis
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <Landmark className="w-12 h-12 text-indigo-600" />
                        Democracy Dividend
                    </h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl">
                        Analyze the socio-economic benefits of stable democratic processes and "One Nation, One Election" (ONOE) reforms through interactive data models.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <DemocracyDividend />
                </motion.div>
            </div>
        </main>
    );
}
