"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Image as ImageIcon, Link as LinkIcon, Lock, Loader2, UploadCloud, FileText, Camera } from "lucide-react";
import { useTabs } from "@/contexts/TabContext";

interface VerificationTabsProps {
    onVerify: (type: 'text' | 'image' | 'screenshot', content: string | File) => void;
    isAnalyzing: boolean;
}

export function VerificationTabs({ onVerify, isAnalyzing }: VerificationTabsProps) {
    const { rumorSubTab: activeTab, setRumorSubTab: setActiveTab } = useTabs();

    // Inputs
    const [textInput, setTextInput] = useState("");
    const [urlInput, setUrlInput] = useState("");
    const [fileInput, setFileInput] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileInput(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setFileInput(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleVerify = () => {
        if (activeTab === 'text' && textInput.trim()) {
            onVerify('text', textInput);
        } else if (activeTab === 'image' && fileInput) {
            onVerify('image', fileInput);
        } else if (activeTab === 'screenshot' && fileInput) {
            onVerify('screenshot', fileInput);
        }
    };

    return (
        <div className="bg-white rounded-none shadow-sm border border-gray-200 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-100">
                <button
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all relative ${activeTab === 'text'
                        ? 'text-[#13316c]'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <FileText className="w-4 h-4" /> Text
                    {activeTab === 'text' && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#13316c] rounded-none"></span>}
                </button>
                <button
                    onClick={() => setActiveTab('image')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all relative ${activeTab === 'image'
                        ? 'text-[#13316c]'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <ImageIcon className="w-4 h-4" /> Image/Screenshot
                    {activeTab === 'image' && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#13316c] rounded-none"></span>}
                </button>
                <button
                    onClick={() => setActiveTab('screenshot')}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all relative ${activeTab === 'screenshot'
                        ? 'text-[#13316c]'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    <Camera className="w-4 h-4" /> Screenshot
                    {activeTab === 'screenshot' && <span className="absolute bottom-0 left-0 w-full h-1 bg-[#13316c] rounded-none"></span>}
                </button>
            </div>
            {/* Content Area */}
            <div className="min-h-[200px] relative">
                <AnimatePresence mode="wait">
                    {activeTab === 'text' && (
                        <motion.div
                            key="text"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            <div className="relative h-full">
                                <textarea
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    placeholder="Paste the suspicious WhatsApp message or news text here..."
                                    className="w-full h-48 p-4 bg-muted/20 border-2 border-dashed border-muted rounded-none resize-none focus:outline-none focus:border-blue-300 focus:bg-blue-50/20 transition-all text-sm"
                                />
                                <button
                                    onClick={() => navigator.clipboard.readText().then(t => setTextInput(t))}
                                    className="absolute top-4 right-4 p-2 bg-white rounded-none shadow-sm border hover:bg-muted transition-colors"
                                    title="Paste"
                                >
                                    <Copy className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'image' && (
                        <motion.div
                            key="image"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            <div
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                className="w-full h-48 border-2 border-dashed border-muted rounded-none bg-muted/20 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/30 transition-colors relative overflow-hidden"
                            >
                                {!fileInput ? (
                                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                        <UploadCloud className="w-10 h-10 text-muted-foreground mb-3" />
                                        <span className="text-sm font-medium text-muted-foreground">Or drag and drop a screenshot here</span>
                                    </label>
                                ) : (
                                    <div className="relative w-full h-full flex items-center justify-center p-2">
                                        <img src={previewUrl!} alt="Preview" className="max-h-full max-w-full rounded-none object-contain shadow-sm" />
                                        <button
                                            onClick={() => { setFileInput(null); setPreviewUrl(null); }}
                                            className="absolute top-2 right-2 bg-black/50 text-white rounded-none p-1 hover:bg-black/70"
                                        >
                                            x
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'screenshot' && (
                        <motion.div
                            key="screenshot"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            <div
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                                className="w-full h-48 border-2 border-dashed border-[#13316c] rounded-none bg-blue-50/20 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-blue-50/30 transition-colors relative overflow-hidden"
                            >
                                {!fileInput ? (
                                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                        <Camera className="w-10 h-10 text-[#13316c] mb-3" />
                                        <span className="text-sm font-medium text-[#13316c]">Click to upload or Drag & Drop Screenshot from WhatsApp/News</span>
                                    </label>
                                ) : (
                                    <div className="relative w-full h-full flex items-center justify-center p-2">
                                        <img src={previewUrl!} alt="Preview" className="max-h-full max-w-full rounded-none object-contain shadow-sm" />
                                        <button
                                            onClick={() => { setFileInput(null); setPreviewUrl(null); }}
                                            className="absolute top-2 right-2 bg-black/50 text-white rounded-none p-1 hover:bg-black/70"
                                        >
                                            x
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    Your search is anonymous and secure.
                </div>

                <button
                    onClick={handleVerify}
                    disabled={isAnalyzing || (activeTab === 'text' && !textInput) || (activeTab === 'image' && !fileInput) || (activeTab === 'screenshot' && !fileInput)}
                    className="bg-[#1e3a8a] text-white px-8 py-3 rounded-none font-bold hover:bg-[#1e40af] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                        </>
                    ) : (
                        "Verify Now"
                    )}
                </button>
            </div>
        </div>
    );
}
