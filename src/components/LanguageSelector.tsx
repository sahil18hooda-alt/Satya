"use client";

import { useLanguage, INDIAN_LANGUAGES } from "@/contexts/LanguageContext";
import { Check, ChevronDown, Globe } from "lucide-react";
import { useState, useEffect } from "react";

// Declare Google Translate types
declare global {
    interface Window {
        google: any;
        googleTranslateElementInit: () => void;
    }
}

export function LanguageSelector() {
    const { currentLanguage, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isGoogleTranslateLoaded, setIsGoogleTranslateLoaded] = useState(false);

    const selectedLang = INDIAN_LANGUAGES.find(l => l.code === currentLanguage)?.name || 'Language';

    // Initialize Google Translate
    useEffect(() => {
        // Load Google Translate script
        if (!document.getElementById('google-translate-script')) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        }

        // Initialize Google Translate widget
        window.googleTranslateElementInit = function () {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'en,hi,bn,te,ta,mr,gu,kn,ml,pa,or,as',
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                        autoDisplay: false
                    },
                    'google_translate_element'
                );
                setIsGoogleTranslateLoaded(true);
            }
        };
    }, []);

    // Trigger translation when language changes
    useEffect(() => {
        if (isGoogleTranslateLoaded && currentLanguage !== 'en') {
            const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement;
            if (selectElement) {
                selectElement.value = currentLanguage;
                selectElement.dispatchEvent(new Event('change'));
            }
        }
    }, [currentLanguage, isGoogleTranslateLoaded]);

    return (
        <>
            {/* Hidden Google Translate Element */}
            <div id="google_translate_element" style={{ display: 'none' }}></div>

            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-white border border-gray-300 text-sm font-medium hover:bg-gray-50 transition-all text-black"
                >
                    <Globe className="w-4 h-4" />
                    <span className="hidden md:inline">{selectedLang}</span>
                    <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-56 max-h-96 overflow-y-auto bg-white dark:bg-zinc-900 rounded-none shadow-xl border border-zinc-200 dark:border-zinc-800 z-50 py-2">
                            <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                Select Language (BharatGen)
                            </div>
                            {INDIAN_LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setIsOpen(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-orange-50 dark:hover:bg-orange-900/10 flex items-center justify-between group transition-colors"
                                >
                                    <span className={`group-hover:text-orange-600 ${currentLanguage === lang.code ? 'text-orange-600 font-semibold' : 'text-zinc-700 dark:text-zinc-300'}`}>
                                        {lang.name}
                                    </span>
                                    {currentLanguage === lang.code && <Check className="w-3 h-3 text-orange-600" />}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Hide Google Translate banner */}
            <style jsx global>{`
                .goog-te-banner-frame {
                    display: none !important;
                }
                body {
                    top: 0 !important;
                }
                .skiptranslate {
                    display: none !important;
                }
            `}</style>
        </>
    );
}
