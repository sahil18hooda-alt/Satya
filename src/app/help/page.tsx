"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { HelpCircle, ChevronRight } from "lucide-react";

export default function Help() {
    const faqs = [
        {
            q: "What is S.A.T.Y.A?",
            a: "S.A.T.Y.A (System for Advanced Truth & Yield Analysis) is an official portal designed to provide citizens with accurate, AI-verified information about elections and to combat digital misinformation."
        },
        {
            q: "How does the Rumor Buster work?",
            a: "The Rumor Buster uses IndicBERT, an advanced AI model trained on multiple Indian languages, to analyze text, images, and URLs against verified datasets and constitutional facts."
        },
        {
            q: "Can I use S.A.T.Y.A on my mobile phone?",
            a: "Yes, the portal is fully responsive and designed to work across all devices including smartphones, tablets, and desktop computers."
        },
        {
            q: "Is my data safe on this portal?",
            a: "Absolutely. S.A.T.Y.A follows strict government security guidelines and does not store personal data or track user activity via cookies."
        },
        {
            q: "What should I do if I find a deepfake?",
            a: "You can use the 'Deepfake Detective' section to upload the video or provide a YouTube link. The AI will analyze pixel consistency and noise patterns to determine if it's synthetically generated."
        }
    ];

    return (
        <main className="min-h-screen bg-white font-mukta">
            <Breadcrumb />

            <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <h1 className="text-4xl font-black text-slate-900 mb-8 border-b-4 border-orange-500 pb-4 flex items-center gap-3">
                    <HelpCircle className="w-8 h-8 text-[#003366]" />
                    Help & FAQ
                </h1>

                <div className="space-y-6 mt-12">
                    {faqs.map((faq, index) => (
                        <div key={index} className="group border-2 border-slate-100 hover:border-blue-500 transition-all p-6 bg-slate-50">
                            <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-start gap-3">
                                <span className="text-blue-600 font-extrabold">Q.</span>
                                {faq.q}
                            </h3>
                            <div className="flex items-start gap-3 text-slate-600 leading-relaxed">
                                <span className="text-orange-500 font-extrabold">A.</span>
                                <p>{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-[#003366] text-white p-8 space-y-4">
                    <h2 className="text-2xl font-bold">Still have questions?</h2>
                    <p className="text-blue-100 italic">
                        Our support team is available from Mon-Sat (9 AM to 6 PM) to assist you with any technical or informational queries.
                    </p>
                    <div className="pt-4">
                        <a href="/contact" className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 font-bold hover:bg-black transition-colors">
                            Contact Support
                            <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
