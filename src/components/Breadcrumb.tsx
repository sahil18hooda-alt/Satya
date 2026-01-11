"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";

export function Breadcrumb() {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(segment => segment !== "");

    if (pathname === "/") return null;

    return (
        <nav aria-label="Breadcrumb" className="bg-slate-100 border-b border-slate-200 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ol className="flex items-center space-x-2 text-sm text-slate-600">
                    <li>
                        <Link href="/" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
                            <Home className="w-4 h-4" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </li>
                    {pathSegments.map((segment, index) => {
                        const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathSegments.length - 1;
                        const label = segment.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                        return (
                            <li key={href} className="flex items-center space-x-2">
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                {isLast ? (
                                    <span className="font-bold text-slate-900" aria-current="page">
                                        {label}
                                    </span>
                                ) : (
                                    <Link href={href} className="hover:text-blue-600 transition-colors">
                                        {label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
}
