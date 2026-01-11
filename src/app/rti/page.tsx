"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { FileText, Download, UserCheck } from "lucide-react";

export default function RTI() {
    return (
        <main className="min-h-screen bg-white font-mukta">
            <Breadcrumb />

            <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <h1 className="text-4xl font-black text-slate-900 mb-8 border-b-4 border-orange-500 pb-4">
                    Right to Information (RTI)
                </h1>

                <div className="prose prose-slate max-w-none space-y-8">
                    <section>
                        <p className="text-slate-700 leading-relaxed">
                            In order to promote transparency and accountability in the working of every public authority and for matters connected therewith or incidental thereto, the Right to Information Act, 2005 was enacted.
                        </p>
                    </section>

                    {/* RTI Officer Details */}
                    <section className="bg-slate-50 p-8 border border-slate-200">
                        <h2 className="text-2xl font-bold text-[#003366] mb-6 flex items-center gap-3">
                            <UserCheck className="w-6 h-6 text-orange-500" />
                            Central Public Information Officer (CPIO)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-900 border-b pb-2">Technical & Support RTI</h3>
                                <div className="text-sm space-y-1">
                                    <p className="font-bold">Shri. R.K. Sharma</p>
                                    <p className="text-slate-600">Director (Tech), S.A.T.Y.A Division</p>
                                    <p className="text-slate-600">Nirvachan Sadan, New Delhi</p>
                                    <p className="text-slate-600">Email: sharma.rk@gov.in</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-900 border-b pb-2">Administrative RTI</h3>
                                <div className="text-sm space-y-1">
                                    <p className="font-bold">Smt. Anjali Mehra</p>
                                    <p className="text-slate-600">Under Secretary (Admin)</p>
                                    <p className="text-slate-600">Nirvachan Sadan, New Delhi</p>
                                    <p className="text-slate-600">Email: anjali.us@gov.in</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-[#003366] mb-6">How to apply</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 border rounded-none items-start">
                                <div className="bg-blue-100 p-2 text-blue-600 font-bold">01</div>
                                <p className="text-sm text-slate-600">Visit the official RTI Online Portal at <a href="https://rtionline.gov.in" className="text-blue-600 underline">rtionline.gov.in</a></p>
                            </div>
                            <div className="flex gap-4 p-4 border rounded-none items-start">
                                <div className="bg-blue-100 p-2 text-blue-600 font-bold">02</div>
                                <p className="text-sm text-slate-600">Select "Submit Request" and choose "Election Commission of India" as the Public Authority.</p>
                            </div>
                            <div className="flex gap-4 p-4 border rounded-none items-start">
                                <div className="bg-blue-100 p-2 text-blue-600 font-bold">03</div>
                                <p className="text-sm text-slate-600">Fill in the details and pay the required fee (Rs. 10) through the online payment gateway.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
