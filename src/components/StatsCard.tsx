"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingUp, ShieldCheck, Globe, BarChart3 } from "lucide-react";
import { T } from "./TranslatedText";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    const duration = 1800;
                    const steps = 60;
                    const increment = target / steps;
                    let current = 0;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            setCount(target);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(current));
                        }
                    }, duration / steps);
                }
            },
            { threshold: 0.3 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return (
        <span ref={ref}>
            {count.toLocaleString()}{suffix}
        </span>
    );
}

export function StatsCard() {
    return (
        <div className="bg-[#0B1F4F] text-white rounded-none p-6 shadow-xl relative overflow-hidden border border-white/10">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 animate-shimmer pointer-events-none" />
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -translate-x-12 -translate-y-12" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl translate-x-12 translate-y-12" />

            <div className="relative z-10 space-y-6">
                {/* Primary Stat */}
                <div className="text-center pb-5 border-b border-white/10">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-200 mb-3">
                        <TrendingUp className="w-3 h-3" />
                        <T>Live Dashboard</T>
                    </div>
                    <h2 className="text-5xl font-black font-mukta tracking-tight">
                        <AnimatedCounter target={15400} />
                    </h2>
                    <p className="text-blue-200 text-sm font-medium mt-1"><T>Messages Verified Today</T></p>
                </div>

                {/* Secondary Stats Grid */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="text-center bg-white/5 py-3 px-2 border border-white/5">
                        <ShieldCheck className="w-4 h-4 mx-auto mb-1.5 text-green-400" />
                        <p className="text-xl font-bold font-mukta">
                            <AnimatedCounter target={342} />
                        </p>
                        <p className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider"><T>Deepfakes Found</T></p>
                    </div>
                    <div className="text-center bg-white/5 py-3 px-2 border border-white/5">
                        <Globe className="w-4 h-4 mx-auto mb-1.5 text-orange-400" />
                        <p className="text-xl font-bold font-mukta">
                            <AnimatedCounter target={12} />
                        </p>
                        <p className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider"><T>Languages</T></p>
                    </div>
                    <div className="text-center bg-white/5 py-3 px-2 border border-white/5">
                        <BarChart3 className="w-4 h-4 mx-auto mb-1.5 text-yellow-400" />
                        <p className="text-xl font-bold font-mukta">
                            <AnimatedCounter target={97} suffix="%" />
                        </p>
                        <p className="text-[10px] text-blue-300 font-semibold uppercase tracking-wider"><T>Accuracy</T></p>
                    </div>
                </div>

                {/* Active Users */}
                <div className="flex items-center justify-center gap-3 bg-white/5 px-4 py-2.5 border border-white/5">
                    <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 border-2 border-[#0B1F4F]" />
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-[#0B1F4F]" />
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-[#0B1F4F]" />
                    </div>
                    <span className="text-xs font-semibold text-blue-200">+2,140 <T>active users now</T></span>
                </div>
            </div>
        </div>
    );
}
