"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { DemocracyDividend } from "@/components/DemocracyDividend";
import { Landmark } from "lucide-react";

export default function DividendPage() {
    return (
        <main className="min-h-screen bg-white font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="text-left mb-12 border-b-4 border-indigo-600 pb-6">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <Landmark className="w-12 h-12 text-indigo-600" />
                        Democracy Dividend
                    </h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl">
                        Analyze the socio-economic benefits of stable democratic processes and "One Nation, One Election" (ONOE) reforms through interactive data models.
                    </p>
                </div>

                <DemocracyDividend />
            </div>
        </main>
    );
}
