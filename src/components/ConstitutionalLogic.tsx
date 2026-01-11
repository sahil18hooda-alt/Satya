"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Search, Loader2, Landmark } from "lucide-react";
import { useTabs } from "@/contexts/TabContext";
import { useLanguage } from "@/contexts/LanguageContext";

export function ConstitutionalLogic() {
    const { logicSubTab } = useTabs();
    const { currentLanguage, translateNow } = useLanguage();

    const [logicQuery, setLogicQuery] = useState("");
    const [logicResult, setLogicResult] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Internationalization State
    const [logicTitle, setLogicTitle] = useState("Constitutional Logic Layer");
    const [logicDesc, setLogicDesc] = useState("Powered by \"Veil of Ignorance\". Provides symmetrical arguments grounded-none in the Constitution.");
    const [logicPlaceholder, setLogicPlaceholder] = useState("Ask about ONOE, Article 83, or Election Reforms...");
    const [logicAnalyzeBtn, setLogicAnalyzeBtn] = useState("Analyze");
    const [govRationaleTitle, setGovRationaleTitle] = useState("Government Rationale");
    const [oppConcernsTitle, setOppConcernsTitle] = useState("Opposition Concerns");
    const [neutralSumTitle, setNeutralSumTitle] = useState("Neutral Summation");
    const [citationsTitle, setCitationsTitle] = useState("Citations");

    useEffect(() => {
        const updateText = async () => {
            if (currentLanguage === 'en') {
                setLogicTitle("Constitutional Logic Layer");
                setLogicDesc("Powered by \"Veil of Ignorance\". Provides symmetrical arguments grounded-none in the Constitution.");
                setLogicPlaceholder("Ask about ONOE, Article 83, or Election Reforms...");
                setLogicAnalyzeBtn("Analyze");
                setGovRationaleTitle("Government Rationale");
                setOppConcernsTitle("Opposition Concerns");
                setNeutralSumTitle("Neutral Summation");
                setCitationsTitle("Citations");
            } else {
                setLogicTitle(await translateNow("Constitutional Logic Layer"));
                setLogicDesc(await translateNow("Powered by \"Veil of Ignorance\". Provides symmetrical arguments grounded-none in the Constitution."));
                setLogicPlaceholder(await translateNow("Ask about ONOE, Article 83, or Election Reforms..."));
                setLogicAnalyzeBtn(await translateNow("Analyze"));
                setGovRationaleTitle(await translateNow("Government Rationale"));
                setOppConcernsTitle(await translateNow("Opposition Concerns"));
                setNeutralSumTitle(await translateNow("Neutral Summation"));
                setCitationsTitle(await translateNow("Citations"));
            }
        };
        updateText();
    }, [currentLanguage]);

    const handleLogicSubmit = async () => {
        if (!logicQuery.trim()) return;
        setIsAnalyzing(true);
        setLogicResult(null);
        try {
            const API_URL = process.env.NODE_ENV === "development"
                ? "http://localhost:8000"
                : (process.env.NEXT_PUBLIC_API_URL ?? "");
            const response = await fetch(`${API_URL}/chat-constitutional`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: logicQuery, language: currentLanguage }),
            });
            const data = await response.json();
            setLogicResult(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-6">
            <div className="bg-card border shadow-lg rounded-none p-6">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                    <Landmark className="w-6 h-6 text-blue-800" />
                    {logicTitle}
                </h2>
                <p className="text-muted-foreground mb-4">{logicDesc}</p>
                <div className="flex gap-2">
                    <textarea
                        value={logicQuery}
                        onChange={(e) => setLogicQuery(e.target.value)}
                        placeholder={logicPlaceholder}
                        className="flex-1 min-h-[80px] px-4 py-3 bg-muted/50 border rounded-none focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                    />
                    <button
                        onClick={handleLogicSubmit}
                        disabled={isAnalyzing || !logicQuery.trim()}
                        className="bg-primary text-primary-foreground px-6 rounded-none font-semibold hover:opacity-90 transition-all disabled:opacity-50 h-auto"
                    >
                        {isAnalyzing ? <Loader2 className="animate-spin" /> : logicAnalyzeBtn}
                    </button>
                </div>
            </div>

            {logicResult && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div id="logic-rationale" className={`bg-green-50/50 dark:bg-green-900/10 border p-6 rounded-none transition-all ${logicSubTab === 'rationale' ? 'border-green-600 border-2 shadow-md' : 'border-green-200 dark:border-green-800'}`}>
                            <h3 className="font-bold text-green-700 dark:text-green-300 text-lg mb-2 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5" /> {govRationaleTitle}
                            </h3>
                            <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{logicResult.pro_argument}</p>
                        </div>

                        <div id="logic-basis" className={`bg-orange-50/50 dark:bg-orange-900/10 border p-6 rounded-none transition-all ${logicSubTab === 'basis' ? 'border-orange-600 border-2 shadow-md' : 'border-orange-200 dark:border-orange-800'}`}>
                            <h3 className="font-bold text-orange-700 dark:text-orange-300 text-lg mb-2 flex items-center gap-2">
                                <Search className="w-5 h-5" /> {oppConcernsTitle}
                            </h3>
                            <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{logicResult.con_argument}</p>
                        </div>
                    </div>

                    <div id="logic-citations" className={`bg-blue-50/50 dark:bg-blue-900/10 border p-6 rounded-none transition-all ${logicSubTab === 'citations' ? 'border-blue-600 border-2 shadow-md' : 'border-blue-200 dark:border-blue-800'}`}>
                        <h3 className="font-bold text-blue-700 dark:text-blue-300 text-lg mb-2">{neutralSumTitle}</h3>
                        <p className="text-foreground/90 whitespace-pre-wrap">{logicResult.neutral_summation}</p>
                        <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">{citationsTitle}</p>
                            <div className="flex flex-wrap gap-2">
                                {logicResult.citations?.map((cite: string, i: number) => (
                                    <span key={i} className="text-xs bg-background border px-2 py-1 rounded-none text-muted-foreground">{cite}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
