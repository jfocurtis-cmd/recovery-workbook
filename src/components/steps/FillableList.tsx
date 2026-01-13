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
}: FillableListProps) {
    const [items, setItems] = useState<ListItem[]>(value);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize with empty items if needed
    useEffect(() => {
        if (value.length === 0) {
            const initialItems = Array.from({ length: count }, (_, i) => ({
                id: `${fieldKey}_${i + 1}`,
                content: "",
                date: "",
                rippleEffects: "",
            }));
            setItems(initialItems);
        } else {
            setItems(value);
        }
    }, [value, count, fieldKey]);

    // Debounced save
    useEffect(() => {
        if (JSON.stringify(items) === JSON.stringify(value)) return;

        const timer = setTimeout(() => {
            setIsSaving(true);
            onChange(fieldKey, items);
            setTimeout(() => setIsSaving(false), 500);
        }, 500);

        return () => clearTimeout(timer);
    }, [items, fieldKey, onChange, value]);

    const updateItem = (index: number, field: keyof ListItem, newValue: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: newValue };
        setItems(newItems);
    };

    const addItem = () => {
        setItems([
            ...items,
            {
                id: `${fieldKey}_${items.length + 1}`,
                content: "",
                date: "",
                rippleEffects: "",
            },
        ]);
    };

    const removeItem = (index: number) => {
        if (items.length <= 1) return;
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
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
                {isSaving && (
                    <span className="text-xs text-[#3b82f6] animate-pulse">Saving...</span>
                )}
            </div>

            <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                        key={item.id}
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
                                        value={item.content}
                                        onChange={(e) => updateItem(index, "content", e.target.value)}
                                        placeholder={`Example ${index + 1}...`}
                                        className="min-h-[60px] flex-1"
                                    />
                                </div>

                                {/* Optional date field */}
                                {hasDate && (
                                    <div className="ml-9">
                                        <Label className="text-xs text-[#94a3b8]">Date (if known)</Label>
                                        <Input
                                            type="text"
                                            value={item.date || ""}
                                            onChange={(e) => updateItem(index, "date", e.target.value)}
                                            placeholder="e.g., Summer 2019, March 2020..."
                                            className="mt-1"
                                        />
                                    </div>
                                )}

                                {/* Optional ripple effects field */}
                                {hasRippleEffects && (
                                    <div className="ml-9">
                                        <Label className="text-xs text-[#94a3b8]">Ripple Effects</Label>
                                        <Textarea
                                            value={item.rippleEffects || ""}
                                            onChange={(e) => updateItem(index, "rippleEffects", e.target.value)}
                                            placeholder="What were the consequences? How did this affect others?"
                                            className="mt-1 min-h-[60px]"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Remove button */}
                            {items.length > 1 && (
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
                ))}
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
