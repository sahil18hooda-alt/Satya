"use client";

import { useState } from "react";
import { Puzzle, Shield, Zap, Users, ArrowRight } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { ViralWatch } from "@/components/ViralWatch";
import { VerificationTabs } from "@/components/VerificationTabs";
import { RecentCheckResult } from "@/components/RecentCheckResult";
import { DownloadLink } from "@/components/DownloadLink";
import { T } from "@/components/TranslatedText";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

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
        headers = {};
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

  return (
    <main id="main-content" className="min-h-screen bg-transparent relative">

      <style jsx global>{`
        @media print {
          .no-print, header, nav, footer, button, .accessibility-controls {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-only {
            display: block !important;
          }
        }
      `}</style>

      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-left mb-14"
        >
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 px-4 py-1.5 mb-5 shadow-sm">
            <Shield className="w-4 h-4 text-[#0B1F4F]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#0B1F4F]">
              <T>Official Election Integrity Portal</T>
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-[#1f242e] mb-4 tracking-tight leading-tight">
            <T>Don't Forward</T> <span className="text-[#f97316]"><T>Without</T></span> <span className="text-[#138808]"><T>Checking.</T></span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-3xl leading-relaxed">
            <T>Paste messages directly from WhatsApp Web or upload screenshots to verify election news instantly with our AI-powered engine.</T>
          </p>

          {/* Quick Feature Pills */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3 mt-6"
          >
            {[
              { icon: <Zap className="w-3.5 h-3.5" />, label: "AI-Powered Analysis" },
              { icon: <Users className="w-3.5 h-3.5" />, label: "12+ Indian Languages" },
              { icon: <Shield className="w-3.5 h-3.5" />, label: "Deepfake Detection" },
            ].map((pill, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white/60 backdrop-blur-sm border border-slate-100 px-3 py-1.5 shadow-sm">
                {pill.icon}
                <T>{pill.label}</T>
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* Main Content: Rumor Buster Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
          {/* Left Column: Verification Input & Results */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-2 space-y-8 order-2 lg:order-1"
          >
            <VerificationTabs onVerify={handleVerifyRequest} isAnalyzing={isAnalyzing} />

            {/* Browser Extension Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-slate-300" />
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Puzzle className="w-4 h-4" />
                  <T>Tools & Extensions</T>
                </h3>
                <div className="flex-1 h-0.5 bg-slate-300" />
              </div>
              <DownloadLink
                title="S.A.T.Y.A WhatsApp Web Extension"
                href="/satya-extension.zip"
                size="1.2 MB"
                format="ZIP / Chrome Extension"
                instructions="1. Download the ZIP file. 2. Extract it to a folder. 3. Open Chrome Extensions. 4. Enable 'Developer Mode' and 'Load Unpacked'."
              />
            </div>

            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <RecentCheckResult result={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Column: Stats & Viral Watch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6 order-1 lg:order-2"
          >
            <StatsCard />
            <ViralWatch onMythClick={(title) => {
              handleVerifyRequest('text', title);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
