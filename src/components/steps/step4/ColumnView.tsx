"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Trash2, Maximize2 } from "lucide-react";
import { ResentmentEntry } from "./ResentmentInventory";

interface ColumnViewProps {
    entries: ResentmentEntry[];
    onUpdateEntry: (id: string, field: keyof ResentmentEntry, value: any) => void;
    onRemoveEntry: (id: string) => void;
    onOpenFullView: (entry: ResentmentEntry) => void;
}

const AFFECTS_OPTIONS = [
    { key: "selfEsteem", label: "Self-esteem" },
    { key: "pocketbook", label: "Pocketbook" },
    { key: "ambition", label: "Ambition (things I want)" },
    { key: "personalRelations", label: "Personal relationships" },
    { key: "sexualRelations", label: "Sexual relationships" },
    { key: "security", label: "Security (things I need)" },
];

export function ColumnView({ entries, onUpdateEntry, onRemoveEntry, onOpenFullView }: ColumnViewProps) {
    const [currentEntryIndex, setCurrentEntryIndex] = useState(0);
    const currentEntry = entries[currentEntryIndex] || entries[0];

    const goToPrevious = () => {
        setCurrentEntryIndex((i) => Math.max(0, i - 1));
    };

    const goToNext = () => {
        setCurrentEntryIndex((i) => Math.min(entries.length - 1, i + 1));
    };

    if (!currentEntry) return null;

    return (
        <div className="space-y-4">
            {/* Entry navigation */}
            <div className="flex items-center justify-between p-3 bg-[#0f172a] border border-[#334155] rounded-lg">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToPrevious}
                    disabled={currentEntryIndex === 0}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-2">
                    <span className="text-[#f1f5f9] font-medium">
                        Entry {currentEntryIndex + 1} of {entries.length}
                    </span>

                    {/* View Full Entry button */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenFullView(currentEntry)}
                        className="gap-1 text-[#3b82f6] border-[#3b82f6] hover:bg-[rgba(59,130,246,0.1)]"
                    >
                        <Maximize2 className="h-3 w-3" />
                        <span className="hidden sm:inline">Full View</span>
                    </Button>

                    {entries.length > 1 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveEntry(currentEntry.id)}
                            className="text-[#94a3b8] hover:text-[#ef4444]"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={goToNext}
                    disabled={currentEntryIndex === entries.length - 1}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            {/* Column tabs */}
            <Tabs defaultValue="col1" className="w-full">
                <TabsList className="w-full grid grid-cols-3 lg:grid-cols-6 h-auto">
                    <TabsTrigger value="col1" className="text-xs py-2">1. Resentful At</TabsTrigger>
                    <TabsTrigger value="col2" className="text-xs py-2">2. Cause</TabsTrigger>
                    <TabsTrigger value="col3" className="text-xs py-2">3. Affects</TabsTrigger>
                    <TabsTrigger value="col4" className="text-xs py-2">4. My Part</TabsTrigger>
                    <TabsTrigger value="col5" className="text-xs py-2">5. Fear</TabsTrigger>
                    <TabsTrigger value="col6" className="text-xs py-2">6. Sex</TabsTrigger>
                </TabsList>

                {/* Column 1: Resentful At */}
                <TabsContent value="col1" className="mt-4">
                    <div className="p-4 bg-[#1e293b] border border-[#334155] rounded-lg space-y-3">
                        <div>
                            <h4 className="font-medium text-[#f1f5f9] mb-2">Column 1 - I'm Resentful At</h4>
                            <p className="text-sm text-[#94a3b8] mb-4">
                                List the person, principal, or thing you have resentment for. Don't hold back.
                            </p>
                        </div>
                        <Textarea
                            value={currentEntry.resentfulAt}
                            onChange={(e) => onUpdateEntry(currentEntry.id, "resentfulAt", e.target.value)}
                            placeholder="Who or what are you resentful toward?"
                            className="min-h-[150px]"
                        />
                    </div>
                </TabsContent>

                {/* Column 2: The Cause */}
                <TabsContent value="col2" className="mt-4">
                    <div className="p-4 bg-[#1e293b] border border-[#334155] rounded-lg space-y-3">
                        <div>
                            <h4 className="font-medium text-[#f1f5f9] mb-2">Column 2 - The Cause</h4>
                            <p className="text-sm text-[#94a3b8] mb-4">
                                Brief description of events. List the top 2-3 events that led to this resentment.
                            </p>
                        </div>
                        <Textarea
                            value={currentEntry.theCause}
                            onChange={(e) => onUpdateEntry(currentEntry.id, "theCause", e.target.value)}
                            placeholder="What happened? Describe the events..."
                            className="min-h-[200px]"
                        />
                    </div>
                </TabsContent>

                {/* Column 3: Affects My */}
                <TabsContent value="col3" className="mt-4">
                    <div className="p-4 bg-[#1e293b] border border-[#334155] rounded-lg space-y-3">
                        <div>
                            <h4 className="font-medium text-[#f1f5f9] mb-2">Column 3 - Affects My</h4>
                            <p className="text-sm text-[#94a3b8] mb-4">
                                Ask yourself these 6 questions about how this resentment affected you.
                            </p>
                        </div>
                        <div className="space-y-3">
                            {AFFECTS_OPTIONS.map((option) => (
                                <div
                                    key={option.key}
                                    className={`
                                        flex items-center gap-3 p-3 rounded-lg border transition-all
                                        ${currentEntry.affectsMy[option.key as keyof typeof currentEntry.affectsMy]
                                            ? "bg-[rgba(59,130,246,0.1)] border-[rgba(59,130,246,0.3)]"
                                            : "bg-[#0f172a] border-[#334155] hover:border-[rgba(59,130,246,0.3)]"
                                        }
                                    `}
                                >
                                    <Checkbox
                                        checked={currentEntry.affectsMy[option.key as keyof typeof currentEntry.affectsMy]}
                                        onCheckedChange={(checked) => {
                                            const newAffects = {
                                                ...currentEntry.affectsMy,
                                                [option.key]: checked,
                                            };
                                            onUpdateEntry(currentEntry.id, "affectsMy", newAffects);
                                        }}
                                        id={`col-view-${option.key}`}
                                    />
                                    <Label
                                        htmlFor={`col-view-${option.key}`}
                                        className="cursor-pointer"
                                    >
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Column 4: My Part */}
                <TabsContent value="col4" className="mt-4">
                    <div className="p-4 bg-[#1e293b] border border-[#334155] rounded-lg space-y-3">
                        <div>
                            <h4 className="font-medium text-[#f1f5f9] mb-2">Column 4 - My Part</h4>
                            <p className="text-sm text-[#94a3b8] mb-4">
                                Where were you selfish, dishonest, or self-seeking in this situation?
                            </p>
                        </div>
                        <Textarea
                            value={currentEntry.myPart}
                            onChange={(e) => onUpdateEntry(currentEntry.id, "myPart", e.target.value)}
                            placeholder="What was your part in this resentment?"
                            className="min-h-[200px]"
                        />
                    </div>
                </TabsContent>

                {/* Column 5: Fear */}
                <TabsContent value="col5" className="mt-4">
                    <div className="p-4 bg-[#1e293b] border border-[#334155] rounded-lg space-y-3">
                        <div>
                            <h4 className="font-medium text-[#f1f5f9] mb-2">Column 5 - Fear</h4>
                            <p className="text-sm text-[#94a3b8] mb-4">
                                What fear is associated with this resentment? "God, why do I have this fear? Was it because self-reliance failed me?"
                            </p>
                        </div>
                        <Textarea
                            value={currentEntry.myFears}
                            onChange={(e) => onUpdateEntry(currentEntry.id, "myFears", e.target.value)}
                            placeholder="What fears are connected to this resentment?"
                            className="min-h-[200px]"
                        />
                    </div>
                </TabsContent>

                {/* Column 6: Sex */}
                <TabsContent value="col6" className="mt-4">
                    <div className="p-4 bg-[#1e293b] border border-[#334155] rounded-lg space-y-3">
                        <div>
                            <h4 className="font-medium text-[#f1f5f9] mb-2">Column 6 - Sex Review</h4>
                            <p className="text-sm text-[#94a3b8] mb-4">
                                If applicable, review any romantic or sexual aspects. Where were you selfish, dishonest, or inconsiderate?
                            </p>
                        </div>
                        <Textarea
                            value={currentEntry.sexReview}
                            onChange={(e) => onUpdateEntry(currentEntry.id, "sexReview", e.target.value)}
                            placeholder="Review sex conduct if applicable..."
                            className="min-h-[200px]"
                        />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
