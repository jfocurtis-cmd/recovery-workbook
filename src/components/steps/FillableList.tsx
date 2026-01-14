"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ListItem {
    id: string;
    content: string;
    date?: string;
    rippleEffects?: string;
}

interface FillableListProps {
    fieldKey: string;
    title: string;
    instruction?: string;
    count: number;
    hasDate?: boolean;
    hasRippleEffects?: boolean;
    value: ListItem[];
    onChange: (key: string, value: ListItem[]) => void;
    dateLabel?: string;
    rippleEffectsLabel?: string;
}

export function FillableList({
    fieldKey,
    title,
    instruction,
    count,
    hasDate = false,
    hasRippleEffects = false,
    value,
    onChange,
    dateLabel = "Date (if known)",
    rippleEffectsLabel = "Ripple Effects",
}: FillableListProps) {
    const isFirstRender = React.useRef(true);

    // Initialize with empty items if needed
    useEffect(() => {
        if (value.length === 0 && isFirstRender.current) {
            isFirstRender.current = false;
            const initialItems = Array.from({ length: count }, (_, i) => ({
                id: `${fieldKey}_${i + 1}`,
                content: "",
                date: "",
                rippleEffects: "",
            }));
            onChange(fieldKey, initialItems);
        } else if (value.length > 0) {
            isFirstRender.current = false;
        }
    }, [count, fieldKey, onChange, value.length]); // Minimal dependencies

    const updateItem = (index: number, field: keyof ListItem, newValue: string) => {
        // Ensure value is an array before spreading
        const safeValue = Array.isArray(value) ? value : [];
        const newItems = [...safeValue];

        // Ensure the item exists before updating
        if (!newItems[index]) {
            // Should not happen if rendering works, but safe fallback
            newItems[index] = {
                id: `${fieldKey}_${index + 1}`,
                content: "",
                date: "",
                rippleEffects: "",
                [field]: newValue,
            };
        } else {
            newItems[index] = { ...newItems[index], [field]: newValue };
        }
        onChange(fieldKey, newItems);
    };

    const addItem = () => {
        const safeValue = Array.isArray(value) ? value : [];
        onChange(fieldKey, [
            ...safeValue,
            {
                id: `${fieldKey}_${safeValue.length + 1}`,
                content: "",
                date: "",
                rippleEffects: "",
            },
        ]);
    };

    const removeItem = (index: number) => {
        const safeValue = Array.isArray(value) ? value : [];
        if (safeValue.length <= 1) return;
        const newItems = safeValue.filter((_, i) => i !== index);
        onChange(fieldKey, newItems);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-[#f1f5f9]">{title}</h3>
                    {instruction && (
                        <p className="text-sm text-[#94a3b8] mt-1">{instruction}</p>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                {(Array.isArray(value) ? value : []).map((item, index) => {
                    if (!item) return null; // Defensive check for null items

                    return (
                        <div
                            key={item.id || `${fieldKey}_${index}`} // Fallback key
                            className="p-4 bg-[#0f172a] border border-[#334155] rounded-lg space-y-3"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    {/* Main content */}
                                    <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(59,130,246,0.2)] text-[#3b82f6] text-sm font-medium flex items-center justify-center">
                                            {index + 1}
                                        </span>
                                        <Textarea
                                            value={String(item.content || "")}
                                            onChange={(e) => updateItem(index, "content", e.target.value)}
                                            placeholder={`Example ${index + 1}...`}
                                            className="min-h-[60px] flex-1"
                                            data-gramm="false"
                                            id={`${fieldKey}_${index}_content`}
                                        />
                                    </div>

                                    {/* Optional date field */}
                                    {hasDate && (
                                        <div className="ml-9">
                                            <Label
                                                htmlFor={`${fieldKey}_${index}_date`}
                                                className="text-xs text-[#94a3b8]"
                                            >
                                                {dateLabel}
                                            </Label>
                                            <Input
                                                id={`${fieldKey}_${index}_date`}
                                                type="text"
                                                value={String(item.date || "")}
                                                onChange={(e) => updateItem(index, "date", e.target.value)}
                                                placeholder="e.g., Summer 2019, March 2020..."
                                                className="mt-1"
                                                autoComplete="off"
                                                data-gramm="false"
                                            />
                                        </div>
                                    )}

                                    {/* Optional ripple effects field */}
                                    {hasRippleEffects && (
                                        <div className="ml-9">
                                            <Label
                                                htmlFor={`${fieldKey}_${index}_ripple`}
                                                className="text-xs text-[#94a3b8]"
                                            >
                                                {rippleEffectsLabel}
                                            </Label>
                                            <Textarea
                                                id={`${fieldKey}_${index}_ripple`}
                                                value={String(item.rippleEffects || "")}
                                                onChange={(e) => updateItem(index, "rippleEffects", e.target.value)}
                                                placeholder="What were the consequences? How did this affect others?"
                                                className="mt-1 min-h-[60px]"
                                                data-gramm="false"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Remove button */}
                                {value.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeItem(index)}
                                        className="text-[#94a3b8] hover:text-[#ef4444]"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Add more button */}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="w-full"
            >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Example
            </Button>
        </div>
    );
}
