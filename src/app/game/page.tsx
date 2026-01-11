"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ConstitutionalGame } from "@/components/ConstitutionalGame";
import { Puzzle } from "lucide-react";

export default function GamePage() {
    return (
        <main className="min-h-screen bg-white font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="text-left mb-12 border-b-4 border-orange-500 pb-6">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <Puzzle className="w-12 h-12 text-orange-500" />
                        Civic Educational Game
                    </h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl">
                        Learn about election laws, constitutional mandates, and voting procedures through an interactive trivia and simulation game.
                    </p>
                </div>

                <ConstitutionalGame />
            </div>
        </main>
    );
}
