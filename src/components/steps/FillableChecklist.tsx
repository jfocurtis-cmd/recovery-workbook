"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface ChecklistItem {
    key: string;
    text: string;
    checked: boolean;
}

interface FillableChecklistProps {
    fieldKey: string;
    title: string;
    instruction?: string;
    items: { key: string; text: string }[];
    value: Record<string, boolean>;
    onChange: (key: string, value: Record<string, boolean>) => void;
}

export function FillableChecklist({
    fieldKey,
    title,
    instruction,
    items,
    value,
    onChange,
}: FillableChecklistProps) {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(value);
    const [isSaving, setIsSaving] = useState(false);

    // Sync with prop
    useEffect(() => {
        setCheckedItems(value);
    }, [value]);

    // Debounced save
    useEffect(() => {
        if (JSON.stringify(checkedItems) === JSON.stringify(value)) return;

        const timer = setTimeout(() => {
            setIsSaving(true);
            onChange(fieldKey, checkedItems);
            setTimeout(() => setIsSaving(false), 500);
        }, 500);

        return () => clearTimeout(timer);
    }, [checkedItems, fieldKey, onChange, value]);

    const toggleItem = (itemKey: string) => {
        setCheckedItems((prev) => ({
            ...prev,
            [itemKey]: !prev[itemKey],
        }));
    };

    const completedCount = Object.values(checkedItems).filter(Boolean).length;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-[#f1f5f9]">{title}</h3>
                    {instruction && (
                        <p className="text-sm text-[#94a3b8] mt-1">{instruction}</p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {isSaving && (
                        <span className="text-xs text-[#3b82f6] animate-pulse">Saving...</span>
                    )}
                    <span className="text-sm text-[#94a3b8]">
                        {completedCount}/{items.length}
                    </span>
                </div>
            </div>

            <div className="space-y-3">

                {items.map((item) => (
                    <div
                        key={item.key}
                        className={`
              flex items-start gap-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
              ${checkedItems[item.key]
                                ? "bg-[rgba(34,197,94,0.1)] border-[#22c55e]"
                                : "bg-[#0f172a] border-[#334155] hover:border-[rgba(59,130,246,0.3)]"
                            }
            `}
                        onClick={() => toggleItem(item.key)}
                    >
                        <Checkbox
                            id={item.key}
                            checked={checkedItems[item.key] || false}
                            onCheckedChange={() => toggleItem(item.key)}
                            className={checkedItems[item.key] ? "border-[#22c55e] data-[state=checked]:bg-[#22c55e] mt-0.5" : "mt-0.5"}
                        />
                        <Label
                            htmlFor={item.key}
                            className={`
                cursor-pointer flex-1 font-medium transition-colors
                ${checkedItems[item.key] ? "text-[#22c55e]" : "text-[#f1f5f9]"}
              `}
                        >
                            {checkedItems[item.key] && <Check className="inline h-4 w-4 mr-2" />}
                            {item.text}
                        </Label>
                    </div>
                ))}
            </div>

            {/* Progress bar */}
            {items.length > 1 && (
                <div className="mt-4">
                    <div className="h-2 bg-[#334155] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#22c55e] rounded-full transition-all duration-500"
                            style={{ width: `${(completedCount / items.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
