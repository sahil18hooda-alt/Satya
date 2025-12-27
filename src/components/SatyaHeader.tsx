import React from 'react';
import Image from 'next/image';

export function SatyaHeader() {
    return (
        <header className="w-full bg-white shadow-md border-b-4 border-b-orange-500 relative z-50">
            {/* Tricolor Strip Top */}
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

                {/* Left: Govt Identity */}
                <div className="flex items-center gap-3">
                    {/* Emblem Image */}
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-16 relative flex items-center justify-center">
                            <Image
                                src="/emblem.png"
                                alt="National Emblem of India"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                    </div>

                    <div className="h-10 w-[1px] bg-gray-300 mx-2 hidden sm:block"></div>

                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Government of India</span>
                        <span className="text-[0.65rem] font-semibold text-gray-400">Initiative for Digital Integrity</span>
                    </div>
                </div>

                {/* Center/Right: S.A.T.Y.A Branding */}
                <div className="text-right">
                    <h1 className="text-2xl md:text-3xl font-black text-[#1d2d50] tracking-tight leading-none">
                        S.A.T.Y.A. <span className="text-orange-600 text-lg md:text-xl font-serif">(सत्य)</span>
                    </h1>
                    <p className="text-[0.6rem] md:text-xs font-bold text-orange-700 tracking-wider uppercase mt-1">
                        System for Authentic Tracking & Youth Awareness
                    </p>
                </div>

            </div>
        </header>
    );
}
