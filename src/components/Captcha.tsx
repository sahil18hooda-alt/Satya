"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface CaptchaProps {
    onVerify: (isValid: boolean) => void;
    isHighContrast?: boolean;
}

export function Captcha({ onVerify, isHighContrast }: CaptchaProps) {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [isVerified, setIsVerified] = useState(false);

    const generateCaptcha = () => {
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        setNum1(n1);
        setNum2(n2);
        setUserInput("");
        setIsVerified(false);
        onVerify(false);
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setUserInput(val);
        const result = parseInt(val);
        if (result === num1 + num2) {
            setIsVerified(true);
            onVerify(true);
        } else {
            setIsVerified(false);
            onVerify(false);
        }
    };

    return (
        <div className={`flex items-center gap-4 p-3 border shadow-sm ${isHighContrast ? 'bg-black border-white text-white' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
            <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 mb-1">Security Check</span>
                <div className="flex items-center gap-2">
                    <span className="font-mono text-lg font-bold tracking-widest bg-white/10 px-2 py-0.5 border border-dashed border-current select-none">
                        {num1} + {num2} = ?
                    </span>
                    <button
                        type="button"
                        onClick={generateCaptcha}
                        className="p-1 hover:rotate-180 transition-transform duration-500"
                        title="Refresh Captcha"
                    >
                        <RefreshCw className="w-3 h-3" />
                    </button>
                </div>
            </div>

            <div className="flex-1">
                <input
                    type="number"
                    value={userInput}
                    onChange={handleChange}
                    placeholder="Result"
                    className={`w-full px-3 py-2 text-sm font-bold border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isVerified ? 'border-green-500 bg-green-50' : (isHighContrast ? 'bg-black border-white text-white' : 'bg-white border-slate-300')}`}
                />
            </div>

            {isVerified && (
                <div className="text-green-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </div>
    );
}
