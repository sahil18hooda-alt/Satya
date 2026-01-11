"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ConstitutionalLogic } from "@/components/ConstitutionalLogic";
import { Landmark } from "lucide-react";

export default function LogicPage() {
    return (
        <main className="min-h-screen bg-white font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="text-left mb-12 border-b-4 border-blue-800 pb-6">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <Landmark className="w-12 h-12 text-blue-800" />
                        Constitutional Logic Layer
                    </h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl">
                        Symmetrical constitutional analysis for sensitive election reforms. Powered by the "Veil of Ignorance" framework.
                    </p>
                </div>

                <ConstitutionalLogic />
            </div>
        </main>
    );
}
