"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, TrendingUp, HelpCircle, Info, Ghost, Zap, AlertTriangle } from "lucide-react";
import electionData from "../data/election_data.json";

interface ElectionResult {
    id: string;
    name: string;
    type: string;
    year: number;
    winner: string;
    runnerUp: string;
    winnerVotes: number;
    runnerUpVotes: number;
    totalRegistered: number;
    totalVoted: number;
}

import { useTabs, MarginSubTabType } from "@/contexts/TabContext";

export function MarginOfErrorVisualizer() {
    const { marginSubTab: subTab } = useTabs();
    const [selectedId, setSelectedId] = useState(electionData[0].id);
    const [simulationPercent, setSimulationPercent] = useState(0);

    const selectedData = useMemo(() =>
        electionData.find(d => d.id === selectedId) as ElectionResult
        , [selectedId]);

    const margin = selectedData.winnerVotes - selectedData.runnerUpVotes;
    const nonVoters = selectedData.totalRegistered - selectedData.totalVoted;
    const potentialNewVotes = Math.floor(nonVoters * (simulationPercent / 100));
    const willFlip = potentialNewVotes > margin;

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 p-4 md:p-8 bg-white/50 backdrop-blur-xl rounded-none border border-white shadow-2xl relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-orange-200/20 rounded-none blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-200/20 rounded-none blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 flex items-center gap-3">
                        <Ghost className="w-10 h-10 text-orange-500 animate-bounce" />
                        The Sleeping Giant
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">
                        Visualizing the "Ghost Votes" that could have changed history.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white/80 p-2 rounded-none border shadow-sm">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <select
                        value={selectedId}
                        onChange={(e) => {
                            setSelectedId(e.target.value);
                            setSimulationPercent(0);
                        }}
                        className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                        {electionData.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.year})</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

                {/* Left: Data Journalism Piece */}
                <div id="margin-reality" className={`lg:col-span-12 xl:col-span-4 space-y-6 transition-all ${subTab === 'reality' ? 'ring-2 ring-[#13316c] ring-offset-2' : ''}`}>
                    <div className="bg-[#13316c] text-white p-6 rounded-none shadow-xl">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5 opacity-70" />
                            The Reality Check
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end border-b border-white/10 pb-3">
                                <span className="text-white/70 text-sm">Victory Margin</span>
                                <span className="text-2xl font-black text-orange-400">{margin.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/10 pb-3">
                                <span className="text-white/70 text-sm">Stayed Home</span>
                                <span className="text-2xl font-black text-blue-300">{nonVoters.toLocaleString()}</span>
                            </div>
                            <div className="pt-2">
                                <p className="text-sm leading-relaxed opacity-90">
                                    In <span className="font-bold">{selectedData.name}</span>, the "Non-Voting Party" was <span className="font-bold text-orange-300">{(nonVoters / margin).toFixed(1)}x</span> larger than the margin that decided the winner.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-100 p-6 rounded-none">
                        <h3 className="text-lg font-bold text-orange-900 mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Did You Know?
                        </h3>
                        <p className="text-sm text-orange-800/80 leading-relaxed italic">
                            "The smallest margin in Indian history was just <span className="font-bold">1 vote</span> in the 2004 Assembly elections. Your individual choice isn't just a drop in the ocean—it's the tide."
                        </p>
                    </div>
                </div>

                {/* Center: 2.5D Visualization */}
                <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6">
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-none p-6 md:p-12 relative overflow-hidden min-h-[400px]">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                        <div className="flex h-full items-end justify-around gap-4 md:gap-12 relative z-10 perspective-[1000px]">

                            {/* Margin Bar */}
                            <div className="flex flex-col items-center gap-4 w-full max-w-[120px]">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Margin</div>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 100 }}
                                    className="w-full bg-slate-200 rounded-none relative group shadow-inner"
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 font-black text-slate-800">
                                        {margin.toLocaleString()}
                                    </div>
                                </motion.div>
                                <div className="text-[10px] text-slate-400 font-bold text-center">DECISIVE VOTES</div>
                            </div>

                            {/* The Sleeping Giant Bar (2.5D) */}
                            <div className="flex flex-col items-center gap-4 w-full">
                                <div className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    The Giant <Zap className="w-3 h-3 text-orange-500 fill-orange-500" />
                                </div>

                                <div className="w-full max-w-[300px] h-[250px] relative items-end flex group">
                                    {/* Full Bar (Ghostly) */}
                                    <div className="absolute bottom-0 w-full h-[250px] bg-blue-100/50 rounded-none border-2 border-dashed border-blue-200" />

                                    {/* Active Segment (Simulation) */}
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.min(100, (potentialNewVotes / margin) * 20)}%` }}
                                        className={`absolute bottom-0 w-full rounded-none shadow-2xl transition-colors duration-500 overflow-hidden ${willFlip ? 'bg-gradient-to-t from-orange-600 to-orange-400' : 'bg-gradient-to-t from-blue-600 to-blue-400'}`}
                                    >
                                        {/* Animated Shine Effect */}
                                        <motion.div
                                            animate={{ x: ['-100%', '200%'] }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                            className="absolute inset-0 bg-white/20 skew-x-12"
                                        />

                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white font-black text-2xl drop-shadow-md">
                                            {potentialNewVotes.toLocaleString()}
                                        </div>
                                    </motion.div>

                                    {/* Winner indicator line */}
                                    <div className="absolute bottom-[20%] w-full border-t-2 border-slate-900/10 border-dashed z-20">
                                        <span className="absolute -right-2 md:-right-8 -translate-y-1/2 bg-slate-900 text-white text-[8px] font-bold px-1 rounded-none">WINNER'S LINE</span>
                                    </div>
                                </div>

                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">People who stayed home</div>
                            </div>

                        </div>

                        {/* Float Overlay Message */}
                        <AnimatePresence>
                            {simulationPercent > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-none shadow-2xl backdrop-blur-md border-2 z-30 text-center max-w-[280px] ${willFlip ? 'bg-orange-600/90 text-white border-orange-400' : 'bg-white/90 text-slate-900 border-blue-100'}`}
                                >
                                    <h4 className="text-xl font-black mb-2">
                                        {willFlip ? "OUTCOME FLIPPED!" : "STILL SHORT"}
                                    </h4>
                                    <p className="text-sm font-medium opacity-90">
                                        {willFlip
                                            ? `If just ${simulationPercent}% of non-voters had shown up, the runner-up would have won by ${(potentialNewVotes - margin).toLocaleString()} votes.`
                                            : `Even with ${simulationPercent}% of non-voters, the result stands. We need more momentum.`
                                        }
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Slider Control */}
                    <div id="margin-simulator" className={`bg-white border-2 p-8 rounded-none shadow-sm transition-all ${subTab === 'simulator' ? 'border-blue-600 bg-blue-50' : 'border-slate-100'}`}>
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-slate-700 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-500" />
                                "What If" Simulator
                            </span>
                            <span className="bg-slate-100 px-4 py-1 rounded-none font-black text-slate-800">
                                {simulationPercent}% of Non-Voters
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={simulationPercent}
                            onChange={(e) => setSimulationPercent(parseInt(e.target.value))}
                            className="w-full h-3 bg-slate-100 rounded-none appearance-none cursor-pointer accent-blue-600 hover:accent-orange-500 transition-all"
                        />
                        <div className="flex justify-between mt-4 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                            <span>Apathy (0%)</span>
                            <span>10%</span>
                            <span className="text-blue-500">Average Turnout Boost</span>
                            <span>75%</span>
                            <span>Total Potential (100%)</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
