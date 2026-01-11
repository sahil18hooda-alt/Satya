"use client";

import { Breadcrumb } from "@/components/Breadcrumb";

export default function Copyright() {
    return (
        <main className="min-h-screen bg-white font-mukta">
            <Breadcrumb />

            <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <h1 className="text-4xl font-black text-slate-900 mb-8 border-b-4 border-orange-500 pb-4">
                    Copyright Policy
                </h1>

                <div className="prose prose-slate max-w-none space-y-8">
                    <section>
                        <p className="text-slate-700 leading-relaxed">
                            Material featured on this portal may be reproduced free of charge after taking proper permission by sending a mail to us. However, the material has to be reproduced accurately and not to be used in a derogatory manner or in a misleading context.
                        </p>
                        <p className="mt-4 text-slate-700 leading-relaxed">
                            Wherever the material is being published or issued to others, the source must be prominently acknowledged. However, the permission to reproduce this material shall not extend to any material which is identified as being copyright of a third party. Authorization to reproduce such material must be obtained from the departments/copyright holders concerned.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
