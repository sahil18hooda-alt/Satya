"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ElectionEvent } from "@/data/ElectionData";
import { Calendar, Tag, Info, AlertTriangle, ShieldCheck } from "lucide-react";
import { T } from "./TranslatedText";

interface TimelineRendererProps {
    events: ElectionEvent[];
    isONOE: boolean;
}

export function TimelineRenderer({ events, isONOE }: TimelineRendererProps) {
    // Sort events by year
    const sortedEvents = [...events].sort((a, b) => a.year - b.year);

    return (
        <div className="relative max-w-2xl mx-auto py-10">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2 z-0" />

            <div className="relative z-10 space-y-12">
                <AnimatePresence mode="popLayout">
                    {sortedEvents.map((event, index) => (
                        <motion.div
                            key={`${event.year}-${event.type}-${isONOE}`}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className={`flex items-center justify-between w-full ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
                        >
                            {/* Year Indicator */}
                            <div className="w-[45%] flex flex-col items-center justify-center">
                                <span className={`text-2xl font-black ${isONOE ? 'text-green-600' : 'text-slate-900'} transition-colors`}>
                                    {event.year}
                                </span>
                                <div className={`h-1 w-12 ${isONOE ? 'bg-green-500' : 'bg-orange-500'} mt-1`} />
                            </div>

                            {/* Node Dot */}
                            <div className="relative">
                                <div className={`w-4 h-4 rounded-full border-4 border-white shadow-md ${isONOE ? 'bg-green-500' : 'bg-[#0B1F4F]'} z-20`} />
                            </div>

                            {/* Content Card */}
                            <div className={`w-[45%] bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all ${isONOE ? 'border-green-100' : ''}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Tag className={`w-3 h-3 ${isONOE ? 'text-green-600' : 'text-blue-600'}`} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                        <T>{event.type}</T>
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-slate-800 mb-3">
                                    {event.type} {event.year} ({event.state === 'ALL' ? 'National' : event.state})
                                </h4>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-2.5 h-2.5" />
                                            <span>MCC Days:</span>
                                        </div>
                                        <span className="text-slate-900 font-bold">{event.mcc_days}d</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-medium text-slate-500">
                                        <span>Est. Cost:</span>
                                        <span className="text-slate-900 font-bold">₹{event.est_cost_per_voter}/voter</span>
                                    </div>
                                </div>

                                {isONOE && event.is_onoe_consolidated && (
                                    <div className="mt-3 pt-3 border-t border-green-50 bg-green-50/50 -mx-4 -mb-4 p-3 flex items-center gap-2">
                                        <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                                        <span className="text-[9px] font-bold text-green-700 leading-tight">
                                            CONSOLIDATED: Lok Sabha + Vidhan Sabha
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            
            {/* Legend for the ONOE Universe */}
            {isONOE && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-12 bg-green-50 border border-green-200 p-4 flex gap-3 italic text-xs text-green-800"
                >
                    <Info className="w-5 h-5 shrink-0" />
                    <p>
                        <T>In the ONOE Universe, elections are synchronized to occur every 5 years. This view simulates the consolidation of multiple voting cycles into single unified events.</T>
                    </p>
                </motion.div>
            )}
        </div>
    );
}
