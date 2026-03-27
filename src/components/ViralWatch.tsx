import { Share2, Flame, Filter, Clock } from "lucide-react";
import { T } from "./TranslatedText";

const MYTHS = [
    {
        tag: "FALSE",
        tagColor: "bg-[#fee2e2] text-[#991b1b]",
        title: 'Video showing "ballot stuffing" in Kerala is from 2019 mock drill',
        shares: "12k",
        trending: true,
        timeAgo: "2h ago",
    },
    {
        tag: "MISLEADING",
        tagColor: "bg-[#fef3c7] text-[#92400e]",
        title: "New election rules do NOT require voters to surrender phones",
        shares: "8.5k",
        trending: false,
        timeAgo: "5h ago",
    },
    {
        tag: "FALSE",
        tagColor: "bg-[#fee2e2] text-[#991b1b]",
        title: "Free laptop scheme for students linked in WhatsApp is a phishing scam",
        shares: "5k",
        trending: false,
        timeAgo: "8h ago",
    },
];

interface ViralWatchProps {
    onMythClick?: (title: string) => void;
}

export function ViralWatch({ onMythClick }: ViralWatchProps) {
    return (
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200 text-card-foreground rounded-none shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="flex items-center gap-2 font-bold text-lg text-slate-800">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <T>Viral Watch</T>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5"><T>Top debunked myths circulating now</T></p>
                </div>
                <button className="p-2 hover:bg-slate-100 transition-colors">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                </button>
            </div>

            <div className="space-y-3">
                {MYTHS.map((myth, i) => (
                    <div
                        key={i}
                        onClick={() => onMythClick?.(myth.title)}
                        className="border border-slate-100 bg-white/50 p-4 hover:bg-blue-50/40 hover:border-blue-200 transition-all cursor-pointer group hover:shadow-sm"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-none ${myth.tagColor}`}>
                                <T>{myth.tag}</T>
                            </span>
                            {myth.trending && (
                                <span className="flex items-center gap-1 text-[10px] font-medium text-orange-500">
                                    <T>Trending</T> <Flame className="w-3 h-3 fill-orange-500" />
                                </span>
                            )}
                        </div>
                        <h4 className="font-semibold text-sm mb-3 leading-snug text-slate-800 group-hover:text-blue-900 transition-colors">
                            <T>{myth.title}</T>
                        </h4>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Share2 className="w-3 h-3" />
                                <T>Shared</T> {myth.shares} <T>times</T>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {myth.timeAgo}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 text-sm font-semibold text-[#0B1F4F] py-2.5 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-100">
                <T>View All Trends</T> →
            </button>
        </div>
    );
}
