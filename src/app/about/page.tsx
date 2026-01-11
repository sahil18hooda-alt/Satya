"use client";

import { Breadcrumb } from "@/components/Breadcrumb";

export default function AboutUs() {
    return (
        <main className="min-h-screen bg-white font-mukta">
            <Breadcrumb />

            <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <h1 className="text-4xl font-black text-slate-900 mb-8 border-b-4 border-orange-500 pb-4">
                    About S.A.T.Y.A
                </h1>

                <div className="prose prose-slate max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Vision</h2>
                        <p className="text-slate-700 leading-relaxed text-lg italic">
                            "Empowering every citizen with the truth through advanced analytical intelligence."
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Objective</h2>
                        <p className="text-slate-700 leading-relaxed">
                            S.A.T.Y.A (System for Advanced Truth & Yield Analysis) is a multi-dimensional digital portal designed to safeguard the integrity of the democratic process. It leverages cutting-edge AI and data visualization to fight misinformation, detect deepfakes, and educate citizens about their constitutional rights.
                        </p>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-slate-50 p-6 border-l-4 border-orange-500">
                            <h3 className="font-bold text-lg mb-2">Transparency</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                We believe in the "Right to Know". Every analysis provided by S.A.T.Y.A is backed by AI rationales and constitutional citations.
                            </p>
                        </div>
                        <div className="bg-slate-50 p-6 border-l-4 border-blue-500">
                            <h3 className="font-bold text-lg mb-2">Accessibility</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Democracy is for everyone. S.A.T.Y.A is built to be inclusive, supporting multiple Indian languages and accessibility standards.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Core Components</h2>
                        <ul className="list-disc list-inside text-slate-700 space-y-2">
                            <li><strong>Hyper-Local Rumor Buster</strong>: Detects regional misinformation using IndicBERT.</li>
                            <li><strong>Deepfake Detective</strong>: Analyzes video and audio for synthetic manipulation.</li>
                            <li><strong>Logic Layer</strong>: Provides the 'Constitutional Basis' for AI-driven decisions.</li>
                            <li><strong>Civic Games</strong>: Educates through interactive 'One Nation One Election' simulations.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </main>
    );
}
