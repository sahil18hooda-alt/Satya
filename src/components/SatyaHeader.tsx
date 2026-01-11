"use client";

import { Search, Bell, Twitter, Facebook, Linkedin, Youtube, Instagram, MessageCircle } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import Link from "next/link";
import { useTabs } from "@/contexts/TabContext";

export function SatyaHeader() {
    const { activeTab, setActiveTab } = useTabs();

    const navItems = [
        { id: 'rumor', label: 'Rumor Buster' },
        { id: 'logic', label: 'Logic Layer' },
        { id: 'deepfake', label: 'Deepfake Detective' },
        { id: 'voice', label: 'Voice AI' },
        { id: 'accessibility', label: 'Accessibility' },
        { id: 'game', label: 'Civic Game' },
        { id: 'dividend', label: 'Democracy Dividend' },
        { id: 'news', label: 'Election News' },
        { id: 'margin', label: 'Margin of Error' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            {/* Top Bar: MeitY Style Branding */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                    {/* Left: Branding Section */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-4">
                            <img src="/emblem.png" alt="Emblem" className="h-14 w-auto object-contain" />
                            <div className="flex flex-col border-l pl-4 border-gray-200">
                                <span className="text-gray-600 text-[10px] md:text-sm font-semibold leading-none mb-1 uppercase tracking-tight">
                                    Government of India
                                </span>
                                <h1 className="text-[#003366] font-extrabold text-xl md:text-3xl leading-tight tracking-tight">
                                    Ministry of Electronics and Information Technology
                                </h1>
                            </div>
                        </Link>
                    </div>

                    {/* Right: Digital India & Quick Actions */}
                    <div className="hidden lg:flex items-center gap-8">
                        <img src="https://www.meity.gov.in/writereaddata/files/digital-india-logo.png" alt="Digital India" className="h-10 w-auto opacity-80" />
                        <div className="flex items-center gap-4 border-l pl-8 border-gray-200">
                            <Search className="w-5 h-5 text-[#003366] cursor-pointer" />
                            <LanguageSelector />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Horizontal Sub-Navigation */}
            <nav className="bg-[#003366] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center overflow-x-auto no-scrollbar">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`px-5 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-4 hover:bg-white/10 ${activeTab === item.id
                                        ? 'border-white bg-white/20'
                                        : 'border-transparent'
                                    }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
}
