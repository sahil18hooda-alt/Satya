"use client";

import { useState } from "react";
import { User, MapPin, ArrowRight } from "lucide-react";
import { T } from "./TranslatedText";

const STATES = [
    "Uttar Pradesh", "Goa", "Maharashtra", "Gujarat", "Karnataka", 
    "Tamil Nadu", "West Bengal", "Bihar", "Rajasthan", "Madhya Pradesh"
];

interface StoryInputProps {
    onStart: (age: number, state: string) => void;
}

export function StoryInput({ onStart }: StoryInputProps) {
    const [age, setAge] = useState<number>(30);
    const [selectedState, setSelectedState] = useState(STATES[0]);

    return (
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md border border-slate-200 p-8 shadow-xl">
            <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">
                <T>Reconstruct Your Election History</T>
            </h2>
            
            <div className="space-y-6">
                {/* Age Input */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                        <T>Your Age</T>
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="number" 
                            min={18} 
                            max={100}
                            value={age}
                            onChange={(e) => setAge(parseInt(e.target.value) || 18)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-bold text-slate-800"
                        />
                    </div>
                </div>

                {/* State Selection */}
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                        <T>Your State</T>
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select 
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all font-bold text-slate-800 appearance-none"
                        >
                            {STATES.map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <button 
                    onClick={() => onStart(age, selectedState)}
                    className="w-full bg-[#0B1F4F] text-white py-4 font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors shadow-lg active:scale-[0.98]"
                >
                    <T>Generate My Story</T>
                    <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-[10px] text-center text-slate-400 leading-relaxed italic">
                    <T>*This tool uses historical data from the ECI to reconstruct eligibility since age 18.*</T>
                </p>
            </div>
        </div>
    );
}
