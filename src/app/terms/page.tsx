"use client";

import { Breadcrumb } from "@/components/Breadcrumb";

export default function TermsAndConditions() {
    return (
        <main className="min-h-screen bg-white font-mukta">
            <Breadcrumb />

            <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <h1 className="text-4xl font-black text-slate-900 mb-8 border-b-4 border-orange-500 pb-4">
                    Terms & Conditions
                </h1>

                <div className="prose prose-slate max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Agreement</h2>
                        <p className="text-slate-700 leading-relaxed">
                            By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Use License</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Permission is granted to temporarily download one copy of the materials (information or software) on the S.A.T.Y.A portal for personal, non-commercial transitory viewing only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Disclaimer</h2>
                        <p className="text-slate-700 leading-relaxed italic">
                            The materials on this portal are provided "as is". The Election Commission makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Governing Law</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Any claim relating to this portal shall be governed by the laws of India without regard to its conflict of law provisions.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
