"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

/**
 * Component that automatically translates text based on selected language
 * Usage: <T>Your text here</T>
 */
export function T({ children }: { children: string }) {
    const { currentLanguage, translateNow } = useLanguage();
    const [translated, setTranslated] = useState(children);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        if (currentLanguage === 'en') {
            setTranslated(children);
            return;
        }

        setIsTranslating(true);
        translateNow(children)
            .then(result => {
                setTranslated(result);
                setIsTranslating(false);
            })
            .catch(() => {
                setTranslated(children);
                setIsTranslating(false);
            });
    }, [currentLanguage, children, translateNow]);

    return <>{translated}</>;
}
