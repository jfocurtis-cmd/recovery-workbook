"use client";

import React from "react";

interface StepHeaderProps {
    stepNumber: number;
    title: string;
    quote: string;
}

export function StepHeader({ stepNumber, title, quote }: StepHeaderProps) {
    return (
        <div className="relative mb-8">
            {/* Decorative watercolor-style background */}
            <div
                className="absolute -inset-4 opacity-30 rounded-2xl"
                style={{
                    background: 'radial-gradient(ellipse at 30% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 60%)',
                }}
            />

            <div className="relative">
                {/* Step badge */}
                <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#3b82f6] text-white text-xl font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                        {stepNumber}
                    </span>
                    <div>
                        <p className="text-sm text-[#94a3b8] uppercase tracking-wider">Step {stepNumber}</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#f1f5f9]">{title}</h1>
                    </div>
                </div>

                {/* Quote */}
                <blockquote className="quote-style text-lg md:text-xl leading-relaxed">
                    "{quote}"
                </blockquote>
            </div>
        </div>
    );
}
