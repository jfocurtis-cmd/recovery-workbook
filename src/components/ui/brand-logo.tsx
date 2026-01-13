import React from "react";
import { HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
    className?: string;
    iconClassName?: string;
    textClassName?: string;
}

export function BrandLogo({ className, iconClassName, textClassName }: BrandLogoProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="relative flex items-center justify-center">
                {/* Glow effect backend */}
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                <HeartHandshake className={cn("h-7 w-7 text-blue-500 relative z-10", iconClassName)} />
            </div>
            <span className={cn("font-bold text-xl tracking-tight text-slate-100", textClassName)}>
                12-Step Companion
            </span>
        </div>
    );
}
