"use client";

import { useState, useMemo } from "react";
import { HISTORICAL_ELECTIONS, ElectionEvent } from "@/data/ElectionData";
import { TimelineRenderer } from "./TimelineRenderer";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingDown, Coins, Clock, Info, Share2, ArrowLeft, Scale, BadgeCheck, HelpCircle } from "lucide-react";
import { T } from "./TranslatedText";

interface ElectionStoryProps {
    age: number;
    state: string;
    onReset: () => void;
}

export function ElectionStory({ age, state: userState, onReset }: ElectionStoryProps) {
    const [isONOE, setIsONOE] = useState(false);
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    const votingStartYear = birthYear + 18;

    // 1. Calculate Historical Events
    const historicalEvents = useMemo(() => {
        return HISTORICAL_ELECTIONS.filter(e => 
            e.year >= votingStartYear && 
            (e.state === 'ALL' || e.state === userState)
        );
    }, [votingStartYear, userState]);

    // 2. Calculate ONOE Simulated Events
    const onoeEvents = useMemo(() => {
        // Simple ONOE logic: Sync everything to a 5-year cycle (e.g., 2024, 2019, 2014...)
        // Any election within a cycle window is consolidated into one.
        const cycles = [2024, 2019, 2014, 2009, 2004, 1999, 1994, 1989, 1984, 1979];
        const consolidated: ElectionEvent[] = [];

        cycles.forEach(year => {
            if (year < votingStartYear) return;

            // Find all real elections that happened in a +/- 2 year window of this cycle year
            const windowEvents = historicalEvents.filter(e => Math.abs(e.year - year) <= 2);
            
            if (windowEvents.length > 0) {
                consolidated.push({
                    year: year,
                    type: 'Lok Sabha' as any, // Representing a unified election
                    state: userState,
                    mcc_days: 60, // A single unified MCC period
                    est_cost_per_voter: 1300, // Slightly higher than one, but much lower than two separate ones
                    is_onoe_consolidated: true
                });
            }
        });

        return consolidated;
    }, [historicalEvents, votingStartYear, userState]);

    const activeEvents = isONOE ? onoeEvents : historicalEvents;

    // 3. Stats Calculation
    const stats = useMemo(() => {
        const hTotalEvents = historicalEvents.length;
        const oTotalEvents = onoeEvents.length;
        const hTotalMCC = historicalEvents.reduce((acc, e) => acc + e.mcc_days, 0);
        const oTotalMCC = onoeEvents.reduce((acc, e) => acc + e.mcc_days, 0);
        const hTotalCost = historicalEvents.reduce((acc, e) => acc + e.est_cost_per_voter, 0);
        const oTotalCost = onoeEvents.reduce((acc, e) => acc + e.est_cost_per_voter, 0);

        return {
            elections: { actual: hTotalEvents, onoe: oTotalEvents, saved: hTotalEvents - oTotalEvents },
            mcc: { actual: hTotalMCC, onoe: oTotalMCC, saved: hTotalMCC - oTotalMCC },
            cost: { actual: hTotalCost, onoe: oTotalCost, saved: hTotalCost - oTotalCost }
        };
    }, [historicalEvents, onoeEvents]);

    return (
        <div className="space-y-12">
            {/* Header / Controls */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-200 py-6 -mx-4 px-4 shadow-sm">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <button onClick={onReset} className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">
                        <ArrowLeft className="w-4 h-4" />
                        <T>Change Filters</T>
                    </button>

                    <div className="flex bg-slate-100 p-1 rounded-none border border-slate-200">
                        <button 
                            onClick={() => setIsONOE(false)}
                            className={`px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${!isONOE ? 'bg-[#0B1F4F] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <T>Election History</T>
                        </button>
                        <button 
                            onClick={() => setIsONOE(true)}
                            className={`px-6 py-2 text-xs font-black uppercase tracking-widest transition-all ${isONOE ? 'bg-green-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                        >
                            <T>One Nation One Election</T>
                        </button>
                    </div>

                    <div className="text-right flex items-center gap-3">
                        <div className="hidden md:block">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">VOTER PROFILE</p>
                            <p className="text-xs font-black text-slate-800">{age}yrs • {userState}</p>
                        </div>
                        <Share2 className="w-5 h-5 text-slate-400 cursor-pointer hover:text-blue-600 transition-colors" />
                    </div>
                </div>
            </div>

            {/* Summary Dashboard */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    icon={<Clock className="w-5 h-5" />}
                    label="Polling Cycles"
                    actual={stats.elections.actual}
                    onoe={stats.elections.onoe}
                    saved={stats.elections.saved}
                    unit="Elections"
                    isActive={isONOE}
                />
                <StatCard 
                    icon={<TrendingDown className="w-5 h-5" />}
                    label="MCC Restrictions"
                    actual={stats.mcc.actual}
                    onoe={stats.mcc.onoe}
                    saved={stats.mcc.saved}
                    unit="Total Days"
                    isActive={isONOE}
                />
                <StatCard 
                    icon={<Coins className="w-5 h-5" />}
                    label="Public Spending"
                    actual={stats.cost.actual}
                    onoe={stats.cost.onoe}
                    saved={stats.cost.saved}
                    unit="₹ (Per Voter)"
                    isActive={isONOE}
                />
            </div>

            {/* Timeline View */}
            <div className="bg-slate-50 border-y border-slate-200 py-16 -mx-4 px-4 overflow-hidden relative">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl font-black text-slate-900 mb-2">
                           {isONOE ? <T>My ONOE Timeline</T> : <T>My Eligibility Timeline</T>}
                        </h3>
                        <p className="text-slate-500 max-w-xl mx-auto">
                            {isONOE 
                            ? <T>How elections would be consolidated every 5 years under the proposed One Nation One Election framework.</T>
                            : <T>Every major election you were eligible to participate in since turning 18, based on official ECI records.</T>}
                        </p>
                    </div>

                    <TimelineRenderer events={activeEvents} isONOE={isONOE} />
                </div>
            </div>

            {/* Nuance Layer / Expert Concerns */}
            <div className="max-w-4xl mx-auto border-4 border-slate-900 p-8 md:p-12 relative overflow-hidden bg-white">
                <Scale className="absolute -right-8 -bottom-8 w-48 h-48 text-slate-100 -z-0 opacity-50" />
                
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-6">
                        <BadgeCheck className="w-3.5 h-3.5" />
                        <T>Expert Perspectives & Challenges</T>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <T>Understanding the Nuance</T>
                        <HelpCircle className="w-6 h-6 text-slate-400" />
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-slate-600">
                        <div className="space-y-4">
                            <p className="font-bold text-slate-900 uppercase text-xs tracking-widest border-l-4 border-orange-500 pl-3">
                                <T>Constitutional Hurdles</T>
                            </p>
                            <p><T>Implementing ONOE requires amending Articles 83, 85, 172, 174, and 356. This requires a two-thirds majority in Parliament and ratification by half the states.</T></p>
                        </div>
                        <div className="space-y-4">
                            <p className="font-bold text-slate-900 uppercase text-xs tracking-widest border-l-4 border-blue-500 pl-3">
                                <T>Federalism Concerns</T>
                            </p>
                            <p><T>Several opposition parties argue that ONOE may overshadow regional issues with national narratives, potentially diluting the federal spirit of the Constitution.</T></p>
                        </div>
                        <div className="space-y-4">
                            <p className="font-bold text-slate-900 uppercase text-xs tracking-widest border-l-4 border-green-500 pl-3">
                                <T>Logistical Load</T>
                            </p>
                            <p><T>The ECI estimates a massive requirement of extra EVMs and VVPATs (approx 30 lakh units) and significantly higher security deployment for a single day of polling.</T></p>
                        </div>
                        <div className="space-y-4">
                            <p className="font-bold text-slate-900 uppercase text-xs tracking-widest border-l-4 border-purple-500 pl-3">
                                <T>State Autonomy</T>
                            </p>
                            <p><T>Questions remain about what happens if a state government falls mid-term. Would it have Governor's rule until the next ONOE cycle, or a fresh election for the remaining term?</T></p>
                        </div>
                    </div>
                    
                    <div className="mt-12 text-center">
                        <button className="bg-slate-900 text-white px-8 py-4 font-black uppercase tracking-widest flex items-center justify-center gap-2 mx-auto hover:bg-slate-800 transition-all shadow-xl">
                            <Share2 className="w-5 h-5" />
                            <T>Share My Election Story Card</T>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, actual, onoe, saved, unit, isActive }: any) {
    return (
        <div className={`bg-white border-2 p-6 transition-all relative overflow-hidden ${isActive ? 'border-green-500 shadow-green-100 shadow-lg' : 'border-slate-100'}`}>
            <div className={`absolute top-0 right-0 p-4 transition-colors ${isActive ? 'text-green-500' : 'text-slate-100'}`}>
                {icon}
            </div>
            
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <div className="flex items-baseline gap-2 mb-4">
                <span className={`text-4xl font-black transition-colors ${isActive ? 'text-green-600' : 'text-slate-900'}`}>
                    {isActive ? onoe : actual}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{unit}</span>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">PRE-ONOE</span>
                    <span className="text-xs font-bold text-slate-600">{actual}</span>
                </div>
                {isActive && (
                    <div className="flex flex-col text-right">
                        <span className="text-[8px] font-bold text-green-500 uppercase tracking-tighter">SAVED</span>
                        <span className="text-sm font-black text-green-600">-{saved}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
