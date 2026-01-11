"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { MarginOfErrorVisualizer } from "@/components/MarginOfErrorVisualizer";
import { Globe } from "lucide-react";
import { useTabs } from "@/contexts/TabContext";

export default function MarginPage() {
    const { marginSubTab } = useTabs();

    return (
        <main className="min-h-screen bg-white font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="text-left mb-12 border-b-4 border-purple-600 pb-6">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <Globe className="w-12 h-12 text-purple-600" />
                        Margin of Error Simulator
                    </h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl">
                        Interactive visualization tool to understand statistical margins of error in election polls and their impact on predictions.
                    </p>
                </div>

                <div id="margin-simulator" className={`bg-white border p-6 shadow-lg ${marginSubTab === 'simulator' ? 'ring-2 ring-primary' : ''}`}>
                    <MarginOfErrorVisualizer />
                </div>
            </div>
        </main>
    );
}
