"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import Link from "next/link";
import { useTabs } from "@/contexts/TabContext";
import { motion, AnimatePresence } from "framer-motion";

export function SatyaHeader() {
    const {
        activeTab, setActiveTab,
        rumorSubTab, setRumorSubTab,
        logicSubTab, setLogicSubTab,
        deepfakeSubTab, setDeepfakeSubTab,
        voiceSubTab, setVoiceSubTab,
        accessibilitySubTab, setAccessibilitySubTab,
        gameSubTab, setGameSubTab,
        dividendSubTab, setDividendSubTab,
        newsSubTab, setNewsSubTab,
        marginSubTab, setMarginSubTab,
        fontSize, setFontSize,
        isHighContrast, setIsHighContrast
    } = useTabs();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const navItems = [
        {
            id: 'rumor',
            label: 'Rumor Buster',
            subItems: [
                { id: 'text', label: 'Text', setter: setRumorSubTab },
                { id: 'image', label: 'Image', setter: setRumorSubTab },
                { id: 'url', label: 'URL', setter: setRumorSubTab },
            ]
        },
        {
            id: 'logic',
            label: 'Logic Layer',
            subItems: [
                { id: 'rationale', label: 'AI Rationale', setter: setLogicSubTab },
                { id: 'basis', label: 'Constitutional Basis', setter: setLogicSubTab },
                { id: 'citations', label: 'Legal Citations', setter: setLogicSubTab },
            ]
        },
        {
            id: 'deepfake',
            label: 'Deepfake Detective',
            subItems: [
                { id: 'detector', label: 'Video Detector', setter: setDeepfakeSubTab },
                { id: 'heatmap', label: 'Heatmap Analysis', setter: setDeepfakeSubTab },
                { id: 'extension', label: 'YouTube Extension', setter: setDeepfakeSubTab },
            ]
        },
        {
            id: 'voice',
            label: 'Voice AI',
            subItems: [
                { id: 'assistant', label: 'AI Assistant', setter: setVoiceSubTab },
                { id: 'upload', label: 'Audio Upload', setter: setVoiceSubTab },
            ]
        },
        {
            id: 'accessibility',
            label: 'Accessibility',
            subItems: [
                { id: 'visual', label: 'Visual Aid', setter: setAccessibilitySubTab },
                { id: 'hearing', label: 'Hearing Support', setter: setAccessibilitySubTab },
                { id: 'physical', label: 'Physical Access', setter: setAccessibilitySubTab },
                { id: 'cognitive', label: 'Cognitive Help', setter: setAccessibilitySubTab },
            ]
        },
        {
            id: 'game',
            label: 'Civic Game',
            subItems: [
                { id: 'ONOE', label: 'The Grand Sync', setter: setGameSubTab },
                { id: 'CLUSTER', label: 'Cluster Model', setter: setGameSubTab },
                { id: 'ROLLING', label: 'Rolling Cycle', setter: setGameSubTab },
            ]
        },
        {
            id: 'dividend',
            label: 'Democracy Dividend',
            subItems: [
                { id: 'receipt', label: 'Taxpayer Receipt', setter: setDividendSubTab },
                { id: 'budget', label: 'Budget Builder', setter: setDividendSubTab },
                { id: 'scale', label: 'Cost vs Investment', setter: setDividendSubTab },
                { id: 'mcc', label: 'Policy Paralysis', setter: setDividendSubTab },
            ]
        },
        {
            id: 'news',
            label: 'Election News',
            subItems: [
                { id: 'newsroom', label: 'Live Newsroom', setter: setNewsSubTab },
                { id: 'trending', label: 'Trending Topics', setter: setNewsSubTab },
            ]
        },
        {
            id: 'margin',
            label: 'Margin of Error',
            subItems: [
                { id: 'reality', label: 'Reality Check', setter: setMarginSubTab },
                { id: 'simulator', label: 'What-If Simulator', setter: setMarginSubTab },
            ]
        },
    ];

    const searchableItems = [
        ...navItems.map(item => ({ label: item.label, id: item.id, type: 'section', href: `/#${item.id}` })),
        ...navItems.flatMap(item => item.subItems?.map(sub => ({ label: `${item.label} > ${sub.label}`, id: sub.id, type: 'sub-feature', href: `/#${item.id}`, setter: sub.setter })) || []),
        { label: 'Privacy Policy', href: '/privacy', type: 'page' },
        { label: 'Terms & Conditions', href: '/terms', type: 'page' },
        { label: 'Copyright Policy', href: '/copyright', type: 'page' },
        { label: 'RTI', href: '/rti', type: 'page' },
        { label: 'About Us', href: '/about', type: 'page' },
        { label: 'Contact Us', href: '/contact', type: 'page' },
        { label: 'Sitemap', href: '/sitemap', type: 'page' },
        { label: 'Help / FAQ', href: '/help', type: 'page' },
    ];

    const filteredItems = searchQuery.trim() === ""
        ? []
        : searchableItems.filter(item =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);

    return (
        <header className={`sticky top-0 z-50 shadow-sm font-mukta transition-all ${isHighContrast ? 'bg-black text-white' : 'bg-white text-gray-800'}`}>
            {/* GIGW Top Utility Bar */}
            <div className={`border-b text-[11px] md:text-[13px] font-semibold py-1.5 ${isHighContrast ? 'bg-black border-white text-white' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2">
                    {/* Left: Skip to Content & Screen Reader Access */}
                    <div className="flex items-center gap-4">
                        <a href="#main-content" className="hover:underline focus:ring-2 focus:ring-blue-500 outline-none">
                            मुख्य सामग्री पर जाएं | Skip to Main Content
                        </a>
                        <span className="opacity-30">|</span>
                        <Link href="/screen-reader-access" className="hover:underline focus:ring-2 focus:ring-blue-500 outline-none">
                            स्क्रीन रीडर एक्सेस | Screen Reader Access
                        </Link>
                    </div>

                    {/* Right: Accessibility Controls */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 bg-white rounded-none">
                            <button
                                onClick={() => setFontSize(Math.max(80, fontSize - 10))}
                                className="px-2 py-0.5 hover:bg-gray-100 border-r border-gray-300 text-gray-700"
                                aria-label="Decrease font size"
                            >A-</button>
                            <button
                                onClick={() => setFontSize(100)}
                                className="px-2 py-0.5 hover:bg-gray-100 border-r border-gray-300 text-gray-700"
                                aria-label="Default font size"
                            >A</button>
                            <button
                                onClick={() => setFontSize(Math.min(120, fontSize + 10))}
                                className="px-2 py-0.5 hover:bg-gray-100 text-gray-700"
                                aria-label="Increase font size"
                            >A+</button>
                        </div>
                        <span className="opacity-30">|</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsHighContrast(false)}
                                className={`w-5 h-5 rounded-full border border-gray-300 bg-white ${!isHighContrast ? 'ring-2 ring-blue-500' : ''}`}
                                title="Standard View"
                            />
                            <button
                                onClick={() => setIsHighContrast(true)}
                                className={`w-5 h-5 rounded-full border border-gray-300 bg-black ${isHighContrast ? 'ring-2 ring-white' : ''}`}
                                title="High Contrast View"
                            />
                        </div>
                        <span className="opacity-30">|</span>
                        <LanguageSelector />
                    </div>
                </div>
            </div>

            {/* Main Branding Bar: MeitY Style */}
            <div className={`border-b ${isHighContrast ? 'bg-black border-white' : 'bg-white border-gray-100'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                    {/* Left: Branding Section */}
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-4">
                            <img src="/emblem.png" alt="Emblem" className="h-14 w-auto object-contain" />
                            <div className="flex flex-col border-l pl-4 border-gray-200">
                                <span className={`text-[10px] md:text-sm font-semibold leading-none mb-1 uppercase tracking-tight ${isHighContrast ? 'text-white' : 'text-gray-600'}`}>
                                    भारत सरकार | Government of India
                                </span>
                                <div className="flex flex-col">
                                    <h1 className={`font-black text-2xl md:text-4xl leading-tight tracking-tighter ${isHighContrast ? 'text-white' : 'text-[#003366]'}`}>
                                        S.A.T.Y.A
                                    </h1>
                                    <span className={`text-[10px] md:text-[12px] font-bold uppercase tracking-wider ${isHighContrast ? 'text-gray-300' : 'text-blue-600'}`}>
                                        भारत निर्वाचन आयोग | Election Commission of India
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Right: Digital India & Quick Actions */}
                    <div className="hidden lg:flex items-center gap-8">
                        <img
                            src="https://www.meity.gov.in/writereaddata/files/digital-india-logo.png"
                            alt="Digital India"
                            className={`h-10 w-auto ${isHighContrast ? 'grayscale invert' : 'opacity-80'}`}
                        />
                        <div className={`flex items-center gap-4 border-l pl-8 ${isHighContrast ? 'border-yellow-400' : 'border-gray-200'}`}>
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                aria-label="Open Search"
                                className="focus:outline-none focus:ring-2 focus:ring-blue-500 p-1"
                            >
                                <Search className={`w-5 h-5 cursor-pointer ${isHighContrast ? 'text-yellow-400' : 'text-[#003366]'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar: Horizontal Navigation with Dropdowns */}
            <nav className={`${isHighContrast ? 'bg-black border-t border-yellow-400' : 'bg-[#003366]'} text-white overflow-visible`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center no-scrollbar">
                        {navItems.map((item) => (
                            <div
                                key={item.id}
                                className="relative group"
                                onMouseEnter={() => setOpenDropdown(item.id)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <Link
                                    href={item.id === 'rumor' ? '/' : `/${item.id}`}
                                    onClick={() => {
                                        setActiveTab(item.id as any);
                                        setOpenDropdown(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') setOpenDropdown(null);
                                    }}
                                    aria-expanded={openDropdown === item.id}
                                    aria-haspopup={!!item.subItems}
                                    className={`flex items-center gap-1 px-5 py-3 text-sm font-bold whitespace-nowrap transition-all border-b-4 hover:bg-white/10 focus:outline-none focus:bg-white/20 focus:ring-2 focus:ring-inset focus:ring-blue-400 ${activeTab === item.id
                                        ? 'border-white bg-white/20'
                                        : 'border-transparent'
                                        }`}
                                >
                                    {item.label}
                                    {item.subItems && (
                                        <ChevronDown
                                            className={`w-3 h-3 transition-transform ${openDropdown === item.id ? 'rotate-180' : ''}`}
                                            aria-hidden="true"
                                        />
                                    )}
                                </Link>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {item.subItems && openDropdown === item.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            role="menu"
                                            className="absolute top-full left-0 bg-white text-gray-800 shadow-xl rounded-none border border-gray-200 py-1 min-w-[160px] z-[100]"
                                        >
                                            {item.subItems.map((sub, subIdx) => (
                                                <button
                                                    key={sub.id}
                                                    role="menuitem"
                                                    onClick={() => {
                                                        setActiveTab(item.id as any);
                                                        const subItem = sub as any;
                                                        if (subItem.setter) {
                                                            subItem.setter(subItem.id as any);
                                                        }
                                                        setOpenDropdown(null);

                                                        // Scroll to section
                                                        const element = document.getElementById(item.id);
                                                        if (element) {
                                                            element.scrollIntoView({ behavior: 'smooth' });
                                                        } else {
                                                            window.location.href = `/#${item.id}`;
                                                        }
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 hover:text-[#003366] transition-colors border-l-4 focus:outline-none focus:bg-gray-100 ${activeTab === item.id && (
                                                        (item.id === 'rumor' && rumorSubTab === sub.id) ||
                                                        (item.id === 'logic' && logicSubTab === sub.id) ||
                                                        (item.id === 'deepfake' && deepfakeSubTab === sub.id) ||
                                                        (item.id === 'voice' && voiceSubTab === sub.id) ||
                                                        (item.id === 'accessibility' && accessibilitySubTab === sub.id) ||
                                                        (item.id === 'game' && gameSubTab === sub.id) ||
                                                        (item.id === 'dividend' && dividendSubTab === sub.id) ||
                                                        (item.id === 'news' && newsSubTab === sub.id) ||
                                                        (item.id === 'margin' && marginSubTab === sub.id)
                                                    ) ? 'border-[#003366] bg-gray-50 text-[#003366]' : 'border-transparent'}`}
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

            {/* Global Search Overlay */}
            <AnimatePresence>
                {isSearchOpen && (
                    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                            onClick={() => setIsSearchOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className={`relative w-full max-w-2xl shadow-2xl overflow-hidden border ${isHighContrast ? 'bg-black border-white' : 'bg-white border-slate-200'}`}
                        >
                            <div className="p-4 border-b flex items-center gap-3">
                                <Search className={`w-6 h-6 ${isHighContrast ? 'text-white' : 'text-slate-400'}`} />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Search portal features, policies, or help..."
                                    className={`flex-1 bg-transparent border-none focus:ring-0 text-lg font-medium outline-none ${isHighContrast ? 'text-white placeholder-gray-500' : 'text-slate-900 placeholder-slate-400'}`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Escape') setIsSearchOpen(false);
                                    }}
                                />
                                <button
                                    onClick={() => setIsSearchOpen(false)}
                                    className={`text-xs font-bold uppercase tracking-widest px-2 py-1 border ${isHighContrast ? 'border-white text-white' : 'border-slate-200 text-slate-400'}`}
                                >
                                    Esc
                                </button>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto p-2">
                                {searchQuery.trim() === "" ? (
                                    <div className="p-8 text-center">
                                        <p className={`text-sm ${isHighContrast ? 'text-gray-400' : 'text-slate-500'}`}>Type to search across the S.A.T.Y.A portal</p>
                                    </div>
                                ) : filteredItems.length > 0 ? (
                                    <div className="space-y-1">
                                        {filteredItems.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setIsSearchOpen(false);
                                                    setSearchQuery("");
                                                    if (item.type === 'page') {
                                                        window.location.href = item.href;
                                                    } else {
                                                        const itemId = (item as any).id;
                                                        const el = document.getElementById(itemId || "");
                                                        if (el) {
                                                            el.scrollIntoView({ behavior: 'smooth' });
                                                            if (itemId) setActiveTab(itemId as any);
                                                        } else {
                                                            window.location.href = item.href;
                                                        }
                                                        if ('setter' in item && (item as any).setter) {
                                                            (item as any).setter(itemId as any);
                                                        }
                                                    }
                                                }}
                                                className={`w-full text-left px-4 py-3 flex items-center justify-between group transition-colors ${isHighContrast ? 'hover:bg-white hover:text-black' : 'hover:bg-slate-50'}`}
                                            >
                                                <div className="flex flex-col">
                                                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isHighContrast ? 'text-gray-400 group-hover:text-black' : 'text-slate-400'}`}>
                                                        {item.type}
                                                    </span>
                                                    <span className="font-bold">{item.label}</span>
                                                </div>
                                                <ChevronDown className="w-4 h-4 -rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-12 text-center space-y-3">
                                        <div className="p-3 bg-slate-50 inline-block rounded-full">
                                            <Search className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="font-bold text-slate-600">No results found for "{searchQuery}"</p>
                                        <p className="text-sm text-slate-400">Try searching for "ONOE", "Deepfake", or "Privacy"</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </header>
    );
}
