"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Landmark, Users, AlertTriangle, Play, RefreshCw, HandCoins, Scale } from "lucide-react";

// --- Types & Constants ---

type GamePhase = "SETUP" | "SIMULATION" | "EVENT" | "END_GAME";
type ElectionModel = "ONOE" | "CLUSTER" | "ROLLING";

interface GameMetrics {
    fiscalHealth: number; // 0-100
    stability: number;    // 0-100
    accountability: number; // 0-100
    federalism: number;   // 0-100 (Hidden)
}

interface GameEvent {
    year: number;
    title: string;
    description: string;
    options: {
        label: string;
        effect: (metrics: GameMetrics) => GameMetrics;
    }[];
}

const INITIAL_METRICS: GameMetrics = {
    fiscalHealth: 50,
    stability: 50,
    accountability: 50,
    federalism: 50,
};

import { useTabs } from "@/contexts/TabContext";

// --- Game Engine Logic ---

export function ConstitutionalGame() {
    const { gameSubTab, setGameSubTab } = useTabs();
    const [phase, setPhase] = useState<GamePhase>("SETUP");
    const [year, setYear] = useState(1);

    const model = gameSubTab;
    const setModel = (m: ElectionModel | null) => setGameSubTab(m as any);

    const [metrics, setMetrics] = useState<GameMetrics>(INITIAL_METRICS);
    const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
    const [newsTicker, setNewsTicker] = useState<string[]>([]);
    const [history, setHistory] = useState<string[]>([]);

    // Simulation Loop
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (phase === "SIMULATION" && year <= 15) {
            interval = setInterval(() => {
                // Annual adjustments based on model
                setMetrics((prev) => {
                    let newMetrics = { ...prev };

                    if (model === "ONOE") {
                        newMetrics.fiscalHealth = Math.min(100, newMetrics.fiscalHealth + 2); // Saves money
                        newMetrics.stability = Math.min(100, newMetrics.stability + 2);       // Stable gov
                        newMetrics.accountability = Math.max(0, newMetrics.accountability - 3); // Less voter interaction
                    } else if (model === "ROLLING") {
                        newMetrics.fiscalHealth = Math.max(0, newMetrics.fiscalHealth - 3); // Expensive
                        newMetrics.stability = Math.max(0, newMetrics.stability - 2);       // MCC pauses work
                        newMetrics.accountability = Math.min(100, newMetrics.accountability + 2); // High engagement
                    }

                    return newMetrics;
                });

                // Trigger Events
                const event = getEventForYear(year, model!);
                if (event) {
                    setPhase("EVENT");
                    setCurrentEvent(event);
                    clearInterval(interval);
                } else {
                    setNewsTicker(prev => [generateHeadline(year, model!), ...prev].slice(0, 3));
                    if (year === 15) {
                        setPhase("END_GAME");
                        clearInterval(interval);
                    } else {
                        setYear((y) => y + 1);
                    }
                }
            }, 1500); // 1.5s per year
        }

        return () => clearInterval(interval);
    }, [phase, year, model]);

    const startGame = (selectedModel: ElectionModel) => {
        setModel(selectedModel);
        setYear(1);
        setMetrics(INITIAL_METRICS);
        setNewsTicker([]);
        setHistory([]);
        setPhase("SIMULATION");
    };

    const handleEventChoice = (effect: (m: GameMetrics) => GameMetrics, label: string) => {
        setMetrics(effect);
        setHistory(prev => [...prev, `Year ${year}: ${label}`]);
        setPhase("SIMULATION");
        setYear(y => y + 1);
    };

    const MetricCard = ({ label, value, icon, color }: { label: string, value: number, icon: any, color: string }) => (
        <div className={`p-4 rounded-none border bg-card/50 flex flex-col items-center gap-2 ${color}`}>
            <div className="p-3 rounded-none bg-background/50 shadow-sm">{icon}</div>
            <div className="text-center">
                <p className="text-xs font-semibold text-muted-foreground uppercase">{label}</p>
                <div className="text-2xl font-bold">{value}%</div>
                <div className="w-full bg-muted/30 h-2 rounded-none mt-2 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        className={`h-full ${value > 70 ? 'bg-green-500' : value < 30 ? 'bg-red-500' : 'bg-blue-500'}`}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto space-y-6 p-4">

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold flex items-center justify-center gap-3">
                    <Landmark className="w-10 h-10 text-primary" />
                    The Constitutional Architect
                </h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Simulate 15 years of Indian Democracy. Manage the delicate balance between Cost, Stability, and Accountability.
                </p>
            </div>

            {/* Phase: SETUP */}
            {phase === "SETUP" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            id: "ONOE",
                            title: "The Grand Sync (ONOE)",
                            desc: "Simultaneous Elections every 5 years.",
                            pros: "High Stability, Low Cost",
                            cons: "Low Accountability, Federalism Risk"
                        },
                        {
                            id: "CLUSTER",
                            title: "Cluster Model",
                            desc: "Elections in 2 groups every 2.5 years.",
                            pros: "Balanced Approach",
                            cons: "Complex Logistics"
                        },
                        {
                            id: "ROLLING",
                            title: "Rolling Cycle (Status Quo)",
                            desc: "Elections happen naturally as terms end.",
                            pros: "High Accountability",
                            cons: "Policy Paralysis, High Cost"
                        }
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => startGame(opt.id as ElectionModel)}
                            className="flex flex-col text-left p-6 rounded-none border-2 hover:border-primary hover:bg-muted/50 transition-all group"
                        >
                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{opt.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{opt.desc}</p>
                            <div className="mt-auto space-y-2 text-xs">
                                <div className="flex items-center gap-2 text-green-600 font-semibold">
                                    <TrendingUp className="w-3 h-3" /> {opt.pros}
                                </div>
                                <div className="flex items-center gap-2 text-red-500 font-semibold">
                                    <TrendingDown className="w-3 h-3" /> {opt.cons}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Phase: SIMULATION / EVENT */}
            {(phase === "SIMULATION" || phase === "EVENT") && (
                <div className="space-y-6">
                    {/* Metrics Dashboard */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricCard label="Financial Health" value={metrics.fiscalHealth} icon={<HandCoins className="w-5 h-5" />} color="text-amber-600" />
                        <MetricCard label="Governance Stability" value={metrics.stability} icon={<Scale className="w-5 h-5" />} color="text-blue-600" />
                        <MetricCard label="Accountability" value={metrics.accountability} icon={<Users className="w-5 h-5" />} color="text-green-600" />
                        <MetricCard label="Federalism (Hidden)" value={metrics.federalism} icon={<Landmark className="w-5 h-5" />} color="text-purple-600" />
                    </div>

                    {/* Main Viz Area */}
                    <div className="relative bg-black/5 dark:bg-white/5 rounded-none h-[400px] flex flex-col items-center justify-center border-4 border-double overflow-hidden">

                        {/* Year Indicator */}
                        <div className="absolute top-6 right-6 bg-background border px-4 py-2 rounded-none font-mono text-xl font-bold shadow-sm">
                            Year {year} / 15
                        </div>

                        {/* Map Placeholder (Dynamic India Map) */}
                        {/* For prototype, we use a CSS abstract representation */}
                        <div className={`w-64 h-64 rounded-none border-4 flex items-center justify-center transition-all duration-500 ${model === "ROLLING" ? "border-dashed animate-pulse border-orange-500" : "border-solid border-green-600"
                            }`}>
                            <span className="text-4xl font-black opacity-20">INDIA</span>
                        </div>

                        {/* News Ticker */}
                        <div className="absolute bottom-0 w-full bg-background/90 backdrop-blur border-t p-3 overflow-hidden">
                            <div className="flex whitespace-nowrap animate-marquee gap-8 text-sm font-mono text-primary">
                                {newsTicker.map((news, i) => (
                                    <span key={i}>• {news}</span>
                                ))}
                            </div>
                        </div>

                        {/* Event Overlay */}
                        <AnimatePresence>
                            {phase === "EVENT" && currentEvent && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6"
                                >
                                    <div className="bg-card w-full max-w-lg border-2 shadow-2xl rounded-none p-8">
                                        <div className="flex items-center gap-3 mb-4 text-orange-500">
                                            <AlertTriangle className="w-8 h-8" />
                                            <span className="text-sm font-bold tracking-wider uppercase">Crisis Alert • Year {year}</span>
                                        </div>
                                        <h2 className="text-2xl font-bold mb-4">{currentEvent.title}</h2>
                                        <p className="text-lg leading-relaxed mb-8">{currentEvent.description}</p>
                                        <div className="space-y-3">
                                            {currentEvent.options.map((opt, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleEventChoice(opt.effect, opt.label)}
                                                    className="w-full text-left p-4 rounded-none border bg-muted/50 hover:bg-primary hover:text-primary-foreground transition-all font-medium"
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Phase: END GAME */}
            {phase === "END_GAME" && (
                <div className="bg-card border-2 shadow-2xl rounded-none p-10 text-center max-w-3xl mx-auto space-y-8">
                    <div>
                        <h2 className="text-3xl font-black mb-2">Simulation Complete</h2>
                        <p className="text-muted-foreground">The Constitutional Impact of your Era</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 text-left">
                        <div className="space-y-1">
                            <span className="text-xs uppercase text-muted-foreground font-bold">Your Archetype</span>
                            <div className="text-2xl font-bold text-primary">
                                {metrics.stability > 70 ? "The Efficiency Autocrat" : metrics.accountability > 70 ? "The Chaotic Democrat" : "The Balanced Pragmatist"}
                            </div>
                            <p className="text-sm text-foreground/80 leading-snug mt-2">
                                {metrics.stability > 70
                                    ? "You built a highly efficient machine, but the people felt unheard during mid-term crises. You prioritized Output over Voice."
                                    : "Development was slow and expensive, but the government was constantly on its toes. You prioritized Voice over Output."
                                }
                            </p>
                        </div>
                        <div className="space-y-4 font-mono text-sm">
                            <div className="flex justify-between border-b pb-2">
                                <span>Final Treasury</span>
                                <span className={metrics.fiscalHealth > 50 ? "text-green-600" : "text-red-500"}>
                                    {metrics.fiscalHealth > 50 ? "+₹ 45,000 Cr" : "-₹ 15,000 Cr"}
                                </span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Avg Stability</span>
                                <span>{metrics.stability}%</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Voter Satisfaction</span>
                                <span>{metrics.accountability}%</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setPhase("SETUP")}
                        className="flex items-center justify-center gap-2 mx-auto px-8 py-3 bg-primary text-primary-foreground rounded-none font-bold hover:scale-105 transition-transform"
                    >
                        <RefreshCw className="w-5 h-5" /> Re-Draft Constitution
                    </button>
                </div>
            )}
        </div>
    );
}

// --- Helpers: Events & Generators ---

function getEventForYear(year: number, model: ElectionModel): GameEvent | null {
    // 1. Defection Drama (Year 2 - Rolling/Cluster)
    // Frequent elections encourage horse-trading.
    if ((model === "ROLLING" || model === "CLUSTER") && year === 2) {
        return {
            year,
            title: "Defection Drama",
            description: "15 MLAs from the opposition want to switch sides ahead of the state polls. They demand ministerial berths.",
            options: [
                {
                    label: "Accept Defectors (Secure Govt)",
                    effect: (m) => ({ ...m, stability: m.stability + 10, accountability: m.accountability - 15, fiscalHealth: m.fiscalHealth - 5 })
                },
                {
                    label: "Reject Them (Moral High Ground)",
                    effect: (m) => ({ ...m, stability: m.stability - 15, accountability: m.accountability + 10 })
                }
            ]
        };
    }

    // 2. The Local Water Crisis (Year 3 - ONOE)
    // The classic accountability trap of ONOE.
    if (model === "ONOE" && year === 3) {
        return {
            year,
            title: "The Local Water Crisis",
            description: "A severe drought hits Maharashtra. The state government is unpopular, but elections are 2 years away.",
            options: [
                {
                    label: "Suppress Protests (Ignore)",
                    effect: (m) => ({ ...m, stability: m.stability + 5, accountability: m.accountability - 25 })
                },
                {
                    label: "Divert Central Funds (Bailout)",
                    effect: (m) => ({ ...m, fiscalHealth: m.fiscalHealth - 15, accountability: m.accountability + 5 })
                }
            ]
        };
    }

    // 3. The By-Election Battle (Year 4 - Rolling)
    if (model === "ROLLING" && year === 4) {
        return {
            year,
            title: "The By-Election Battle",
            description: "Crucial by-elections in UP. The Prime Minister wants to campaign personally.",
            options: [
                {
                    label: "PM Campaigns (Pause Govt Work)",
                    effect: (m) => ({ ...m, stability: m.stability - 15, accountability: m.accountability + 10 })
                },
                {
                    label: "Focus on Policy (Risk Losing State)",
                    effect: (m) => ({ ...m, stability: m.stability + 5, accountability: m.accountability - 10 })
                }
            ]
        };
    }

    // 4. The Great Pandemic (Year 5 - All Models)
    // A universal crisis testing priorities.
    if (year === 5) {
        return {
            year,
            title: "The Great Pandemic",
            description: "A global virus outbreak requires immediate lockdown and funds. The economy is stalling.",
            options: [
                {
                    label: "Strict Lockdown & Relief Package",
                    effect: (m) => ({ ...m, fiscalHealth: m.fiscalHealth - 25, accountability: m.accountability + 15, stability: m.stability + 5 })
                },
                {
                    label: "Keep Economy Open (Risk Lives)",
                    effect: (m) => ({ ...m, fiscalHealth: m.fiscalHealth + 5, accountability: m.accountability - 30, stability: m.stability - 10 })
                }
            ]
        };
    }

    // 5. Hung Assembly (Year 7 - ONOE)
    if (model === "ONOE" && year === 7) {
        return {
            year,
            title: "Hung Assembly in 3 States",
            description: "Coalitions collapse. No party has numbers. The next synchronized election is 3 years away.",
            options: [
                {
                    label: "Impose President's Rule (Autocratic)",
                    effect: (m) => ({ ...m, stability: m.stability + 10, federalism: m.federalism - 30, accountability: 0 })
                },
                {
                    label: "Declare Snap Elections (Break ONOE)",
                    effect: (m) => ({ ...m, stability: m.stability - 30, accountability: m.accountability + 20, federalism: m.federalism + 10 })
                }
            ]
        };
    }

    // 6. Regional Wave vs National Wave (Year 9 - ONOE)
    // Testing Federalism.
    if (model === "ONOE" && year === 9) {
        return {
            year,
            title: "The National Wave",
            description: "A charismatic National Leader is sweeping polls. Local state issues are being ignored in the campaign.",
            options: [
                {
                    label: "Push One Nation Narrative",
                    effect: (m) => ({ ...m, stability: m.stability + 15, federalism: m.federalism - 25, accountability: m.accountability - 5 })
                },
                {
                    label: "Empower State Leaders",
                    effect: (m) => ({ ...m, stability: m.stability - 5, federalism: m.federalism + 20, accountability: m.accountability + 10 })
                }
            ]
        };
    }

    // 7. Voter Fatigue (Year 11 - Cluster/Rolling)
    if ((model === "CLUSTER" || model === "ROLLING") && year === 11) {
        return {
            year,
            title: "Voter Fatigue",
            description: "Voters are tired of constant campaigns every 6 months. Turnout is dropping.",
            options: [
                {
                    label: "Mandatory Voting Law",
                    effect: (m) => ({ ...m, accountability: m.accountability - 10, stability: m.stability + 5 })
                },
                {
                    label: "Hold Simultaneous State Polls",
                    effect: (m) => ({ ...m, stability: m.stability + 10, fiscalHealth: m.fiscalHealth + 5 })
                }
            ]
        };
    }

    // 8. The Dictator's Shadow (Year 14 - ONOE)
    if (model === "ONOE" && year === 14) {
        return {
            year,
            title: "The Dictator's Shadow",
            description: "With 14 years of uninterrupted stability, the ruling party has become extremely powerful and arrogant.",
            options: [
                {
                    label: "Pass Media Control Bill",
                    effect: (m) => ({ ...m, stability: m.stability + 20, accountability: m.accountability - 40, federalism: m.federalism - 10 })
                },
                {
                    label: "Allow Citizen Townhalls",
                    effect: (m) => ({ ...m, stability: m.stability - 10, accountability: m.accountability + 30 })
                }
            ]
        };
    }

    return null;
}

function generateHeadline(year: number, model: ElectionModel): string {
    const events = [
        "GDP grows by 7.5% as manufacturing picks up.",
        "Opposition stages walkout in Parliament.",
        "Supreme Court hears plea on electoral bonds.",
        "New highway project mandated by Ministry.",
        "Monsoon session begins with heated debates."
    ];
    if (model === "ONOE") {
        events.push("Zero election interruptions this year.", "Government focuses on long-term reforms.");
    } else {
        events.push("Model Code of Conduct halts bridge construction.", "PM cancels foreign trip for rallies.");
    }
    return events[year % events.length];
}
