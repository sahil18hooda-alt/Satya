import { BookOpen, ExternalLink } from "lucide-react";

interface ContextLabelProps {
    title: string;
    excerpt: string;
    url: string;
}

export function ContextLabel({ title, excerpt, url }: ContextLabelProps) {
    return (
        <div className="flex flex-col gap-2 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-none">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-semibold text-sm uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                Official Context
            </div>
            <p className="text-sm text-foreground/80 italic">
                "{excerpt}"
            </p>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 mt-1 transition-colors"
            >
                Source: {title}
                <ExternalLink className="w-3 h-3" />
            </a>
        </div>
    );
}
