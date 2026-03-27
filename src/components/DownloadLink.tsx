"use client";

import { FileDown, Info } from "lucide-react";
import { T } from "./TranslatedText";

interface DownloadLinkProps {
    title: string;
    href: string;
    size: string;
    format: string;
    instructions?: string;
    className?: string;
}

/**
 * GIGW 3.0 Compliant Download Link Component
 * Rule 1.d: Complete information including title, size, format, and usage instructions 
 * must be provided for all downloadable material.
 */
export function DownloadLink({
    title,
    href,
    size,
    format,
    instructions = "Click to download the file. Ensure you have a compatible viewer installed.",
    className = ""
}: DownloadLinkProps) {
    return (
        <div className={`p-4 border border-gray-200 bg-white/80 backdrop-blur-sm flex flex-col gap-3 ${className}`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h4 className="font-bold text-gray-900 leading-tight">
                        <T>{title}</T>
                    </h4>
                    <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        <span className="bg-gray-200 px-2 py-0.5 rounded"><T>{format}</T></span>
                        <span><T>{size}</T></span>
                    </div>
                </div>
                <a
                    href={href}
                    download
                    className="flex items-center gap-2 bg-[#003366] text-white px-4 py-2 rounded font-bold text-sm hover:bg-blue-800 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 outline-none"
                    aria-label={`Download ${title} (${format}, ${size})`}
                >
                    <FileDown className="w-4 h-4" />
                    <T>Download</T>
                </a>
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50/50 p-2 rounded">
                <Info className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                <p>
                    <span className="font-bold uppercase text-[10px] text-blue-700 block mb-0.5"><T>Usage Instructions</T>:</span>
                    <T>{instructions}</T>
                </p>
            </div>
        </div>
    );
}
