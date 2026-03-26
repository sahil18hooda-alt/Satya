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
                /* Government-Style High Contrast Mode (like india.gov.in) */
                .high-contrast {
                    background-color: #000 !important;
                    color: #FFFF00 !important;
                }
                
                .high-contrast * {
                    background-color: #000 !important;
                    color: #FFFF00 !important;
                    border-color: #FFFF00 !important;
                    box-shadow: none !important;
                    text-shadow: none !important;
                }
                
                /* Links and Buttons - Yellow with high contrast */
                .high-contrast a, 
                .high-contrast button {
                    color: #FFFF00 !important;
                    text-decoration: underline !important;
                    background-color: #000 !important;
                    border: 2px solid #FFFF00 !important;
                    outline: none !important;
                }
                
                .high-contrast a:hover, 
                .high-contrast button:hover,
                .high-contrast a:focus,
                .high-contrast button:focus {
                    background-color: #FFFF00 !important;
                    color: #000 !important;
                    border-color: #FFFF00 !important;
                    outline: 3px solid #FFFF00 !important;
                    outline-offset: 2px !important;
                }

                /* Images and Media - Inverted with high contrast */
                .high-contrast img, 
                .high-contrast svg, 
                .high-contrast video {
                    filter: invert(1) contrast(2) brightness(1.2) !important;
                    border: 2px solid #FFFF00 !important;
                }
                
                /* Form Elements */
                .high-contrast input, 
                .high-contrast textarea, 
                .high-contrast select {
                    background-color: #000 !important;
                    color: #FFFF00 !important;
                    border: 2px solid #FFFF00 !important;
                    caret-color: #FFFF00 !important;
                }
                
                .high-contrast input:focus,
                .high-contrast textarea:focus,
                .high-contrast select:focus {
                    outline: 3px solid #FFFF00 !important;
                    outline-offset: 2px !important;
                    border-color: #FFFF00 !important;
                }
                
                .high-contrast input::placeholder,
                .high-contrast textarea::placeholder {
                    color: #CCCC00 !important;
                    opacity: 0.8 !important;
                }

                /* Headers and Important Text */
                .high-contrast h1,
                .high-contrast h2,
                .high-contrast h3,
                .high-contrast h4,
                .high-contrast h5,
                .high-contrast h6 {
                    color: #FFFF00 !important;
                    font-weight: bold !important;
                }

                /* Borders and Dividers */
                .high-contrast hr,
                .high-contrast .border,
                .high-contrast [class*="border"] {
                    border-color: #FFFF00 !important;
                }

                /* Remove rounded corners for government style */
                .high-contrast * {
                    border-radius: 0 !important;
                }

                /* Focus indicators for accessibility */
                .high-contrast *:focus {
                    outline: 3px solid #FFFF00 !important;
                    outline-offset: 2px !important;
                }

                /* Disabled elements */
                .high-contrast *:disabled,
                .high-contrast [disabled] {
                    opacity: 0.5 !important;
                    cursor: not-allowed !important;
                }

                /* Selected text */
                .high-contrast ::selection {
                    background-color: #FFFF00 !important;
                    color: #000 !important;
                }
            `}</style>
        </div>
    );
}
