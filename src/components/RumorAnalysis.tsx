"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { ContextLabel } from "./ContextLabel";
import clsx from "clsx";

interface AnalysisResult {
    isFake: boolean;
    confidence: number;
    originalText: string;
    explanation: {
        highlightedWords: string[]; // Simplification: list of words to highlight for now
        reason: string;
    };
    contextLinks: {
        title: string;
        url: string;
        excerpt: string;
    }[];
}

interface RumorAnalysisProps {
    result: AnalysisResult;
}

export function RumorAnalysis({ result }: RumorAnalysisProps) {
    const { isFake, confidence, originalText, explanation, contextLinks } = result;

    // Simple highlighting logic: split text and wrap matching words
    // In a real app, uses indices. Here we just match strings for the mock.
    const words = originalText.split(" ");

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl bg-card border rounded-2xl shadow-xl overflow-hidden"
        >
            {/* Header */}
            <div className={clsx(
                "px-6 py-4 flex items-center justify-between border-b",
                isFake ? "bg-red-50 dark:bg-red-950/30" : "bg-green-50 dark:bg-green-950/30"
            )}>
                <div className="flex items-center gap-3">
                    {isFake ? (
                        <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    ) : (
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    )}
                    <div>
                        <h2 className={clsx(
                            "text-lg font-bold",
                            isFake ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"
                        )}>
                            {isFake ? "Misinformation Detected" : "Verified Source"}
                        </h2>
                        <div className="text-xs font-medium opacity-80">
                            Confidence Score: {(confidence * 100).toFixed(0)}%
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">

                {/* XAI Visualization */}
                <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                        Analysis
                    </h3>
                    <p className="text-lg leading-relaxed">
                        {words.map((word, i) => {
                            // naive check for demo
                            const isHighlighted = explanation.highlightedWords.some(hw =>
                                word.toLowerCase().includes(hw.toLowerCase())
                            );
                            return (
                                <span
                                    key={i}
                                    className={clsx(
                                        "transition-colors duration-300",
                                        isHighlighted && isFake ? "bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 px-0.5 rounded cursor-help font-bold underline decoration-wavy decoration-red-500 underline-offset-4" : ""
                                    )}
                                >
                                    {word}{" "}
                                </span>
                            );
                        })}
                    </p>
                    <div className="mt-6 p-4 bg-muted/30 border border-muted rounded-xl">
                        <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                            <span className="w-1 h-4 bg-primary rounded-full"></span>
                            Detailed Reasoning
                        </h4>
                        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                            {explanation.reason}
                        </p>
                    </div>
                </div>

                {/* Context Labels */}
                {contextLinks.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                            Fact Check & Context
                        </h3>
                        {contextLinks.map((link, i) => (
                            <ContextLabel key={i} {...link} />
                        ))}
                    </div>
                )}

            </div>
        </motion.div>
    );
}
