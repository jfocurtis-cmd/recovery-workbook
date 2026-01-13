"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FillableDefinitionProps {
    fieldKey: string;
    prompt: string;
    value: string;
    onChange: (key: string, value: string) => void;
}

export function FillableDefinition({
    fieldKey,
    prompt,
    value,
    onChange,
}: FillableDefinitionProps) {
    const [localValue, setLocalValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);

    // Sync local value with prop
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Debounced save
    useEffect(() => {
        if (localValue === value) return;

        const timer = setTimeout(() => {
            setIsSaving(true);
            onChange(fieldKey, localValue);
            setTimeout(() => setIsSaving(false), 500);
        }, 500);

        return () => clearTimeout(timer);
    }, [localValue, fieldKey, onChange, value]);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor={fieldKey} className="text-[#f1f5f9] font-medium">
                    {prompt}
                </Label>
                {isSaving && (
                    <span className="text-xs text-[#3b82f6] animate-pulse">Saving...</span>
                )}
            </div>
            <Textarea
                id={fieldKey}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                placeholder={`Enter your definition for ${prompt.replace("Define: ", "").toLowerCase()}...`}
                className="min-h-[80px]"
            />
        </div>
    );
}
