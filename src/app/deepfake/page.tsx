"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { DeepfakeDetective } from "@/components/DeepfakeDetective";
import { FileVideo } from "lucide-react";
import { useTabs } from "@/contexts/TabContext";

export default function DeepfakePage() {
    const { deepfakeSubTab } = useTabs();

    return (
        <main className="min-h-screen bg-white font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="text-left mb-12 border-b-4 border-red-600 pb-6">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <FileVideo className="w-12 h-12 text-red-600" />
                        Deepfake Detective
                    </h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl">
                        Identify AI-generated manipulation in election-related videos and audio using advanced Dual-Stream Neural Networks.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <DeepfakeDetective subTab={deepfakeSubTab} />
                </div>
            </div>
        </main>
    );
}
