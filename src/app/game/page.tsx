"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ConstitutionalGame } from "@/components/ConstitutionalGame";
import { Puzzle, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";

export default function GamePage() {
    return (
        <main className="min-h-screen bg-transparent font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-left mb-12 border-b-4 border-orange-500 pb-6"
                >
                    <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-1 mb-4 text-[10px] font-bold uppercase tracking-widest text-orange-700">
                        <Gamepad2 className="w-3 h-3" />
                        Interactive Simulation
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <Puzzle className="w-12 h-12 text-orange-500" />
                        Civic Educational Game
                    </h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl">
                        Learn about election laws, constitutional mandates, and voting procedures through an interactive trivia and simulation game.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <ConstitutionalGame />
                </motion.div>
            </div>
        </main>
    );
}
