"use client";

import { Breadcrumb } from "@/components/Breadcrumb";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Captcha } from "@/components/Captcha";
import { useState } from "react";
import { useTabs } from "@/contexts/TabContext";

export default function ContactUs() {
    const [isVerified, setIsVerified] = useState(false);
    const { isHighContrast } = useTabs();
    return (
        <main className="min-h-screen bg-white font-mukta">
            <Breadcrumb />

            <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
                <h1 className="text-4xl font-black text-slate-900 mb-8 border-b-4 border-orange-500 pb-4">
                    Contact Us
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left: Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-[#003366] mb-6">Get in Touch</h2>
                            <p className="text-slate-600 mb-8">
                                For any queries, feedback, or complaints regarding the S.A.T.Y.A portal or election-related information, please reach out to us through the following channels.
                            </p>
                        </div>

                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-none">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Headquarters</h3>
                                    <p className="text-slate-600 text-sm">Nirvachan Sadan, Ashoka Road,</p>
                                    <p className="text-slate-600 text-sm">New Delhi - 110001</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-3 bg-orange-50 text-orange-600 rounded-none">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Toll Free Helpline</h3>
                                    <p className="text-slate-600 text-sm">1800-111-950 (English/Hindi)</p>
                                    <p className="text-slate-600 text-sm">Available Mon-Sat, 9 AM - 6 PM</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-none">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Email Support</h3>
                                    <p className="text-slate-600 text-sm">complaints-satya@gov.in</p>
                                    <p className="text-slate-600 text-sm">tech-support@satya.gov.in</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Right: Submission Form */}
                    <div className="bg-slate-50 p-8 border border-slate-200 rounded-none shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Send a Message</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                                <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                                <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Subject</label>
                                <select className="w-full px-4 py-2 border border-slate-300 rounded-none focus:ring-2 focus:ring-blue-500 outline-none">
                                    <option>General Query</option>
                                    <option>Technical Issue</option>
                                    <option>Feedback</option>
                                    <option>Report Misinformation</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Message</label>
                                <textarea rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-none focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Your message here..."></textarea>
                            </div>

                            <div className="py-2">
                                <Captcha onVerify={setIsVerified} isHighContrast={isHighContrast} />
                            </div>

                            <button
                                type="submit"
                                disabled={!isVerified}
                                className="w-full bg-[#003366] text-white font-bold py-3 hover:bg-black transition-colors uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Submit Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
