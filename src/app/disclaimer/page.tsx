"use client";

import { Breadcrumb } from "@/components/Breadcrumb";

export default function Disclaimer() {
    return (
        <main className="min-h-screen bg-white font-mukta">
            <Breadcrumb />

            <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <h1 className="text-4xl font-black text-slate-900 mb-8 border-b-4 border-orange-500 pb-4">
                    Disclaimer
                </h1>

                <div className="prose prose-slate max-w-none space-y-8">
                    <section>
                        <p className="text-slate-700 leading-relaxed">
                            This portal has been developed to provide common information about the election process. The information being displayed is for reference purposes only and does not possess any legal sanctity.
                        </p>
                        <p className="mt-4 text-slate-700 leading-relaxed">
                            Though all efforts have been made to keep the content on this portal accurate and up-to-date, the same should not be construed as a statement of law or used for any legal purposes. In case of any ambiguity or doubts, users are advised to verify/check with the Department(s) and/or other source(s), and to obtain appropriate professional advice.
                        </p>
                        <p className="mt-4 text-slate-700 leading-relaxed italic">
                            Under no circumstances will this Department be liable for any expense, loss or damage including, without limitation, indirect or consequential loss or damage, or any expense, loss or damage whatsoever arising from use, or loss of use, of data, arising out of or in connection with the use of this Portal.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
