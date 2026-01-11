"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileVideo, Loader2 } from "lucide-react";
import { DeepfakeSubTabType } from "@/contexts/TabContext";

export function DeepfakeDetective({ subTab }: { subTab: DeepfakeSubTabType }) {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setResult(null);
            setError("");
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const API_URL = process.env.NODE_ENV === "development"
                ? "http://localhost:8000"
                : (process.env.NEXT_PUBLIC_API_URL ?? "");
            const response = await fetch(`${API_URL}/detect-deepfake`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || "Detection failed");
            }

            const data = await response.json();
            setResult(data);
        } catch (e: any) {
            console.error("Deepfake Upload Error:", e);
            setError(e.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`bg-card border shadow-lg rounded-none p-8 transition-all ${subTab === 'detector' ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <FileVideo className="w-6 h-6 text-red-500" />
                Deepfake Detective (Beta)
            </h2>
            <p className="text-muted-foreground mb-6">
                Upload a video to analyze for AI manipulation artifacts (visual & audio-sync).
            </p>

            <div id="deepfake-detector" className={`border-2 border-dashed border-muted-foreground/25 rounded-none p-8 text-center hover:bg-muted/10 transition-colors ${subTab === 'detector' ? 'bg-primary/5 border-primary' : ''}`}>
                {!file ? (
                    <label className="cursor-pointer block">
                        <FileVideo className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <span className="text-lg font-medium block mb-1">Click to upload video</span>
                        <span className="text-sm text-muted-foreground">Supported: MP4, MOV, WEBM (Max 10MB)</span>
                        <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
                    </label>
                ) : (
                    <div className="flex items-center justify-between bg-muted/30 p-4 rounded-none">
                        <span className="font-medium truncate">{file.name}</span>
                        <button onClick={() => setFile(null)} className="text-red-500 text-sm hover:underline">Change</button>
                    </div>
                )}
            </div>

            {file && !result && !loading && (
                <button
                    onClick={handleUpload}
                    className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-none font-bold hover:opacity-90 transition-all"
                >
                    Run Deepfake Analysis
                </button>
            )}

            {/* Extension Link */}
            <div id="deepfake-extension" className={`mt-8 text-center pt-6 border-t font-medium text-slate-600 transition-all ${subTab === 'extension' ? 'bg-blue-50 p-4 border-blue-200' : ''}`}>
                Want to protect yourself on YouTube? <br />
                <a href="/deepfake-extension.zip" download className="text-blue-600 hover:underline font-bold inline-flex items-center gap-1 mt-2">
                    Download YouTube Detective Extension ↗
                </a>
            </div>

            {loading && (
                <div className="mt-8 text-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground animate-pulse">Scanning frames for artifacts...</p>
                </div>
            )}

            {error && (
                <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-none">
                    {error}
                </div>
            )}

            {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
                    <div className={`p-6 rounded-none text-center border-2 ${result.isFake ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-green-500 bg-green-50 dark:bg-green-900/10'}`}>
                        <h3 className={`text-3xl font-extrabold mb-2 ${result.isFake ? 'text-red-600' : 'text-green-600'}`}>
                            {result.isFake ? "LIKELY FAKE" : "LIKELY REAL"}
                        </h3>
                        <p className="text-lg font-medium mb-1">
                            {result.isFake ? "Fake Probability: " : "Real Probability: "}
                            <span className="text-xl font-bold">
                                {result.isFake
                                    ? `${(result.confidence * 100).toFixed(1)}%`
                                    : `${((1 - result.confidence) * 100).toFixed(1)}%`}
                            </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Analyzed {result.processed_frames} key frames using Dual-Stream Network.
                        </p>
                    </div>

                    {result.heatmap && (
                        <div id="deepfake-heatmap" className={`bg-black/5 rounded-none p-6 transition-all ${subTab === 'heatmap' ? 'ring-2 ring-orange-500 bg-orange-50' : ''}`}>
                            <h4 className="font-bold text-lg mb-4">Manipulation Heatmap (Grad-CAM)</h4>
                            <div className="relative aspect-video rounded-none overflow-hidden border">
                                <img src={`data:image/jpeg;base64,${result.heatmap}`} alt="Heatmap" className="w-full h-full object-cover" />
                                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-none">
                                    Red = High Probability of Manipulation
                                </div>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                *Highlights regions with inconsistent noise patterns or blending artifacts.
                            </p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
}
