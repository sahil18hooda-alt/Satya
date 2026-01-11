"use client";

import { Breadcrumb } from "@/components/Breadcrumb";

export default function AccessibilityStatement() {
    return (
        <main className="min-h-screen bg-white font-mukta">
            <Breadcrumb />

            <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <h1 className="text-4xl font-black text-slate-900 mb-8 border-b-4 border-orange-500 pb-4">
                    Accessibility Statement
                </h1>

                <div className="prose prose-slate max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Commitment</h2>
                        <p className="text-slate-700 leading-relaxed">
                            We are committed to ensure that the S.A.T.Y.A portal is accessible to all users irrespective of device in use, technology or ability. It has been built, with an aim, to provide maximum accessibility and usability to its visitors.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Compliance</h2>
                        <p className="text-slate-700 leading-relaxed">
                            Our goal is to be compliant with Web Content Accessibility Guidelines (WCAG) 2.0 level AA, which explains how to make web content more accessible for people with disabilities.
                        </p>
                    </section>

                    <section className="bg-slate-50 p-6 border-l-4 border-blue-500">
                        <h3 className="font-bold text-lg mb-2">Features</h3>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                            <li>Skip to main content link</li>
                            <li>Font size adjustment tools (A+, A, A-)</li>
                            <li>High contrast view mode</li>
                            <li>Descriptive ARIA labels</li>
                            <li>Keyboard support for all interactive elements</li>
                        </ul>
                    </section>
                </div>
            </div>
        </main>
    );
}
