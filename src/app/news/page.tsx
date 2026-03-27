"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ElectionNews } from "@/components/ElectionNews";
import { Globe, Newspaper } from "lucide-react";
import { useTabs } from "@/contexts/TabContext";
import { motion } from "framer-motion";

export default function NewsPage() {
    const { newsSubTab } = useTabs();

    return (
        <main className="min-h-screen bg-transparent font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-left mb-12 border-b-4 border-slate-900 pb-6"
                >
                    <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-300 px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                        <Newspaper className="w-3 h-3" />
                        Verified Sources Only
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <Globe className="w-12 h-12 text-slate-900" />
                        Election Newsroom
                    </h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl">
                        Live updates and analyzed headlines from verified government sources across all Indian states and Union Territories.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <ElectionNews />
                </motion.div>
            </div>
        </main>
    );
}
