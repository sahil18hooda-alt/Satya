"use client";

import Link from "next/link";
import { Facebook, Twitter, Youtube, Mail, Phone, ExternalLink } from "lucide-react";

export function GovFooter() {
    const currentYear = new Date().getFullYear();
    const lastUpdated = "12 Jan 2026"; // Hardcoded for this version or can use dynamic logic

    const footerLinks = [
        { label: "Website Policies", href: "/policies" },
        { label: "Help", href: "/help" },
        { label: "Contact Us", href: "/contact" },
        { label: "Feedback", href: "/feedback" },
        { label: "Sitemap", href: "/sitemap" },
        { label: "Visitor Summary", href: "/visitors" },
    ];

    const legalLinks = [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Copyright Policy", href: "/copyright" },
        { label: "Hyperlinking Policy", href: "/hyperlink" },
        { label: "Disclaimer", href: "/disclaimer" },
        { label: "Accessibility Statement", href: "/accessibility-statement" },
    ];

    return (
        <footer aria-label="Official Government Footer" className="bg-slate-900 text-white mt-12 border-t-4 border-orange-500 font-mukta relative z-10">
            {/* Top Footer: Quick Links & Contact */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Column 1: Portal About */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img src="/emblem.png" alt="Emblem" className="h-12 w-auto invert" />
                            <div className="flex flex-col border-l pl-3 border-slate-700">
                                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                                    Government of India
                                </span>
                                <h2 className="text-xl font-black tracking-tight">S.A.T.Y.A</h2>
                            </div>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            System for Advanced Truth & Yield Analysis. An official initiative for transparent and accessible election insights.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-sky-500 transition-colors">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-slate-800 rounded-full hover:bg-red-600 transition-colors">
                                <Youtube className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Useful Links */}
                    <div>
                        <h3 className="text-orange-400 font-bold uppercase text-sm mb-6 pb-2 border-b border-slate-800">
                            Useful Links
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-slate-300 hover:text-white text-sm flex items-center gap-2 group transition-all">
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full group-hover:scale-150 transition-transform" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h3 className="text-orange-400 font-bold uppercase text-sm mb-6 pb-2 border-b border-slate-800">
                            Contact Support
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-slate-500 mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 uppercase font-bold">Email Us</span>
                                    <span className="text-slate-200 text-sm">support-satya@gov.in</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-slate-500 mt-0.5" />
                                <div className="flex flex-col">
                                    <span className="text-xs text-slate-500 uppercase font-bold">Helpline</span>
                                    <span className="text-slate-200 text-sm">1800-ELE-SATYA (Toll Free)</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: External Portals */}
                    <div>
                        <h3 className="text-orange-400 font-bold uppercase text-sm mb-6 pb-2 border-b border-slate-800">
                            Related Portals
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="https://india.gov.in" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white text-sm flex items-center justify-between group">
                                    india.gov.in
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </li>
                            <li>
                                <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white text-sm flex items-center justify-between group">
                                    Election Commission
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </li>
                            <li>
                                <a href="https://digitalindia.gov.in" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white text-sm flex items-center justify-between group">
                                    Digital India
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Middle Footer: Mandatory Legal Links */}
            <div className="bg-slate-950/50 border-y border-slate-800 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                        {legalLinks.map((link) => (
                            <li key={link.label}>
                                <Link href={link.href} className="hover:text-white hover:underline transition-colors">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom Footer: Copyright & Metadata */}
            <div className="bg-slate-950 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:items-start items-center gap-2">
                        <p className="text-slate-500 text-xs text-center md:text-left">
                            © {currentYear} S.A.T.Y.A Portal. Content owned, updated and maintained by the Election Commission of India.
                        </p>
                        <p className="text-slate-600 text-[10px]">
                            Last Updated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} | Developed by Advanced Agentic Coding Team
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
