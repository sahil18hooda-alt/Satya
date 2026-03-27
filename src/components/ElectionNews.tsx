"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, ArrowRight, Share2, Tag, Globe, Clock, ExternalLink, TrendingUp, Flame, Loader2 } from "lucide-react";
import { useTabs } from "@/contexts/TabContext";
import { useLanguage, INDIAN_LANGUAGES } from "@/contexts/LanguageContext";
import { T } from "./TranslatedText";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Official", "Analysis", "Security", "Campaign", "Legal", "Fact Check"];

interface NewsItem {
    headline: string;
    summary: string;
    source: string;
    date: string;
    category: string;
    trending: boolean;
    image: string;
}

const NEWS_DATA_EN: NewsItem[] = [
    {
        headline: "Election Commission Announces Dates for 2026 General Elections",
        summary: "The ECI has finalized the schedule for the upcoming general elections, spanning 7 phases starting from April 15th. Over 97 crore eligible voters will participate in what is being called the largest democratic exercise in history.",
        source: "ECI Official",
        date: "2 hours ago",
        category: "Official",
        trending: true,
        image: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=600&h=400&fit=crop",
    },
    {
        headline: "Voter Turnout Expected to Cross 70% in Phase 1",
        summary: "Analysts predict a record-breaking turnout in the first phase of polling due to increased awareness campaigns and new registration drives targeting first-time voters.",
        source: "India Today",
        date: "4 hours ago",
        category: "Analysis",
        trending: true,
        image: "https://images.unsplash.com/photo-1494172961521-33799ddd43a5?w=600&h=400&fit=crop",
    },
    {
        headline: "New Guidelines for Polling Booth Security Released",
        summary: "Strict measures including drone surveillance and webcasting will be implemented across all sensitive booths. Over 1.5 lakh micro-observers have been deployed.",
        source: "PIB",
        date: "Yesterday",
        category: "Security",
        trending: false,
        image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&h=400&fit=crop",
    },
    {
        headline: "Supreme Court Hears Plea on EVM Verification",
        summary: "The apex court has agreed to hear a PIL seeking 100% VVPAT verification for the upcoming polls. The bench will deliver its verdict before the first phase of voting.",
        source: "Live Law",
        date: "6 hours ago",
        category: "Legal",
        trending: false,
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop",
    },
    {
        headline: "Fact Check: Viral Video of Ballot Stuffing is From 2019",
        summary: "A video circulating on WhatsApp claims to show recent ballot stuffing but is actually from a 2019 mock drill. ECI has issued a clarification and FIR has been filed.",
        source: "S.A.T.Y.A Verify",
        date: "1 hour ago",
        category: "Fact Check",
        trending: true,
        image: "https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=600&h=400&fit=crop",
    },
    {
        headline: "Digital India Initiative Enables Remote Voting Pilot",
        summary: "A pilot project for remote voting using blockchain technology has been approved for select constituencies, marking a historic step in e-governance.",
        source: "DD News",
        date: "Today",
        category: "Official",
        trending: false,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    }
];

const CATEGORY_COLORS: Record<string, string> = {
    "Official": "bg-blue-100 text-blue-800 border-blue-200",
    "Analysis": "bg-amber-100 text-amber-800 border-amber-200",
    "Security": "bg-red-100 text-red-800 border-red-200",
    "Campaign": "bg-green-100 text-green-800 border-green-200",
    "Legal": "bg-purple-100 text-purple-800 border-purple-200",
    "Fact Check": "bg-orange-100 text-orange-800 border-orange-200",
};

export function ElectionNews() {
    const { newsSubTab: subTab } = useTabs();
    const { currentLanguage, setLanguage, translateNow } = useLanguage();
    const [activeCategory, setActiveCategory] = useState("All");
    const [newsData, setNewsData] = useState<NewsItem[]>(NEWS_DATA_EN);
    const [isTranslating, setIsTranslating] = useState(false);

    // Translate all news when language changes
    useEffect(() => {
        if (currentLanguage === 'en') {
            setNewsData(NEWS_DATA_EN);
            return;
        }

        let cancelled = false;
        const translateAll = async () => {
            setIsTranslating(true);
            try {
                const translated = await Promise.all(
                    NEWS_DATA_EN.map(async (item) => {
                        const [headline, summary] = await Promise.all([
                            translateNow(item.headline),
                            translateNow(item.summary),
                        ]);
                        return { ...item, headline, summary };
                    })
                );
                if (!cancelled) {
                    setNewsData(translated);
                }
            } catch (e) {
                console.error("News translation failed:", e);
                if (!cancelled) setNewsData(NEWS_DATA_EN);
            } finally {
                if (!cancelled) setIsTranslating(false);
            }
        };

        translateAll();
        return () => { cancelled = true; };
    }, [currentLanguage, translateNow]);

    const filteredNews = activeCategory === "All"
        ? newsData
        : newsData.filter(item => item.category === activeCategory);

    const featuredStory = newsData.find(n => n.trending) || newsData[0];
    const remainingNews = filteredNews.filter(n => n !== featuredStory);

    const langName = INDIAN_LANGUAGES.find(l => l.code === currentLanguage)?.name || 'English';

    return (
        <div className="w-full space-y-8">
            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Category Filters */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all ${
                                activeCategory === cat
                                    ? "bg-[#0B1F4F] text-white border-[#0B1F4F]"
                                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                            }`}
                        >
                            <T>{cat}</T>
                        </button>
                    ))}
                </div>

                {/* Language Selector — wired to global context */}
                <div className="bg-white border border-slate-200 p-1.5 pl-3 flex items-center gap-2 shadow-sm">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <select
                        value={currentLanguage}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-transparent border-none text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-6"
                    >
                        {INDIAN_LANGUAGES.map(lang => (
                            <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Translation Progress Banner */}
            <AnimatePresence>
                {isTranslating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center justify-center gap-3 bg-blue-50 border border-blue-200 py-3 px-4"
                    >
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <p className="text-sm font-semibold text-blue-700">
                            Translating news to <span className="text-blue-900">{langName}</span>...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Featured Story */}
            {activeCategory === "All" && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative group overflow-hidden bg-slate-900 text-white shadow-xl cursor-pointer"
                >
                    <div className="absolute inset-0">
                        <img
                            src={featuredStory.image}
                            alt={featuredStory.headline}
                            className="w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent" />
                    </div>
                    <div className="relative z-10 p-8 md:p-12 flex flex-col justify-end min-h-[320px]">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="inline-flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                <Flame className="w-3 h-3" />
                                <T>Breaking</T>
                            </span>
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${CATEGORY_COLORS[featuredStory.category] || "bg-white/20 text-white border-white/30"}`}>
                                {featuredStory.category}
                            </span>
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black leading-tight mb-3 group-hover:text-orange-200 transition-colors">
                            {featuredStory.headline}
                        </h2>
                        <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-3xl mb-4">
                            {featuredStory.summary}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-white/50">
                            <span className="font-bold text-orange-400">{featuredStory.source}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featuredStory.date}</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeCategory === "All" ? remainingNews : filteredNews).map((item, i) => (
                    <motion.div
                        key={`${currentLanguage}-${i}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col h-full cursor-pointer"
                    >
                        {/* Image */}
                        <div className="h-44 relative overflow-hidden bg-slate-100">
                            <img
                                src={item.image}
                                alt={item.headline}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                            />
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm ${CATEGORY_COLORS[item.category] || "bg-white/90 text-slate-700 border-slate-200"}`}>
                                    <Tag className="w-2.5 h-2.5 inline mr-1" />
                                    {item.category}
                                </span>
                                {item.trending && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white flex items-center gap-1">
                                        <TrendingUp className="w-2.5 h-2.5" /> <T>Trending</T>
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex flex-col flex-grow">
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-3">
                                <span className="font-bold text-[#0B1F4F] bg-blue-50 px-2 py-0.5">{item.source}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.date}</span>
                            </div>

                            <h3 className="font-bold text-base mb-2.5 leading-tight text-slate-800 group-hover:text-[#0B1F4F] transition-colors">
                                {item.headline}
                            </h3>

                            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-grow">
                                {item.summary}
                            </p>

                            <div className="pt-3 border-t border-slate-100 flex justify-between items-center mt-auto">
                                <button className="text-xs font-bold text-[#0B1F4F] flex items-center gap-1 hover:gap-2 transition-all">
                                    <T>Read Full Story</T> <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                                <button className="text-slate-300 hover:text-slate-500 transition-colors">
                                    <Share2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Empty State */}
            {filteredNews.length === 0 && (
                <div className="text-center py-16 bg-white/50 border border-dashed border-slate-200">
                    <p className="text-slate-400 font-semibold"><T>No news found in this category.</T></p>
                </div>
            )}
        </div>
    );
}
