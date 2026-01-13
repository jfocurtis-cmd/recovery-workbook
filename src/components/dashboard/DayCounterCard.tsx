"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface DayCounterCardProps {
    days: number;
    label: string;
    type: "total" | "current";
}

function formatDays(days: number): { value: string; unit: string } {
    if (days >= 365) {
        const years = Math.floor(days / 365);
        const remainingDays = days % 365;
        const months = Math.floor(remainingDays / 30);
        if (months > 0) {
            return { value: `${years}y ${months}m`, unit: "" };
        }
        return { value: years.toString(), unit: years === 1 ? "year" : "years" };
    }
    if (days >= 30) {
        const months = Math.floor(days / 30);
        const remainingDays = days % 30;
        if (remainingDays > 0) {
            return { value: `${months}m ${remainingDays}d`, unit: "" };
        }
        return { value: months.toString(), unit: months === 1 ? "month" : "months" };
    }
    if (days >= 7) {
        const weeks = Math.floor(days / 7);
        const remainingDays = days % 7;
        if (remainingDays > 0) {
            return { value: `${weeks}w ${remainingDays}d`, unit: "" };
        }
        return { value: weeks.toString(), unit: weeks === 1 ? "week" : "weeks" };
    }
    return { value: days.toString(), unit: days === 1 ? "day" : "days" };
}

export function DayCounterCard({ days, label, type }: DayCounterCardProps) {
    const { value, unit } = formatDays(days);
    const Icon = type === "total" ? Calendar : Clock;

    return (
        <Card className="relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div
                className="absolute inset-0 opacity-50 pointer-events-none"
                style={{
                    background: type === "total"
                        ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)'
                        : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, transparent 100%)',
                }}
            />

            <CardContent className="p-6 relative">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-[#94a3b8] mb-1">{label}</p>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-4xl font-bold ${type === "total" ? "text-[#3b82f6]" : "text-[#8b5cf6]"}`}>
                                {value}
                            </span>
                            {unit && (
                                <span className="text-lg text-[#94a3b8]">{unit}</span>
                            )}
                        </div>
                    </div>
                    <div className={`p-3 rounded-full ${type === "total" ? "bg-[rgba(59,130,246,0.1)]" : "bg-[rgba(139,92,246,0.1)]"}`}>
                        <Icon className={`h-6 w-6 ${type === "total" ? "text-[#3b82f6]" : "text-[#8b5cf6]"}`} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
