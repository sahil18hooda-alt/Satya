"use client";

import { Breadcrumb } from "@/components/Breadcrumb";

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-white font-mukta">
            <Breadcrumb />

            <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <h1 className="text-4xl font-black text-slate-900 mb-8 border-b-4 border-orange-500 pb-4">
                    Privacy Policy
                </h1>

                <div className="prose prose-slate max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Introduction</h2>
                        <p className="text-slate-700 leading-relaxed">
                            This portal is committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy outlines how we handle data and what measures we take to secure your information while using the S.A.T.Y.A portal.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Data Collection</h2>
                        <p className="text-slate-700 leading-relaxed">
                            We do not collect personal information for any purpose other than to respond to you (for example, to respond to your queries or to provide information requested). If you choose to provide us with personal information as in an e-mail or by filling out a form with your personal information, we use that information only to fulfill your request.
                        </p>
                    </section>

                    <section className="bg-slate-50 p-6 border-l-4 border-blue-500">
                        <h3 className="font-bold text-lg mb-2">Cookies Policy</h3>
                        <p className="text-sm text-slate-600">
                            A cookie is a piece of software code that an internet website sends to your browser when you access information at that site. This site does not use cookies to track user activity or store permanent personal data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Information Security</h2>
                        <p className="text-slate-700 leading-relaxed">
                            We take appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure or destruction of data. These include internal reviews of our data collection, storage and processing practices and security measures.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Policy Updates</h2>
                        <p className="text-slate-700 leading-relaxed">
                            We reserve the right to update this policy at any time. Any changes will be posted on this page with an updated "Last Modified" date.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
