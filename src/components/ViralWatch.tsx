import { Share2, Flame, Filter } from "lucide-react";

const MYTHS = [
    {
        tag: "FALSE",
        tagColor: "bg-[#fee2e2] text-[#991b1b]", // Light Red bg, Dark Red text
        title: 'Video showing "ballot stuffing" in Kerala is from 2019 mock drill',
        shares: "12k",
        trending: true,
    },
    {
        tag: "MISLEADING",
        tagColor: "bg-[#fef3c7] text-[#92400e]", // Amber bg, Amber text
        title: "New election rules do NOT require voters to surrender phones",
        shares: "8.5k",
        trending: false,
    },
    {
        tag: "FALSE",
        tagColor: "bg-[#fee2e2] text-[#991b1b]",
        title: "Free laptop scheme for students linked in WhatsApp is a phishing scam",
        shares: "5k",
        trending: false,
    },
];

export function ViralWatch() {
    return (
        <div className="bg-white border text-card-foreground rounded-none shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="flex items-center gap-2 font-bold text-lg">
                        <span className="w-2 h-2 rounded-none bg-red-500 animate-pulse" />
                        Viral Watch
                    </h3>
                    <p className="text-xs text-muted-foreground">Top debunked myths circulating now</p>
                </div>
                <button className="p-2 hover:bg-muted rounded-none">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                </button>
            </div>

            <div className="space-y-4">
                {MYTHS.map((myth, i) => (
                    <div key={i} className="border rounded-none p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none ${myth.tagColor}`}>
                                {myth.tag}
                            </span>
                            {myth.trending && (
                                <span className="flex items-center gap-1 text-[10px] font-medium text-orange-500">
                                    Trending <Flame className="w-3 h-3 fill-orange-500" />
                                </span>
                            )}
                        </div>
                        <h4 className="font-semibold text-sm mb-3 leading-snug">
                            {myth.title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Share2 className="w-3 h-3" />
                                Shared {myth.shares} times
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 text-sm font-semibold text-blue-600 py-2 hover:bg-blue-50 rounded-none transition-colors">
                View All Trends
            </button>
        </div>
    );
}
