"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import Link from "next/link";
import { Map, Zap, Shield, HelpCircle, Info, Mail } from "lucide-react";

export default function Sitemap() {
    const sitemapLinks = [
        {
            category: "Core Features",
            icon: <Zap className="w-5 h-5 text-orange-500" />,
            links: [
                { label: "Rumor Buster", href: "/#rumor" },
                { label: "Logic Layer", href: "/#logic" },
                { label: "Deepfake Detective", href: "/#deepfake" },
                { label: "Voice AI", href: "/#voice" },
                { label: "Election News", href: "/#news" },
            ]
        },
        {
            category: "Documentation & Legal",
            icon: <Shield className="w-5 h-5 text-blue-500" />,
            links: [
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms & Conditions", href: "/terms" },
                { label: "Copyright Policy", href: "/copyright" },
                { label: "Hyperlink Policy", href: "/hyperlink" },
                { label: "Disclaimer", href: "/disclaimer" },
                { label: "Accessibility Statement", href: "/accessibility-statement" },
            ]
        },
        {
            category: "About & Support",
            icon: <Info className="w-5 h-5 text-green-500" />,
            links: [
                { label: "About Us", href: "/about" },
                { label: "Contact Us", href: "/contact" },
                { label: "RTI", href: "/rti" },
                { label: "Help / FAQ", href: "/help" },
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-white font-mukta">
            <Breadcrumb />

            <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <h1 className="text-4xl font-black text-slate-900 mb-8 border-b-4 border-orange-500 pb-4 flex items-center gap-3">
                    <Map className="w-8 h-8 text-[#003366]" />
                    Sitemap
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                    {sitemapLinks.map((section) => (
                        <div key={section.category} className="space-y-6">
                            <h2 className="text-2xl font-bold text-[#003366] flex items-center gap-3 border-b-2 border-slate-100 pb-3">
                                {section.icon}
                                {section.category}
                            </h2>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-slate-600 hover:text-blue-600 hover:underline transition-all flex items-center gap-2 group">
                                            <span className="w-1.5 h-1.5 bg-slate-200 group-hover:bg-blue-500 rounded-full transition-colors" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
