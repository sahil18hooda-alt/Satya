"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { AccessibilityAssistant } from "@/components/AccessibilityAssistant";
import { Globe } from "lucide-react";

export default function AccessibilityPage() {
    return (
        <main className="min-h-screen bg-white font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="text-left mb-12 border-b-4 border-green-600 pb-6">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <Globe className="w-12 h-12 text-green-600" />
                        Accessibility & Voting Rights
                    </h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl">
                        A comprehensive guide and AI assistant tailored for PwD (Persons with Disabilities) to ensure no voter is left behind.
                    </p>
                </div>

                <AccessibilityAssistant />
            </div>
        </main>
    );
}
