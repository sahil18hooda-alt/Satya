"use client";

import { Breadcrumb } from "@/components/Breadcrumb";

export default function HyperlinkPolicy() {
    return (
        <main className="min-h-screen bg-white font-mukta">
            <Breadcrumb />

            <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <h1 className="text-4xl font-black text-slate-900 mb-8 border-b-4 border-orange-500 pb-4">
                    Hyperlinking Policy
                </h1>

                <div className="prose prose-slate max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Links to External Websites</h2>
                        <p className="text-slate-700 leading-relaxed">
                            At many places in this portal, you shall find links to other websites/portals. This links have been placed for your convenience. The Election Commission is not responsible for the contents and reliability of the linked websites and does not necessarily endorse the views expressed in them.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-4">Links to this Portal</h2>
                        <p className="text-slate-700 leading-relaxed">
                            We do not object to you linking directly to the information that is hosted on our site and no prior permission is required for the same. However, we would like you to inform us about any links provided to this portal so that you can be informed of any changes or updations therein.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
