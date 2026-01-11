"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import Link from "next/link";
import { useTabs } from "@/contexts/TabContext";
import { motion, AnimatePresence } from "framer-motion";

export function SatyaHeader() {
    const { activeTab, setActiveTab, rumorSubTab, setRumorSubTab } = useTabs();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const navItems = [
        {
            id: 'rumor',
            label: 'Rumor Buster',
            subItems: [
                { id: 'text', label: 'Text' },
                { id: 'image', label: 'Image' },
                { id: 'url', label: 'URL' },
            ]
        },
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
        <header className="sticky top-0 z-50 bg-white shadow-sm font-mukta">
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
                                <h1 className="text-[#003366] font-extrabold text-2xl md:text-4xl leading-tight tracking-tighter">
                                    S.A.T.Y.A
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

            {/* Bottom Bar: Horizontal Sub-Navigation with Dropdowns */}
            <nav className="bg-[#003366] text-white overflow-visible">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center no-scrollbar">
                        {navItems.map((item) => (
                            <div
                                key={item.id}
                                className="relative group"
                                onMouseEnter={() => setOpenDropdown(item.id)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <button
                                    onClick={() => setActiveTab(item.id as any)}
                                    className={`flex items-center gap-1 px-5 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-4 hover:bg-white/10 ${activeTab === item.id
                                        ? 'border-white bg-white/20'
                                        : 'border-transparent'
                                        }`}
                                >
                                    {item.label}
                                    {item.subItems && <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === item.id ? 'rotate-180' : ''}`} />}
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {item.subItems && openDropdown === item.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 bg-white text-gray-800 shadow-xl rounded-none border border-gray-200 py-1 min-w-[160px] z-[100]"
                                        >
                                            {item.subItems.map((sub) => (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => {
                                                        setActiveTab(item.id as any);
                                                        setRumorSubTab(sub.id as any);
                                                        setOpenDropdown(null);
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 hover:text-[#003366] transition-colors border-l-4 ${rumorSubTab === sub.id && activeTab === item.id ? 'border-[#003366] bg-gray-50 text-[#003366]' : 'border-transparent'}`}
                                                >
                                                    {sub.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
}
