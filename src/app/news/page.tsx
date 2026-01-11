"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { ElectionNews } from "@/components/ElectionNews";
import { Globe } from "lucide-react";
import { useTabs } from "@/contexts/TabContext";

export default function NewsPage() {
    const { newsSubTab } = useTabs();

    return (
        <main className="min-h-screen bg-white font-mukta pb-20">
            <Breadcrumb />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="text-left mb-12 border-b-4 border-slate-900 pb-6">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 flex items-center gap-4">
                        <Globe className="w-12 h-12 text-slate-900" />
                        Election Newsroom
                    </h1>
                    <p className="text-lg text-slate-600 mt-4 max-w-3xl">
                        Live updates and analyzed headlines from verified government sources across all Indian states and Union Territories.
                    </p>
                </div>

                <div id="news-newsroom" className={`bg-gray-50 border p-6 ${newsSubTab === 'newsroom' ? 'ring-2 ring-primary' : ''}`}>
                    <ElectionNews />
                </div>
            </div>
        </main>
    );
}
