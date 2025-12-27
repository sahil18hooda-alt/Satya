"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Banknote, Building2, Train, GraduationCap, Syringe, Scale, Calendar, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";

// --- Types & Data ---

interface DevelopmentItem {
    id: string;
    name: string;
    cost: number; // in Crores
    icon: any;
    color: string;
}

const DEV_ITEMS: DevelopmentItem[] = [
    { id: "aiims", name: "AIIMS Hospital", cost: 1500, icon: <Syringe className="w-6 h-6" />, color: "bg-red-100 text-red-600" },
    { id: "vande", name: "Vande Bharat Train", cost: 115, icon: <Train className="w-6 h-6" />, color: "bg-blue-100 text-blue-600" },
    { id: "school", name: "Model School", cost: 20, icon: <GraduationCap className="w-6 h-6" />, color: "bg-green-100 text-green-600" },
    { id: "highway", name: "10km Expressway", cost: 150, icon: <Building2 className="w-6 h-6" />, color: "bg-yellow-100 text-yellow-600" },
];

export function DemocracyDividend() {
    const [activeSection, setActiveSection] = useState<"receipt" | "budget" | "scale" | "mcc">("receipt");

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8 p-4">
            <div className="text-center mb-6">
                <h1 className="text-4xl font-extrabold flex items-center justify-center gap-3">
                    <Banknote className="w-10 h-10 text-green-600" />
                    Democracy Dividend
                </h1>
                <p className="text-muted-foreground mt-2">
                    Visualizing the Fiscal Impact & Opportunity Cost of Elections.
                </p>
            </div>

            {/* Navigation Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[
                    { id: "receipt", label: "Taxpayer Receipt", icon: <Calculator className="w-4 h-4" /> },
                    { id: "budget", label: "Budget Builder (Game)", icon: <Building2 className="w-4 h-4" /> },
                    { id: "scale", label: "Cost vs Investment", icon: <Scale className="w-4 h-4" /> },
                    { id: "mcc", label: "Policy Paralysis", icon: <Calendar className="w-4 h-4" /> },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSection(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all ${activeSection === tab.id
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
            >
                {activeSection === "receipt" && <TaxpayerReceipt />}
                {activeSection === "budget" && <BudgetBuilder />}
                {activeSection === "scale" && <CostScale />}
                {activeSection === "mcc" && <MCCHeatmap />}
            </motion.div>
        </div>
    );
}

// --- 1. Taxpayer Receipt ---

function TaxpayerReceipt() {
    const [income, setIncome] = useState<number | "">("");
    const [result, setResult] = useState<{ cost: number; days: number } | null>(null);

    const calculate = () => {
        if (!income || typeof income !== 'number') return;
        // Logic: Total Election Cost ~ ₹1.35 Lakh Crore (5 years). 
        // Per Capita Cost ~ ₹1000/year (Simplification for demo).
        // Proportional to Income Tax Bracket (Progressive Mock).

        let share = 0;
        if (income < 500000) share = 500; // Indirect taxes
        else if (income < 1000000) share = 2500;
        else share = 15000;

        setResult({ cost: share, days: Math.floor(share / (income / 365)) });
    };

    return (
        <div className="bg-card border-2 shadow-xl rounded-3xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-primary" />
                Find Your Contribution
            </h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Annual Annual Income (Approximation)</label>
                    <input
                        type="number"
                        placeholder="e.g. 800000"
                        className="w-full p-3 rounded-xl border bg-background text-lg"
                        value={income}
                        onChange={(e) => setIncome(Number(e.target.value))}
                    />
                </div>
                <button
                    onClick={calculate}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all font-mono flex items-center justify-center gap-2"
                >
                    Generate Receipt <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            {result && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-8 bg-amber-50 dark:bg-amber-950/20 border border-dashed border-amber-300 p-6 rounded-xl font-mono text-amber-900 dark:text-amber-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50" />
                    <h3 className="text-xl font-bold uppercase tracking-widest border-b border-amber-300 pb-2 mb-4 text-center">Taxpayer Receipt</h3>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Election Cycle Cost:</span>
                            <span className="font-bold">₹ {result.cost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Money Locked Duration:</span>
                            <span className="font-bold">75 Days</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-amber-300/50 text-sm italic opacity-80 text-center">
                            "This is equivalent to {result.days} days of your hard-earned labor."
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// --- 2. Budget Builder (Game) ---

function BudgetBuilder() {
    const [wallet, setWallet] = useState(60000); // 60,000 Crores
    const [built, setBuilt] = useState<DevelopmentItem[]>([]);

    const buy = (item: DevelopmentItem) => {
        if (wallet >= item.cost) {
            setWallet(w => w - item.cost);
            setBuilt(prev => [item, ...prev]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-primary/10 p-6 rounded-2xl flex items-center justify-between border border-primary/20 sticky top-4 z-10 backdrop-blur-md">
                <div>
                    <h3 className="text-lg font-bold text-primary">Democracy Dividend Fund</h3>
                    <p className="text-xs text-muted-foreground">Savings from Synchronized Elections</p>
                </div>
                <div className="text-4xl font-black font-mono text-green-600">
                    ₹ {wallet.toLocaleString()} Cr
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Shop */}
                <div className="bg-card border rounded-2xl p-6">
                    <h4 className="font-bold mb-4 uppercase text-xs tracking-wider text-muted-foreground">Development Projects</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {DEV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                disabled={wallet < item.cost}
                                onClick={() => buy(item)}
                                className={`p-4 rounded-xl border text-left flex flex-col items-center gap-2 hover:bg-muted/50 transition-all ${wallet < item.cost ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <div className={`p-3 rounded-full ${item.color}`}>{item.icon}</div>
                                <div className="text-sm font-bold text-center">{item.name}</div>
                                <div className="text-xs font-mono font-bold text-muted-foreground">₹{item.cost} Cr</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* My India (Inventory) */}
                <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-6 min-h-[400px]">
                    <h4 className="font-bold mb-4 uppercase text-xs tracking-wider text-muted-foreground">My Developed India</h4>
                    {built.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-muted-foreground opacity-50">
                            Start building to see projects here.
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-2 content-start">
                            <AnimatePresence>
                                {built.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className={`p-2 rounded-lg ${item.color} flex items-center justify-center`}
                                        title={item.name}
                                    >
                                        {item.icon}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// --- 3. Cost Scale ---

function CostScale() {
    return (
        <div className="bg-card border rounded-3xl p-8 text-center space-y-8">
            <h3 className="text-2xl font-bold">Investment vs. Savings</h3>
            <p className="text-muted-foreground max-w-lg mx-auto">
                ONOE requires a massive upfront investment in new EVMs, but saves recurring costs over time.
            </p>

            <div className="relative h-64 flex items-end justify-center gap-20">
                {/* Left Pan: Investment */}
                <div className="flex flex-col items-center gap-2 relative top-10">
                    <div className="w-32 h-32 bg-red-100 rounded-lg flex items-center justify-center border-2 border-red-500 shadow-xl transform rotate-3">
                        <div className="text-center">
                            <div className="text-xs font-bold text-red-600 uppercase">Upfront Cost</div>
                            <div className="text-xl font-black text-red-800">₹ 10k Cr</div>
                            <div className="text-[10px] text-red-600/80">(New EVMs)</div>
                        </div>
                    </div>
                    <div className="w-1 bg-foreground/20 h-20"></div>
                </div>

                {/* Pivot */}
                <div className="absolute bottom-0 w-8 h-8 bg-foreground rounded-full z-10"></div>
                <div className="absolute bottom-4 w-64 h-2 bg-foreground/50 rounded-full transform -rotate-6"></div>

                {/* Right Pan: Savings */}
                <div className="flex flex-col items-center gap-2 relative bottom-10">
                    <div className="w-40 h-40 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-500 shadow-xl transform -rotate-3">
                        <div className="text-center">
                            <div className="text-xs font-bold text-green-600 uppercase">Recurring Savings</div>
                            <div className="text-2xl font-black text-green-800">₹ 60k Cr</div>
                            <div className="text-[10px] text-green-600/80">(Every 5 Years)</div>
                        </div>
                    </div>
                    <div className="w-1 bg-foreground/20 h-20"></div>
                </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-xl max-w-md mx-auto text-sm">
                ℹ️ <b>ROI Analysis:</b> The upfront cost of purchasing VVPATs is recovered within the first election cycle due to massive savings in logistics and security deployment.
            </div>
        </div>
    );
}

// --- 4. MCC Heatmap ---

function MCCHeatmap() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card border rounded-2xl p-6">
                    <h3 className="font-bold flex items-center gap-2 mb-4">
                        <TrendingDown className="text-red-500 w-5 h-5" />
                        Current System (5 Years)
                    </h3>
                    <div className="flex flex-wrap gap-1">
                        {Array.from({ length: 60 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 rounded-sm ${Math.random() > 0.6 ? 'bg-red-500' : 'bg-muted-foreground/10'}`}
                                title={Math.random() > 0.6 ? "Policy Paralysis (MCC Active)" : "Governance Active"}
                            />
                        ))}
                    </div>
                    <p className="mt-4 text-sm text-red-600 font-bold">~ 400 Days lost to Code of Conduct</p>
                </div>

                <div className="bg-card border rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 bg-green-500 text-white text-xs font-bold rounded-bl-xl">ONOE</div>
                    <h3 className="font-bold flex items-center gap-2 mb-4">
                        <TrendingUp className="text-green-500 w-5 h-5" />
                        Projected ONOE System
                    </h3>
                    <div className="flex flex-wrap gap-1">
                        {Array.from({ length: 60 }).map((_, i) => (
                            <div
                                key={i}
                                className={`w-3 h-3 rounded-sm ${i < 5 ? 'bg-red-500' : 'bg-muted-foreground/10'}`}
                            />
                        ))}
                    </div>
                    <p className="mt-4 text-sm text-green-600 font-bold">~ 75 Days lost (Only once)</p>
                </div>
            </div>

            <p className="text-center text-muted-foreground text-sm max-w-2xl mx-auto">
                *Each dot represents a month. Red dots indicate periods where government projects were paused due to the <b>Model Code of Conduct</b> being in force somewhere in the country.
            </p>
        </div>
    );
}
