"use client";

import { useState } from "react";
import { Puzzle } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { ViralWatch } from "@/components/ViralWatch";
import { VerificationTabs } from "@/components/VerificationTabs";
import { RecentCheckResult } from "@/components/RecentCheckResult";
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
    <main id="main-content" className="min-h-screen bg-white relative">
      {/* Background Image with Overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/india-voting-bg.jpg)',
          opacity: '0.85'
        }}
      />

      {/* White gradient overlay for better text readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-white/40 via-white/30 to-white/40" />

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
        <div className="text-left mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#1f242e] mb-4 tracking-tight leading-tight">
            Don't Forward <span className="text-[#f97316]">Without</span> <span className="text-[#16a34a]">Checking.</span>
          </h1>
          <p className="text-base md:text-lg text-gray-500 max-w-3xl leading-relaxed">
            Paste messages directly from WhatsApp Web or upload screenshots to verify election news instantly with our AI-powered engine.
          </p>
        </div>

        {/* Main Content: Rumor Buster Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
          {/* Left Column: Verification Input & Results */}
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
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <RecentCheckResult result={result} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Stats & Viral Watch */}
          <div className="space-y-6 order-1 lg:order-2">
            <StatsCard />
            <ViralWatch onMythClick={(title) => {
              handleVerifyRequest('text', title);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} />
          </div>
        </div>
      </section>
    </main>
  );
}
