"use client";

import { useTabs } from "@/contexts/TabContext";
import { ReactNode, useEffect } from "react";

export function AccessibilityWrapper({ children }: { children: ReactNode }) {
    const { isHighContrast, fontSize } = useTabs();

    useEffect(() => {
        // Apply class to html for global CSS selectors to work reliably
        if (isHighContrast) {
            document.documentElement.classList.add("high-contrast");
        } else {
            document.documentElement.classList.remove("high-contrast");
        }

        // Apply font size to root to affect rem units
        document.documentElement.style.fontSize = `${fontSize}%`;
    }, [isHighContrast, fontSize]);

    return (
        <div
            className={`min-h-screen transition-all duration-300 ${isHighContrast ? 'bg-black text-white' : ''}`}
        >
            {children}
            <style jsx global>{`
                .high-contrast * {
                    background-color: #000 !important;
                    color: #fff !important;
                    border-color: #fff !important;
                    background-image: none !important;
                    box-shadow: none !important;
                    text-shadow: none !important;
                    border-radius: 0 !important;
                }
                
                .high-contrast a, .high-contrast button {
                    color: #fff !important;
                    text-decoration: underline !important;
                    outline: 2px solid #fff !important;
                    outline-offset: 2px !important;
                }
                
                .high-contrast a:hover, .high-contrast button:hover {
                    background-color: #fff !important;
                    color: #000 !important;
                }

                .high-contrast img, .high-contrast svg, .high-contrast video {
                    filter: grayscale(100%) contrast(150%) brightness(100%) !important;
                    border: 1px solid #fff !important;
                }
                
                .high-contrast input, .high-contrast textarea, .high-contrast select {
                    background-color: #000 !important;
                    color: #fff !important;
                    border: 2px solid #fff !important;
                }
            `}</style>
        </div>
    );
}
