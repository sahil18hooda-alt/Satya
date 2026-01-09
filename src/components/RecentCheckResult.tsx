import { ShieldAlert, Share2, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { FactCheckModal } from "./FactCheckModal";

interface RecentCheckResultProps {
    result: any; // Using any for simplicity as per existing main page logic, ideally explicit type
}

export function RecentCheckResult({ result }: RecentCheckResultProps) {
    if (!result) return null;

    const isFake = result.isFake;

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="bg-white border rounded-3xl p-6 shadow-sm mt-6">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                    Most Recent Check
                </h3>

                <div className="flex gap-4">
                    <div className={`mt-1 min-w-[40px] h-[40px] rounded-full flex items-center justify-center ${isFake ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {isFake ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    </div>

                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isFake ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                {isFake ? "FALSE" : "TRUE"}
                            </span>
                            <span className="text-xs text-muted-foreground">Checked just now</span>
                        </div>

                        <h4 className="font-bold text-lg mb-2 leading-tight">
                            {isFake ? "Rumor Detected" : "Verified Information"}
                        </h4>

                        <p className="text-sm text-foreground/80 mb-4 leading-relaxed">
                            {result.explanation?.reason || "No detailed explanation provided."}
                        </p>

                        <button
                            onClick={() => setIsOpen(true)}
                            className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:underline"
                        >
                            Read Full Fact Check <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <FactCheckModal isOpen={isOpen} onClose={() => setIsOpen(false)} result={result} />
        </>
    );
}
