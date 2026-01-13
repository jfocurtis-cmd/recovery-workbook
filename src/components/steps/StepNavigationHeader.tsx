import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

interface StepNavigationHeaderProps {
    stepNumber: number;
}

export function StepNavigationHeader({ stepNumber }: StepNavigationHeaderProps) {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-[#334155]">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                    <ArrowLeft className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    <BrandLogo iconClassName="h-6 w-6" textClassName="text-lg hidden sm:block" />
                </Link>

                <div className="flex items-center gap-2">
                    {stepNumber > 1 && (
                        <Link href={`/steps/${stepNumber - 1}`}>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-100">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Step {stepNumber - 1}
                            </Button>
                        </Link>
                    )}
                    {stepNumber < 12 && (
                        <Link href={`/steps/${stepNumber + 1}`}>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-100">
                                Step {stepNumber + 1}
                                <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
