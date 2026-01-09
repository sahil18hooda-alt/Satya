"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldAlert, ShieldCheck, Link as LinkIcon, AlertTriangle, CheckCircle2 } from "lucide-react";

interface FactCheckModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: any;
}

export function FactCheckModal({ isOpen, onClose, result }: FactCheckModalProps) {
    if (!result) return null;
    const isFake = result.isFake;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl pointer-events-auto border border-zinc-200 dark:border-zinc-800 flex flex-col">

                            {/* Header */}
                            <div className={`p-6 border-b ${isFake ? 'bg-red-50/50 border-red-100 dark:bg-red-900/10 dark:border-red-900/30' : 'bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30'} flex justify-between items-start sticky top-0 backdrop-blur-md z-10`}>
                                <div className="flex gap-4">
                                    <div className={`p-3 rounded-full ${isFake ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                        {isFake ? <ShieldAlert className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
                                    </div>
                                    <div>
                                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest mb-1 ${isFake ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                            {isFake ? "Verified False" : "Verified True"}
                                        </span>
                                        <h2 className="text-xl md:text-2xl font-bold leading-tight text-zinc-900 dark:text-zinc-100">
                                            {isFake ? "Misinformation Detected" : "Authentic Information"}
                                        </h2>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-zinc-500" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-8">

                                {/* Confidence Meter */}
                                <div>
                                    <div className="flex justify-between text-sm font-semibold mb-2 text-zinc-500">
                                        <span>AI Confidence Score</span>
                                        <span>{(result.confidence * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${result.confidence * 100}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`h-full rounded-full ${isFake ? 'bg-red-500' : 'bg-green-500'}`}
                                        />
                                    </div>
                                </div>

                                {/* Analysis Section */}
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                                        <div>
                                            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-1">Detailed Analysis</h3>
                                            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-base">
                                                {result.explanation?.reason}
                                            </p>
                                        </div>
                                    </div>

                                    {result.originalText && (
                                        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Original Claim</h4>
                                            <p className="text-sm italic text-zinc-600 dark:text-zinc-400">"{result.originalText}"</p>
                                        </div>
                                    )}
                                </div>

                                {/* Evidence & Context */}
                                {result.contextLinks && result.contextLinks.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
                                            <LinkIcon className="w-5 h-5 text-blue-500" />
                                            Official Sources & Evidence
                                        </h3>
                                        <div className="grid gap-3">
                                            {result.contextLinks.map((link: any, i: number) => (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all group"
                                                >
                                                    <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-1 group-hover:underline truncate">
                                                        {link.title}
                                                    </h4>
                                                    <p className="text-xs text-zinc-500 line-clamp-2">
                                                        {link.excerpt}
                                                    </p>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 text-center bg-zinc-50/50 dark:bg-zinc-900/50 text-xs text-zinc-400">
                                Generated by S.A.T.Y.A. AI Engine • Verification ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
