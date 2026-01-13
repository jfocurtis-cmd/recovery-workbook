"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Maximize2 } from "lucide-react";
import { ResentmentEntry } from "./ResentmentInventory";

interface AlignedViewProps {
    entries: ResentmentEntry[];
    onUpdateEntry: (id: string, field: keyof ResentmentEntry, value: any) => void;
    onRemoveEntry: (id: string) => void;
    onOpenFullView: (entry: ResentmentEntry) => void;
}

const AFFECTS_OPTIONS = [
    { key: "selfEsteem", label: "SE" },
    { key: "pocketbook", label: "PB" },
    { key: "ambition", label: "AM" },
    { key: "personalRelations", label: "PR" },
    { key: "sexualRelations", label: "SR" },
    { key: "security", label: "SC" },
];

export function AlignedView({ entries, onUpdateEntry, onRemoveEntry, onOpenFullView }: AlignedViewProps) {
    return (
        <div className="overflow-x-auto">
            <div className="min-w-[1200px]">
                {/* Header row */}
                <div className="grid grid-cols-[auto_1fr_1fr_auto_1fr_1fr_1fr_auto_auto] gap-2 p-3 bg-[#1e293b] border border-[#334155] rounded-t-lg">
                    <div className="w-8 text-xs font-semibold text-[#94a3b8]">#</div>
                    <div className="text-xs font-semibold text-[#94a3b8]">1. Resentful At</div>
                    <div className="text-xs font-semibold text-[#94a3b8]">2. The Cause</div>
                    <div className="text-xs font-semibold text-[#94a3b8] text-center w-32">3. Affects</div>
                    <div className="text-xs font-semibold text-[#94a3b8]">4. My Part</div>
                    <div className="text-xs font-semibold text-[#94a3b8]">5. Fear</div>
                    <div className="text-xs font-semibold text-[#94a3b8]">6. Sex</div>
                    <div className="w-8 text-xs font-semibold text-[#94a3b8] text-center">View</div>
                    <div className="w-8"></div>
                </div>

                {/* Affects legend */}
                <div className="px-3 py-2 bg-[#0f172a] border-x border-[#334155] text-xs text-[#64748b]">
                    <span className="mr-4">Legend:</span>
                    <span className="mr-3">SE = Self-esteem</span>
                    <span className="mr-3">PB = Pocketbook</span>
                    <span className="mr-3">AM = Ambition</span>
                    <span className="mr-3">PR = Personal Relations</span>
                    <span className="mr-3">SR = Sexual Relations</span>
                    <span>SC = Security</span>
                </div>

                {/* Entry rows */}
                {entries.map((entry, index) => (
                    <div
                        key={entry.id}
                        className={`
                            grid grid-cols-[auto_1fr_1fr_auto_1fr_1fr_1fr_auto_auto] gap-2 p-3 border-x border-b border-[#334155]
                            ${index % 2 === 0 ? "bg-[#0f172a]" : "bg-[#1e293b]/50"}
                        `}
                    >
                        {/* Row number */}
                        <div className="w-8 flex items-start justify-center pt-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[rgba(59,130,246,0.2)] text-[#3b82f6] text-xs font-medium">
                                {index + 1}
                            </span>
                        </div>

                        {/* Column 1 */}
                        <div>
                            <Textarea
                                value={entry.resentfulAt}
                                onChange={(e) => onUpdateEntry(entry.id, "resentfulAt", e.target.value)}
                                placeholder="Person/thing..."
                                className="min-h-[80px] text-sm"
                            />
                        </div>

                        {/* Column 2 */}
                        <div>
                            <Textarea
                                value={entry.theCause}
                                onChange={(e) => onUpdateEntry(entry.id, "theCause", e.target.value)}
                                placeholder="What happened..."
                                className="min-h-[80px] text-sm"
                            />
                        </div>

                        {/* Column 3 - Affects checkboxes */}
                        <div className="w-32 flex flex-wrap gap-1 items-start pt-1">
                            {AFFECTS_OPTIONS.map((option) => (
                                <div
                                    key={option.key}
                                    className={`
                                        flex items-center justify-center w-9 h-7 rounded text-xs cursor-pointer transition-all
                                        ${entry.affectsMy[option.key as keyof typeof entry.affectsMy]
                                            ? "bg-[#3b82f6] text-white"
                                            : "bg-[#334155] text-[#94a3b8] hover:bg-[#475569]"
                                        }
                                    `}
                                    onClick={() => {
                                        const newAffects = {
                                            ...entry.affectsMy,
                                            [option.key]: !entry.affectsMy[option.key as keyof typeof entry.affectsMy],
                                        };
                                        onUpdateEntry(entry.id, "affectsMy", newAffects);
                                    }}
                                    title={
                                        option.label === "SE" ? "Self-esteem" :
                                            option.label === "PB" ? "Pocketbook" :
                                                option.label === "AM" ? "Ambition" :
                                                    option.label === "PR" ? "Personal Relations" :
                                                        option.label === "SR" ? "Sexual Relations" : "Security"
                                    }
                                >
                                    {option.label}
                                </div>
                            ))}
                        </div>

                        {/* Column 4 */}
                        <div>
                            <Textarea
                                value={entry.myPart}
                                onChange={(e) => onUpdateEntry(entry.id, "myPart", e.target.value)}
                                placeholder="Where I was wrong..."
                                className="min-h-[80px] text-sm"
                            />
                        </div>

                        {/* Column 5 */}
                        <div>
                            <Textarea
                                value={entry.myFears}
                                onChange={(e) => onUpdateEntry(entry.id, "myFears", e.target.value)}
                                placeholder="Fear connected..."
                                className="min-h-[80px] text-sm"
                            />
                        </div>

                        {/* Column 6 */}
                        <div>
                            <Textarea
                                value={entry.sexReview}
                                onChange={(e) => onUpdateEntry(entry.id, "sexReview", e.target.value)}
                                placeholder="If applicable..."
                                className="min-h-[80px] text-sm"
                            />
                        </div>

                        {/* Full View button */}
                        <div className="w-8 flex items-start pt-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onOpenFullView(entry)}
                                className="h-6 w-6 text-[#3b82f6] hover:bg-[rgba(59,130,246,0.1)]"
                                title="View full entry"
                            >
                                <Maximize2 className="h-3 w-3" />
                            </Button>
                        </div>

                        {/* Delete button */}
                        <div className="w-8 flex items-start pt-2">
                            {entries.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onRemoveEntry(entry.id)}
                                    className="h-6 w-6 text-[#94a3b8] hover:text-[#ef4444]"
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}

                {/* Footer */}
                <div className="p-2 bg-[#1e293b] border border-t-0 border-[#334155] rounded-b-lg">
                    <p className="text-xs text-[#64748b] text-center">
                        Scroll horizontally to see all columns • {entries.length} {entries.length === 1 ? "entry" : "entries"} • Click expand icon to view entry in context
                    </p>
                </div>
            </div>
        </div>
    );
}
