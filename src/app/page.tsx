"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Search, FileText, Globe, Loader2, Clipboard as ClipboardIcon, Mic, FileVideo, Landmark } from "lucide-react";
import { RumorAnalysis } from "@/components/RumorAnalysis";
import { ConstitutionalGame } from "@/components/ConstitutionalGame";
import { DemocracyDividend } from "@/components/DemocracyDividend";

export default function Home() {
  const [activeTab, setActiveTab] = useState<'rumor' | 'logic' | 'deepfake' | 'game' | 'dividend'>('rumor');

  // Rumor Buster State
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Logic Layer State
  const [logicQuery, setLogicQuery] = useState("");
  const [logicResult, setLogicResult] = useState<any>(null);

  // Voice State
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const handleVerify = async () => {
    if (!query.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: query }),
      });
      if (!response.ok) throw new Error("Analysis failed");
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error verifying rumor:", error);
      alert("Could not connect to the Rumor Buster AI. Make sure the backend is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

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
      const response = await fetch("http://localhost:8000/chat-audio", {
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
      const response = await fetch("http://localhost:8000/chat-constitutional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: logicQuery }),
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
    <main className="min-h-screen flex flex-col items-center pb-20">
      <section className="w-full max-w-5xl px-6 pt-24 pb-12 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Hyper-Local Rumor Buster</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            Verify. <span className="text-gradient">Explain.</span> Trust.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Combating misinformation in regional languages with AI-powered explainability.
            Instantly check rumors against official records.
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('rumor')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'rumor' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            Rumor Buster
          </button>
          <button
            onClick={() => setActiveTab('logic')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'logic' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            Constitutional Logic Layer
          </button>
          <button
            onClick={() => setActiveTab('deepfake')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'deepfake' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            Deepfake Detective
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'game' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            Start Game 🎮
          </button>
          <button
            onClick={() => setActiveTab('dividend')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${activeTab === 'dividend' ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            Democracy Dividend 💸
          </button>
        </div>

        {activeTab === 'rumor' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key="rumor"
            className="w-full max-w-2xl mx-auto bg-card border shadow-lg rounded-2xl p-6 relative z-10"
          >
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Paste a forwarded message or rumor here (Hindi, Bhojpuri, English...)"
                  className="w-full min-h-[120px] pl-10 pr-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none resize-none text-base transition-all"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={toggleRecording}
                    className={`p-2 rounded-full transition-colors flex items-center justify-center ${isRecording ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-muted text-muted-foreground'}`}
                    title={isRecording ? "Stop Recording" : "Start Voice Conversation"}
                  >
                    <Mic className={`w-5 h-5 ${isRecording ? 'text-red-600' : ''}`} />
                  </button>
                  <button
                    onClick={handlePaste}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                    title="Paste from Clipboard"
                  >
                    <ClipboardIcon className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                <button
                  onClick={handleVerify}
                  disabled={isAnalyzing || !query.trim()}
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Rumor"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'logic' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key="logic"
            className="w-full max-w-4xl mx-auto space-y-6"
          >
            {/* Logic UI Content */}
            <div className="bg-card border shadow-lg rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-2">Constitutional Logic Layer</h2>
              <p className="text-muted-foreground mb-4">
                Powered by "Veil of Ignorance". Provides symmetrical arguments grounded in the Constitution.
              </p>
              <div className="flex gap-2">
                <textarea
                  value={logicQuery}
                  onChange={(e) => setLogicQuery(e.target.value)}
                  placeholder="Ask about ONOE, Article 83, or Election Reforms..."
                  className="flex-1 min-h-[80px] px-4 py-3 bg-muted/50 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                />
                <button
                  onClick={handleLogicSubmit}
                  disabled={isAnalyzing || !logicQuery.trim()}
                  className="bg-primary text-primary-foreground px-6 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 h-auto"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin" /> : "Analyze"}
                </button>
              </div>
            </div>

            {logicResult && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 p-6 rounded-2xl">
                  <h3 className="font-bold text-green-700 dark:text-green-300 text-lg mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Government Rationale
                  </h3>
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{logicResult.pro_argument}</p>
                </div>

                <div className="bg-orange-50/50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 p-6 rounded-2xl">
                  <h3 className="font-bold text-orange-700 dark:text-orange-300 text-lg mb-2 flex items-center gap-2">
                    <Search className="w-5 h-5" /> Opposition Concerns
                  </h3>
                  <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{logicResult.con_argument}</p>
                </div>

                <div className="col-span-1 md:col-span-2 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 p-6 rounded-2xl">
                  <h3 className="font-bold text-blue-700 dark:text-blue-300 text-lg mb-2">Neutral Summation</h3>
                  <p className="text-foreground/90 whitespace-pre-wrap">{logicResult.neutral_summation}</p>

                  <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Citations</p>
                    <div className="flex flex-wrap gap-2">
                      {logicResult.citations?.map((cite: string, i: number) => (
                        <span key={i} className="text-xs bg-background border px-2 py-1 rounded-md text-muted-foreground">
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
        ) : null}
      </section>

      {/* Analysis Result */}
      <AnimatePresence>
        {result && activeTab === 'rumor' && (
          <section className="w-full max-w-5xl px-6 flex justify-center mb-16">
            <RumorAnalysis result={result} />
          </section>
        )}
      </AnimatePresence>

      {/* Feature Grid */}
      <section className="w-full max-w-5xl px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Globe className="w-8 h-8 text-primary" />}
          title="Multilingual AI"
          description="Understand nuances in Bhojpuri, Magahi, and 22+ scheduled languages using IndicBERT."
        />
        <FeatureCard
          icon={<Search className="w-8 h-8 text-purple-600" />}
          title="Explainable Insights"
          description="Don't just know it's fake. See exactly which words triggered the alert with SHAP analysis."
        />
        <FeatureCard
          icon={<FileText className="w-8 h-8 text-green-600" />}
          title="Official Context"
          description="Get direct links to the Kovind Committee Report and Constitution sections that refute logical fallacies."
        />
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 border rounded-2xl bg-card/50 hover:bg-card transition-colors">
      <div className="mb-4 p-3 bg-muted rounded-full">
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

      const response = await fetch("http://localhost:8000/detect-deepfake", {
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
    <div className="bg-card border shadow-lg rounded-2xl p-8">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <FileVideo className="w-6 h-6 text-red-500" />
        Deepfake Detective (Beta)
      </h2>
      <p className="text-muted-foreground mb-6">
        Upload a video to analyze for AI manipulation artifacts (visual & audio-sync).
      </p>

      <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-8 text-center hover:bg-muted/10 transition-colors">
        {!file ? (
          <label className="cursor-pointer block">
            <FileVideo className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <span className="text-lg font-medium block mb-1">Click to upload video</span>
            <span className="text-sm text-muted-foreground">Supported: MP4, MOV, WEBM (Max 10MB)</span>
            <input type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
          </label>
        ) : (
          <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
            <span className="font-medium truncate">{file.name}</span>
            <button onClick={() => setFile(null)} className="text-red-500 text-sm hover:underline">Change</button>
          </div>
        )}
      </div>

      {file && !result && !loading && (
        <button
          onClick={handleUpload}
          className="w-full mt-6 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-all"
        >
          Run Deepfake Analysis
        </button>
      )}

      {loading && (
        <div className="mt-8 text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground animate-pulse">Scanning frames for artifacts...</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
          <div className={`p-6 rounded-2xl text-center border-2 ${result.isFake ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-green-500 bg-green-50 dark:bg-green-900/10'}`}>
            <h3 className={`text-3xl font-extrabold mb-2 ${result.isFake ? 'text-red-600' : 'text-green-600'}`}>
              {result.isFake ? "LIKELY FAKE" : "LIKELY REAL"}
            </h3>
            <p className="text-lg font-medium mb-1">
              Confidence Score: <span className="text-xl font-bold">{(result.confidence * 100).toFixed(1)}%</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Analyzed {result.processed_frames} key frames using Dual-Stream Network.
            </p>
          </div>

          {result.heatmap && (
            <div className="bg-black/5 rounded-2xl p-6">
              <h4 className="font-bold text-lg mb-4">Manipulation Heatmap (Grad-CAM)</h4>
              <div className="relative aspect-video rounded-lg overflow-hidden border">
                <img src={`data:image/jpeg;base64,${result.heatmap}`} alt="Heatmap" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
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
