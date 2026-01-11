"use client";

import { ShieldCheck, Menu } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import Link from "next/link";

export function SatyaHeader() {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

                {/* Logo Section */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                        <img src="/goi-logo.png" alt="Government of India" className="h-10 md:h-12 w-auto object-contain" />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
                        <Link href="#" className="hover:text-[#13316c] transition-colors">About</Link>
                        <Link href="#" className="hover:text-[#13316c] transition-colors">Guidelines</Link>
                        <Link href="#" className="hover:text-[#13316c] transition-colors">Contact</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <LanguageSelector />
                        <button className="px-5 py-2 text-sm font-bold text-[#13316c] border-2 border-[#13316c] rounded-none hover:bg-[#13316c] hover:text-white transition-all">
                            Official Login
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-3">
                    <LanguageSelector />
                    <button className="p-2 text-gray-600">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

            </div>
        </header>
    );
}
