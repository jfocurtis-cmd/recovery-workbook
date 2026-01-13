"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X, ArrowRight } from "lucide-react";
import { ResentmentEntry } from "./ResentmentInventory";

interface FullEntryModalProps {
    entry: ResentmentEntry | null;
    onClose: () => void;
    onUpdate: (field: keyof ResentmentEntry, value: any) => void;
}

const AFFECTS_OPTIONS = [
    { key: "selfEsteem", label: "Self-esteem" },
    { key: "pocketbook", label: "Pocketbook" },
    { key: "ambition", label: "Ambition" },
    { key: "personalRelations", label: "Personal Relations" },
    { key: "sexualRelations", label: "Sexual Relations" },
    { key: "security", label: "Security" },
];

export function FullEntryModal({ entry, onClose, onUpdate }: FullEntryModalProps) {
    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!entry) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-[95vw] max-w-7xl max-h-[90vh] bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#334155] bg-[#0f172a]">
                    <div>
                        <h2 className="text-xl font-semibold text-[#f1f5f9]">Full Resentment View</h2>
                        <p className="text-sm text-[#94a3b8]">See all 6 columns in context</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content - All 6 columns in a horizontal flow */}
                <div className="p-4 overflow-auto max-h-[calc(90vh-100px)]">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                        {/* Column 1: Resentful At */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#3b82f6]">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3b82f6] text-white text-xs font-bold">1</span>
                                <h3 className="font-medium text-sm">I'm Resentful At</h3>
                            </div>
                            <Textarea
                                value={entry.resentfulAt}
                                onChange={(e) => onUpdate("resentfulAt", e.target.value)}
                                placeholder="Who or what..."
                                className="min-h-[150px] text-sm"
                            />
                            <div className="flex justify-end">
                                <ArrowRight className="h-4 w-4 text-[#3b82f6] hidden lg:block" />
                            </div>
                        </div>

                        {/* Column 2: The Cause */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#3b82f6]">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3b82f6] text-white text-xs font-bold">2</span>
                                <h3 className="font-medium text-sm">The Cause</h3>
                            </div>
                            <Textarea
                                value={entry.theCause}
                                onChange={(e) => onUpdate("theCause", e.target.value)}
                                placeholder="What happened..."
                                className="min-h-[150px] text-sm"
                            />
                            <div className="flex justify-end">
                                <ArrowRight className="h-4 w-4 text-[#3b82f6] hidden lg:block" />
                            </div>
                        </div>

                        {/* Column 3: Affects My */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#3b82f6]">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3b82f6] text-white text-xs font-bold">3</span>
                                <h3 className="font-medium text-sm">Affects My</h3>
                            </div>
                            <div className="space-y-2 min-h-[150px]">
                                {AFFECTS_OPTIONS.map((option) => (
                                    <div
                                        key={option.key}
                                        className={`
                      flex items-center gap-2 p-2 rounded border cursor-pointer transition-all text-sm
                      ${entry.affectsMy[option.key as keyof typeof entry.affectsMy]
                                                ? "bg-[rgba(59,130,246,0.2)] border-[#3b82f6]"
                                                : "bg-[#0f172a] border-[#334155] hover:border-[rgba(59,130,246,0.3)]"
                                            }
                    `}
                                        onClick={() => {
                                            const newAffects = {
                                                ...entry.affectsMy,
                                                [option.key]: !entry.affectsMy[option.key as keyof typeof entry.affectsMy],
                                            };
                                            onUpdate("affectsMy", newAffects);
                                        }}
                                    >
                                        <Checkbox
                                            checked={entry.affectsMy[option.key as keyof typeof entry.affectsMy]}
                                            className="h-4 w-4"
                                        />
                                        <Label className="cursor-pointer text-xs">{option.label}</Label>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end">
                                <ArrowRight className="h-4 w-4 text-[#3b82f6] hidden lg:block" />
                            </div>
                        </div>

                        {/* Column 4: My Part */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#3b82f6]">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3b82f6] text-white text-xs font-bold">4</span>
                                <h3 className="font-medium text-sm">My Part</h3>
                            </div>
                            <Textarea
                                value={entry.myPart}
                                onChange={(e) => onUpdate("myPart", e.target.value)}
                                placeholder="Where I was wrong..."
                                className="min-h-[150px] text-sm"
                            />
                            <div className="flex justify-end">
                                <ArrowRight className="h-4 w-4 text-[#3b82f6] hidden lg:block" />
                            </div>
                        </div>

                        {/* Column 5: Fear */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#3b82f6]">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3b82f6] text-white text-xs font-bold">5</span>
                                <h3 className="font-medium text-sm">Fear</h3>
                            </div>
                            <Textarea
                                value={entry.myFears}
                                onChange={(e) => onUpdate("myFears", e.target.value)}
                                placeholder="What fear is connected..."
                                className="min-h-[150px] text-sm"
                            />
                            <div className="flex justify-end">
                                <ArrowRight className="h-4 w-4 text-[#3b82f6] hidden lg:block" />
                            </div>
                        </div>

                        {/* Column 6: Sex Review */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#3b82f6]">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3b82f6] text-white text-xs font-bold">6</span>
                                <h3 className="font-medium text-sm">Sex Review</h3>
                            </div>
                            <Textarea
                                value={entry.sexReview}
                                onChange={(e) => onUpdate("sexReview", e.target.value)}
                                placeholder="If applicable..."
                                className="min-h-[150px] text-sm"
                            />
                        </div>
                    </div>

                    {/* Flow indicator for mobile */}
                    <div className="mt-4 lg:hidden text-center text-xs text-[#64748b]">
                        Each column builds on the previous: Who → Why → How it affected me → My part → My fear → Sex review
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t border-[#334155] bg-[#0f172a]">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}
