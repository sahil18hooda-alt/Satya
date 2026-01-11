"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Search, FileText, Globe, Loader2, Clipboard as ClipboardIcon, Mic, FileVideo, Landmark, Puzzle } from "lucide-react";
import { RumorAnalysis } from "@/components/RumorAnalysis";
import { ConstitutionalGame } from "@/components/ConstitutionalGame";
import { DemocracyDividend } from "@/components/DemocracyDividend";
import { StatsCard } from "@/components/StatsCard";
import { ViralWatch } from "@/components/ViralWatch";
import { RecentCheckResult } from "@/components/RecentCheckResult";
import { VerificationTabs } from "@/components/VerificationTabs";
import { ElectionNews } from "@/components/ElectionNews";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { AccessibilityAssistant } from "@/components/AccessibilityAssistant";
import { MarginOfErrorVisualizer } from "@/components/MarginOfErrorVisualizer";
import { useTabs } from "@/contexts/TabContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { activeTab, setActiveTab } = useTabs();

  // Rumor Buster State
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Language Support
  const { currentLanguage, translateNow } = useLanguage();
  const [headlinePart1, setHeadlinePart1] = useState("Don't Forward");
  const [headlinePart2, setHeadlinePart2] = useState("Checking.");
  const [subtext, setSubtext] = useState("Paste messages directly from WhatsApp Web or upload screenshots to verify election news instantly with our AI-powered engine.");

  useEffect(() => {
    const updateText = async () => {
      if (currentLanguage === 'en') {
        setHeadlinePart1("Don't Forward");
        setHeadlinePart2("Checking.");
        setSubtext("Paste messages directly from WhatsApp Web or upload screenshots to verify election news instantly with our AI-powered engine.");

        // Reset Logic Layer
        setLogicTitle("Constitutional Logic Layer");
        setLogicDesc("Powered by \"Veil of Ignorance\". Provides symmetrical arguments grounded-none in the Constitution.");
        setLogicPlaceholder("Ask about ONOE, Article 83, or Election Reforms...");
        setLogicAnalyzeBtn("Analyze");
        setGovRationaleTitle("Government Rationale");
        setOppConcernsTitle("Opposition Concerns");
        setNeutralSumTitle("Neutral Summation");
        setCitationsTitle("Citations");
      } else {
        setHeadlinePart1(await translateNow("Don't Forward"));
        setHeadlinePart2(await translateNow("Checking."));
        setSubtext(await translateNow("Paste messages directly from WhatsApp Web or upload screenshots to verify election news instantly with our AI-powered engine."));

        // Translate Logic Layer
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

  // Logic Layer State
  const [logicQuery, setLogicQuery] = useState("");
  const [logicResult, setLogicResult] = useState<any>(null);
  const [logicTitle, setLogicTitle] = useState("Constitutional Logic Layer");
  const [logicDesc, setLogicDesc] = useState("Powered by \"Veil of Ignorance\". Provides symmetrical arguments grounded-none in the Constitution.");
  const [logicPlaceholder, setLogicPlaceholder] = useState("Ask about ONOE, Article 83, or Election Reforms...");
  const [logicAnalyzeBtn, setLogicAnalyzeBtn] = useState("Analyze");
  const [govRationaleTitle, setGovRationaleTitle] = useState("Government Rationale");
  const [oppConcernsTitle, setOppConcernsTitle] = useState("Opposition Concerns");
  const [neutralSumTitle, setNeutralSumTitle] = useState("Neutral Summation");
  const [citationsTitle, setCitationsTitle] = useState("Citations");

  // Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  /* New Verify Handler */
  const handleVerifyRequest = async (type: 'text' | 'image' | 'url', content: string | File) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const API_URL = process.env.NODE_ENV === "development"
        ? "http://localhost:8000"
        : (process.env.NEXT_PUBLIC_API_URL ?? "");

      let endpoint = "/analyze";
      let body: any;
      let headers: any = { "Content-Type": "application/json" };

      if (type === 'text' || type === 'url') {
        body = JSON.stringify({ text: content });
      } else if (type === 'image') {
        endpoint = "/analyze-image";
        const formData = new FormData();
        formData.append("file", content as File);
        body = formData;
        headers = {}; // Let browser set boundary
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) throw new Error("Analysis failed");
      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error("Error verifying:", error);
      alert("Verification failed. Please check backend connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* Deprecated legacy handleVerify - keeping just in case but usually safely remove in full cleanup */
  const handleVerify = async () => { handleVerifyRequest('text', query) };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const file = new File([blob], "voice_input.webm", { type: "audio/webm" });
        await handleVoiceUpload(file);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleVoiceUpload = async (file: File) => {
    setIsAnalyzing(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const API_URL = process.env.NODE_ENV === "development"
        ? "http://localhost:8000"
        : (process.env.NEXT_PUBLIC_API_URL ?? "");
      const response = await fetch(`${API_URL}/chat-audio`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Voice analysis failed");
      const data = await response.json();

      const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
      audio.play();

      setQuery(data.text);
    } catch (error) {
      console.error("Voice Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setQuery(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

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
    <main className="min-h-screen flex flex-col items-center pb-20 transition-colors">
      <section className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-12 space-y-6">

        {/* Header Section - MeitY Style Alignment */}
        <div className="text-left mb-8">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#1f242e] mb-4 tracking-tight leading-tight">
            {headlinePart1} <span className="text-[#f97316]">Without</span> <span className="text-[#16a34a]">Checking.</span>
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-3xl leading-relaxed">
            {subtext}
          </p>
        </div>

        {
          activeTab === 'rumor' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* Left Column (Input & Results) - Order 2 on Mobile, Order 1 on Desktop */}
              <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
                <VerificationTabs onVerify={handleVerifyRequest} isAnalyzing={isAnalyzing} />

                {/* Browser Extension Banner */}
                <div className="bg-slate-100 border border-slate-200 rounded-none p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-none text-white">
                      <Puzzle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Browser Extension</h4>
                      <p className="text-xs text-slate-500">Verify news without leaving WhatsApp Web.</p>
                    </div>
                  </div>
                  <a href="/satya-extension.zip" download className="bg-white border text-sm font-bold px-4 py-1.5 rounded-none shadow-sm hover:bg-slate-50 transition-colors">
                    Get
                  </a>
                </div>

                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <RecentCheckResult result={result} />
                      {/* Optional: Show detailed breakdown below or inside result card */}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column (Stats & Trends) - Order 1 on Mobile, Order 2 on Desktop */}
              <div className="space-y-6 order-1 lg:order-2 lg:sticky lg:top-24">
                <StatsCard />
                <ViralWatch onMythClick={(title) => {
                  setQuery(title);
                  handleVerifyRequest('text', title);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} />
              </div>

            </div>
          ) : activeTab === 'logic' ? (
            <motion.div
              /* Existing Logic UI retained */
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key="logic"
              className="w-full max-w-4xl mx-auto space-y-6"
            >
              {/* Logic UI Content */}
              <div className="bg-card border shadow-lg rounded-none p-6">
                <h2 className="text-2xl font-bold mb-2">{logicTitle}</h2>
                <p className="text-muted-foreground mb-4">
                  {logicDesc}
                </p>
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
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-6 rounded-none">
                    <h3 className="font-bold text-green-700 dark:text-green-300 text-lg mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5" /> {govRationaleTitle}
                    </h3>
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{logicResult.pro_argument}</p>
                  </div>

                  <div className="bg-orange-50/50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 p-6 rounded-none">
                    <h3 className="font-bold text-orange-700 dark:text-orange-300 text-lg mb-2 flex items-center gap-2">
                      <Search className="w-5 h-5" /> {oppConcernsTitle}
                    </h3>
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{logicResult.con_argument}</p>
                  </div>

                  <div className="col-span-1 md:col-span-2 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-6 rounded-none">
                    <h3 className="font-bold text-blue-700 dark:text-blue-300 text-lg mb-2">{neutralSumTitle}</h3>
                    <p className="text-foreground/90 whitespace-pre-wrap">{logicResult.neutral_summation}</p>

                    <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">{citationsTitle}</p>
                      <div className="flex flex-wrap gap-2">
                        {logicResult.citations?.map((cite: string, i: number) => (
                          <span key={i} className="text-xs bg-background border px-2 py-1 rounded-none text-muted-foreground">
                            {cite}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : activeTab === 'deepfake' ? (
            /* Deepfake Detective UI */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key="deepfake"
              className="w-full max-w-3xl mx-auto space-y-6"
            >
              <DeepfakeUploader />
            </motion.div>
          ) : activeTab === 'game' ? (
            /* Constitutional Game */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key="game"
              className="w-full"
            >
              <ConstitutionalGame />
            </motion.div>
          ) : activeTab === 'dividend' ? (
            /* Democracy Dividend */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key="dividend"
              className="w-full"
            >
              <DemocracyDividend />
            </motion.div>
          ) : activeTab === 'voice' ? (
            /* Voice Assistant */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key="voice"
              className="w-full"
            >
              <VoiceAssistant />
            </motion.div>
          ) : activeTab === 'accessibility' ? (
            /* Accessibility & Voting Rights */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key="accessibility"
              className="w-full"
            >
              <AccessibilityAssistant />
            </motion.div>
          ) : activeTab === 'news' ? (
            /* Election News */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key="news"
              className="w-full"
            >
              <ElectionNews />
            </motion.div>
          ) : activeTab === 'margin' ? (
            /* Margin of Error Visualizer */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key="margin"
              className="w-full"
            >
              <MarginOfErrorVisualizer />
            </motion.div>
          ) : null
        }
      </section >

      {/* Feature Grid removed or moved to bottom if needed, currently removing to match clean dashboard look or keeping minimal */}

    </main >
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 border rounded-none bg-card/50 hover:bg-card transition-colors">
      <div className="mb-4 p-3 bg-muted rounded-none">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function DeepfakeUploader() {
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
    <div className="bg-card border shadow-lg rounded-none p-8">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <FileVideo className="w-6 h-6 text-red-500" />
        Deepfake Detective (Beta)
      </h2>
      <p className="text-muted-foreground mb-6">
        Upload a video to analyze for AI manipulation artifacts (visual & audio-sync).
      </p>

      <div className="border-2 border-dashed border-muted-foreground/25 rounded-none p-8 text-center hover:bg-muted/10 transition-colors">
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
      <div className="mt-8 text-center pt-6 border-t font-medium text-slate-600">
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
            <div className="bg-black/5 rounded-none p-6">
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
