"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface SectionCompletionCheckboxProps {
    fieldKey: string;
    label: string;
    checked: boolean;
    onChange: (key: string, checked: boolean) => void;
}

export function SectionCompletionCheckbox({
    fieldKey,
    label,
    checked,
    onChange,
}: SectionCompletionCheckboxProps) {
    return (
        <div
            className={`
        flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer mt-4
        ${checked
                    ? "bg-[rgba(34,197,94,0.1)] border-[#22c55e]"
                    : "bg-[#0f172a] border-[#334155] hover:border-[rgba(59,130,246,0.3)]"
                }
      `}
            onClick={() => onChange(fieldKey, !checked)}
        >
            <Checkbox
                id={fieldKey}
                checked={checked}
                onCheckedChange={(val) => onChange(fieldKey, val as boolean)}
                className={checked ? "border-[#22c55e] data-[state=checked]:bg-[#22c55e]" : ""}
            />
            <Label
                htmlFor={fieldKey}
                className={`
          cursor-pointer flex-1 font-medium transition-colors
          ${checked ? "text-[#22c55e]" : "text-[#f1f5f9]"}
        `}
            >
                {checked && <Check className="inline h-4 w-4 mr-2" />}
                {label}
            </Label>
        </div>
    );
}
