"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Download, Share2, ArrowLeft, Phone, Mail, ExternalLink } from "lucide-react";
import { disabilityCategories, DisabilityCategory, Section } from "@/data/accessibilityContent";

export function AccessibilityAssistant() {
    const [selectedCategory, setSelectedCategory] = useState<DisabilityCategory | null>(null);
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

    const toggleSection = (sectionKey: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionKey)) {
            newExpanded.delete(sectionKey);
        } else {
            newExpanded.add(sectionKey);
        }
        setExpandedSections(newExpanded);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        if (navigator.share && selectedCategory) {
            try {
                await navigator.share({
                    title: `Voting Rights - ${selectedCategory.name}`,
                    text: `Information about voting rights and facilities for ${selectedCategory.name}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log("Share failed:", err);
            }
        }
    };

    if (!selectedCategory) {
        return (
            <div className="w-full max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                        Accessibility & Voting Rights
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                        Comprehensive information about voting facilities, rights, and benefits for persons with disabilities.
                        Select your category to learn about the special provisions available to you.
                    </p>
                </div>

                {/* Category Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {disabilityCategories.map((category) => (
                        <motion.button
                            key={category.id}
                            onClick={() => setSelectedCategory(category)}
                            className="bg-white border-2 border-slate-200 rounded-none p-6 text-left hover:border-blue-500 hover:shadow-lg transition-all group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            aria-label={`Select ${category.name}`}
                        >
                            <div className="text-5xl mb-4">{category.icon}</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600">
                                {category.name}
                            </h3>
                            <p className="text-sm text-slate-600">{category.description}</p>
                        </motion.button>
                    ))}
                </div>

                {/* Important Notice */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-none p-6">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">📞 Need Immediate Help?</h3>
                    <p className="text-blue-800 mb-3">
                        National Voters' Helpline: <strong className="text-2xl">1950</strong> (Toll-Free)
                    </p>
                    <p className="text-sm text-blue-700">
                        Email: complaints@eci.gov.in | Available 24/7 for voter assistance
                    </p>
                </div>
            </div>
        );
    }

    // Information Display Screen
    const renderSection = (title: string, section: Section, sectionKey: string) => {
        const isExpanded = expandedSections.has(sectionKey);

        return (
            <div key={sectionKey} className="border-b border-slate-200 last:border-0">
                <button
                    onClick={() => toggleSection(sectionKey)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                    aria-expanded={isExpanded}
                >
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    {isExpanded ? (
                        <ChevronUp className="w-6 h-6 text-slate-600" />
                    ) : (
                        <ChevronDown className="w-6 h-6 text-slate-600" />
                    )}
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-6"
                        >
                            <div className="space-y-4">
                                {section.content && section.content.map((paragraph, idx) => (
                                    <p key={idx} className="text-slate-700 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}

                                {section.subsections && section.subsections.map((subsection, idx) => (
                                    <div key={idx} className="mt-4">
                                        <h4 className="font-bold text-lg text-slate-900 mb-2">
                                            {subsection.title}
                                        </h4>
                                        <ul className="list-disc list-inside space-y-2 ml-2">
                                            {subsection.items.map((item, itemIdx) => (
                                                <li key={itemIdx} className="text-slate-700 leading-relaxed">
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Categories
                </button>

                <div className="flex gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-none transition-colors"
                        aria-label="Print this information"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Print/Save PDF</span>
                    </button>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-none transition-colors"
                        aria-label="Share this information"
                    >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Share</span>
                    </button>
                </div>
            </div>

            {/* Category Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-none p-8">
                <div className="flex items-start gap-4">
                    <div className="text-6xl">{selectedCategory.icon}</div>
                    <div>
                        <h2 className="text-3xl font-bold mb-2">{selectedCategory.name}</h2>
                        <p className="text-blue-100 text-lg">{selectedCategory.description}</p>
                        {selectedCategory.subcategories && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {selectedCategory.subcategories.map((sub, idx) => (
                                    <span key={idx} className="bg-blue-500 bg-opacity-50 px-3 py-1 rounded-none text-sm">
                                        {sub}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Information Sections */}
            <div className="bg-white rounded-none border-2 border-slate-200 overflow-hidden">
                {renderSection("📝 Registration & Documentation", selectedCategory.info.registration, "registration")}
                {renderSection("🏢 Voting Facilities at Polling Stations", selectedCategory.info.pollingFacilities, "facilities")}
                {renderSection("🤝 Companion/Assistant Rights", selectedCategory.info.companionRights, "companion")}
                {renderSection("📮 Postal Ballot Facility", selectedCategory.info.postalBallot, "postal")}
                {renderSection("📞 Helpline & Support Services", selectedCategory.info.helplines, "helplines")}
                {renderSection("✨ Special Provisions & Rights", selectedCategory.info.specialProvisions, "provisions")}
                {renderSection("🏛️ Recent Government Initiatives", selectedCategory.info.governmentInitiatives, "initiatives")}
                {renderSection("⚖️ Know Your Rights", selectedCategory.info.yourRights, "rights")}
                {renderSection("✅ Pre-Election Checklist", selectedCategory.info.preElectionChecklist, "checklist")}
                {renderSection("📧 Contact & Support", selectedCategory.info.contacts, "contacts")}
            </div>

            {/* Quick Contact Card */}
            <div className="bg-green-50 border-2 border-green-200 rounded-none p-6">
                <h3 className="text-lg font-bold text-green-900 mb-4">🆘 Quick Contact Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-green-700" />
                        <div>
                            <p className="text-sm text-green-700">National Helpline</p>
                            <p className="text-xl font-bold text-green-900">1950</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-green-700" />
                        <div>
                            <p className="text-sm text-green-700">Email Support</p>
                            <p className="font-medium text-green-900">complaints@eci.gov.in</p>
                        </div>
                    </div>
                </div>
                <a
                    href="https://www.nvsp.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
                >
                    <ExternalLink className="w-4 h-4" />
                    Visit National Voters' Service Portal (NVSP)
                </a>
            </div>
        </div>
    );
}
