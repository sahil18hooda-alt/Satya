import { useState, useEffect } from "react";
import { Calendar, ArrowRight, Share2, Tag, Globe, Loader2 } from "lucide-react";

const LANGUAGES = [
    "English", "Hindi", "Assamese", "Bengali", "Bodo", "Dogri", "Gujarati",
    "Kannada", "Kashmiri", "Konkani", "Maithili", "Malayalam", "Manipuri",
    "Marathi", "Nepali", "Odia", "Punjabi", "Sanskrit", "Santhali",
    "Sindhi", "Tamil", "Telugu", "Urdu"
];

export function ElectionNews() {
    const [language, setLanguage] = useState("English");
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, [language]);

    const fetchNews = async () => {
        setLoading(true);
        setNews([]);
        try {
            const API_URL = process.env.NODE_ENV === "development"
                ? "http://localhost:8000"
                : (process.env.NEXT_PUBLIC_API_URL ?? "");

            const response = await fetch(`${API_URL}/latest-news`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ language }),
            });
            const data = await response.json();
            setNews(data);
        } catch (error) {
            console.error("News Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-end justify-between gap-6">
                <div className="text-left">
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Election Newsroom</h2>
                    <p className="text-slate-500">Latest updates, official announcements, and poll analysis.</p>
                </div>

                {/* Language Selector */}
                <div className="bg-slate-100 p-2 pl-4 rounded-none flex items-center gap-3 border border-slate-200">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                        <Globe className="w-4 h-4" />
                        Language:
                    </div>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-white border text-sm font-semibold rounded-none px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    >
                        {LANGUAGES.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-white/50 rounded-none border border-dashed">
                    <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
                    <p className="text-muted-foreground font-medium animate-pulse">
                        Translating latest news to <span className="text-slate-900 font-bold">{language}</span>...
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {news.map((item, i) => (
                        <div key={i} className="bg-white border text-card-foreground rounded-none overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                            <div className="h-48 relative overflow-hidden bg-slate-100">
                                {/* Mock Image Gradient for now, would be real URL */}
                                <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                                    <span className="opacity-20 font-black text-4xl">NEWS</span>
                                </div>
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-none text-xs font-bold flex items-center gap-1 shadow-sm">
                                    <Tag className="w-3 h-3 text-orange-500" />
                                    {item.category || "General"}
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                    <span className="font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-none">{item.source}</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.date}</span>
                                </div>

                                <h3 className="font-bold text-lg mb-3 leading-tight text-slate-800 group-hover:text-blue-700 transition-colors">
                                    {item.headline}
                                </h3>

                                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-grow">
                                    {item.summary}
                                </p>

                                <div className="pt-4 border-t flex justify-between items-center mt-auto">
                                    <button className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
                                        Read Full Story <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
