"use client";

import React from "react";

interface CircularProgressProps {
    completed: number;
    total: number;
    size?: number;
    strokeWidth?: number;
}

export function CircularProgress({
    completed,
    total,
    size = 180,
    strokeWidth = 12,
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            {/* Background glow effect */}
            <div
                className="absolute rounded-full opacity-30"
                style={{
                    width: size + 20,
                    height: size + 20,
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
                }}
            />

            <svg
                className="progress-ring"
                width={size}
                height={size}
            >
                {/* Gradient definition */}
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                </defs>

                {/* Background circle */}
                <circle
                    className="progress-ring-bg"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke="#334155"
                />

                {/* Progress circle */}
                <circle
                    className="progress-ring-fill"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    stroke="url(#progressGradient)"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                        filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))',
                    }}
                />
            </svg>

            {/* Center text */}
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-[#f1f5f9]">
                    {completed}
                    <span className="text-2xl text-[#94a3b8]">/{total}</span>
                </span>
                <span className="text-sm text-[#94a3b8] mt-1">Steps Completed</span>
            </div>
        </div>
    );
}
