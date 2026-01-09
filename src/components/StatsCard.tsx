import { TrendingUp, Users } from "lucide-react";

export function StatsCard() {
    return (
        <div className="bg-[#13316c] text-white rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-md relative overflow-hidden">
            {/* Background blobs for aesthetic */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-x-10 -translate-y-10"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl translate-x-10 translate-y-10"></div>

            <div className="relative z-10">
                <TrendingUp className="w-8 h-8 mx-auto mb-3 opacity-90" />
                <h2 className="text-5xl font-bold mb-1 font-mukta">15,400</h2>
                <p className="text-blue-100 text-sm font-medium mb-6">Messages Verified Today</p>

                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                    <div className="flex -space-x-2">
                        {/* Mock avatars */}
                        <div className="w-6 h-6 rounded-full bg-red-400 border-2 border-[#1e3a8a]" />
                        <div className="w-6 h-6 rounded-full bg-green-400 border-2 border-[#1e3a8a]" />
                        <div className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-[#1e3a8a]" />
                    </div>
                    <span className="text-xs font-semibold text-blue-100">+2k active users now</span>
                </div>
            </div>
        </div>
    );
}
