"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Columns, LayoutGrid, Maximize2 } from "lucide-react";
import { ColumnView } from "./ColumnView";
import { AlignedView } from "./AlignedView";
import { FullEntryModal } from "./FullEntryModal";

export interface ResentmentEntry {
    id: string;
    resentfulAt: string;
    theCause: string;
    affectsMy: {
        selfEsteem: boolean;
        pocketbook: boolean;
        ambition: boolean;
        personalRelations: boolean;
        sexualRelations: boolean;
        security: boolean;
    };
    myPart: string;
    myFears: string;
    sexReview: string;
}

const createEmptyEntry = (): ResentmentEntry => ({
    id: `resentment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    resentfulAt: "",
    theCause: "",
    affectsMy: {
        selfEsteem: false,
        pocketbook: false,
        ambition: false,
        personalRelations: false,
        sexualRelations: false,
        security: false,
    },
    myPart: "",
    myFears: "",
    sexReview: "",
});

interface ResentmentInventoryProps {
    value: ResentmentEntry[];
    onChange: (entries: ResentmentEntry[]) => void;
}

export function ResentmentInventory({ value, onChange }: ResentmentInventoryProps) {
    const [entries, setEntries] = useState<ResentmentEntry[]>(
        value.length > 0 ? value : [createEmptyEntry()]
    );
    const [viewMode, setViewMode] = useState<"column" | "aligned">("column");
    const [isSaving, setIsSaving] = useState(false);
    const [fullViewEntry, setFullViewEntry] = useState<ResentmentEntry | null>(null);

    // Sync with prop
    useEffect(() => {
        if (value.length > 0) {
            setEntries(value);
        }
    }, [value]);

    // Debounced save
    useEffect(() => {
        if (JSON.stringify(entries) === JSON.stringify(value)) return;

        const timer = setTimeout(() => {
            setIsSaving(true);
            onChange(entries);
            setTimeout(() => setIsSaving(false), 500);
        }, 500);

        return () => clearTimeout(timer);
    }, [entries, onChange, value]);

    const addEntry = () => {
        setEntries([...entries, createEmptyEntry()]);
    };

    const updateEntry = (id: string, field: keyof ResentmentEntry, fieldValue: any) => {
        setEntries((prev) =>
            prev.map((entry) =>
                entry.id === id ? { ...entry, [field]: fieldValue } : entry
            )
        );
    };

    const removeEntry = (id: string) => {
        if (entries.length <= 1) return;
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
    };

    const openFullView = (entry: ResentmentEntry) => {
        setFullViewEntry(entry);
    };

    const closeFullView = () => {
        setFullViewEntry(null);
    };

    const handleFullViewUpdate = (field: keyof ResentmentEntry, fieldValue: any) => {
        if (!fullViewEntry) return;
        updateEntry(fullViewEntry.id, field, fieldValue);
        setFullViewEntry({ ...fullViewEntry, [field]: fieldValue });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h3 className="text-xl font-semibold text-[#f1f5f9]">Resentment Inventory</h3>
                    <p className="text-sm text-[#94a3b8] mt-1">
                        {entries.length} {entries.length === 1 ? "entry" : "entries"}
                        {isSaving && <span className="ml-2 text-[#3b82f6] animate-pulse">Saving...</span>}
                    </p>
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === "column" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("column")}
                        className="gap-2"
                    >
                        <Columns className="h-4 w-4" />
                        Column View
                    </Button>
                    <Button
                        variant={viewMode === "aligned" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("aligned")}
                        className="gap-2"
                    >
                        <LayoutGrid className="h-4 w-4" />
                        Aligned View
                    </Button>
                </div>
            </div>

            {/* Content based on view mode */}
            {viewMode === "column" ? (
                <ColumnView
                    entries={entries}
                    onUpdateEntry={updateEntry}
                    onRemoveEntry={removeEntry}
                    onOpenFullView={openFullView}
                />
            ) : (
                <AlignedView
                    entries={entries}
                    onUpdateEntry={updateEntry}
                    onRemoveEntry={removeEntry}
                    onOpenFullView={openFullView}
                />
            )}

            {/* Add entry button */}
            <Button onClick={addEntry} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Resentment Entry
            </Button>

            {/* Full Entry Modal */}
            <FullEntryModal
                entry={fullViewEntry}
                onClose={closeFullView}
                onUpdate={handleFullViewUpdate}
            />
        </div>
    );
}
