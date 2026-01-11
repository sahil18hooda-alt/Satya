"use client";

import { Search, Bell, Twitter, Facebook, Linkedin, Youtube, Instagram, MessageCircle } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import Link from "next/link";

export function SatyaHeader() {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">

                {/* Left: Branding Section */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex items-center gap-3">
                        <img src="/emblem.png" alt="Emblem" className="h-12 w-auto object-contain" />
                        <div className="flex flex-col">
                            <h1 className="text-[#003366] font-extrabold text-xl md:text-2xl leading-tight tracking-tight">
                                S.A.T.Y.A verify
                            </h1>
                            <p className="text-gray-600 text-[10px] md:text-sm font-medium leading-none">
                                Government of India
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Right: Social, Search, Action Section */}
                <div className="hidden lg:flex items-center gap-6">
                    {/* Social Icons */}
                    <div className="flex items-center gap-3 border-r pr-6 border-gray-200">
                        <Twitter className="w-4 h-4 text-gray-700 hover:text-blue-400 cursor-pointer" />
                        <MessageCircle className="w-4 h-4 text-green-600 hover:text-green-700 cursor-pointer" />
                        <Facebook className="w-4 h-4 text-blue-700 hover:text-blue-800 cursor-pointer" />
                        <Linkedin className="w-4 h-4 text-blue-600 hover:text-blue-700 cursor-pointer" />
                        <Youtube className="w-4 h-4 text-red-600 hover:text-red-700 cursor-pointer" />
                        <div className="w-4 h-4 bg-black rounded-none flex items-center justify-center p-0.5">
                            <span className="text-[8px] text-white font-bold">X</span>
                        </div>
                        <Instagram className="w-4 h-4 text-pink-600 hover:text-pink-700 cursor-pointer" />
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="pl-4 pr-10 py-1.5 border border-gray-300 rounded-none text-sm focus:outline-none focus:ring-1 focus:ring-[#003366] w-64"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                    </div>

                    {/* Action Button */}
                    <button className="bg-[#e43c12] text-white px-4 py-1.5 text-sm font-bold flex items-center gap-2 rounded-none hover:bg-[#c93510] transition-colors whitespace-nowrap">
                        <Bell className="w-4 h-4" />
                        What's New
                    </button>

                    <LanguageSelector />
                </div>

                {/* Mobile Menu (Simplified) */}
                <div className="lg:hidden flex items-center gap-2">
                    <LanguageSelector />
                    <button className="bg-[#e43c12] p-2 text-white rounded-none">
                        <Bell className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </header>
    );
}
