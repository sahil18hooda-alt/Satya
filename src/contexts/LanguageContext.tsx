"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type LanguageContextType = {
    currentLanguage: string;
    setLanguage: (lang: string) => void;
    t: (text: string, context?: string) => Promise<string>;
    translateNow: (text: string) => Promise<string>;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const INDIAN_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi (हिंदी)' },
    { code: 'bn', name: 'Bengali (বাংলা)' },
    { code: 'te', name: 'Telugu (తెలుగు)' },
    { code: 'ta', name: 'Tamil (தமிழ்)' },
    { code: 'mr', name: 'Marathi (मराठी)' },
    { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
    { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
    { code: 'ml', name: 'Malayalam (മലയാളം)' },
    { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
    { code: 'or', name: 'Odia (ଓଡ଼ିଆ)' },
    { code: 'as', name: 'Assamese (অসমীয়া)' },
];

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [translationCache, setTranslationCache] = useState<Record<string, Record<string, string>>>({});

    useEffect(() => {
        const saved = localStorage.getItem('satya_lang');
        if (saved) setCurrentLanguage(saved);
    }, []);

    const setLanguage = (lang: string) => {
        setCurrentLanguage(lang);
        localStorage.setItem('satya_lang', lang);
    };

    const translateNow = async (text: string): Promise<string> => {
        if (currentLanguage === 'en') return text;

        // Check cache
        if (translationCache[currentLanguage]?.[text]) {
            return translationCache[currentLanguage][text];
        }

        try {
            // Use relative URL for Next.js rewrite or direct localhost during dev if needed
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/translate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, target_language: currentLanguage })
            });

            if (!res.ok) throw new Error('Translation failed');

            const data = await res.json();
            const translated = data.translated_text;

            // Update cache
            setTranslationCache(prev => ({
                ...prev,
                [currentLanguage]: {
                    ...(prev[currentLanguage] || {}),
                    [text]: translated
                }
            }));

            return translated;
        } catch (e) {
            console.error("Translation failed", e);
            return text;
        }
    };

    // 't' can be used for async translation in effects, but for immediate rendering verify use
    const t = async (text: string) => {
        return await translateNow(text);
    };

    return (
        <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, translateNow }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
