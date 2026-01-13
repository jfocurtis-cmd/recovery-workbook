"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
    label: string;
    value: string | undefined;
    onChange: (date: string | undefined) => void;
}

// Simple popover wrapper
import * as PopoverPrimitive from "@radix-ui/react-popover";

const PopoverWrapper = PopoverPrimitive.Root;
const PopoverTriggerWrapper = PopoverPrimitive.Trigger;
const PopoverContentWrapper = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
    <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
            ref={ref}
            align={align}
            sideOffset={sideOffset}
            className={cn(
                "z-50 w-auto rounded-md border border-[#334155] bg-[#1e293b] p-0 shadow-md outline-none",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                className
            )}
            {...props}
        />
    </PopoverPrimitive.Portal>
));
PopoverContentWrapper.displayName = PopoverPrimitive.Content.displayName;

export function DatePicker({ label, value, onChange }: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const selectedDate = value ? new Date(value) : undefined;

    const handleSelect = (date: Date | undefined) => {
        onChange(date?.toISOString());
        setOpen(false);
    };

    return (
        <div className="flex flex-col gap-2">
            <Label className="text-[#f1f5f9]">{label}</Label>
            <PopoverWrapper open={open} onOpenChange={setOpen}>
                <PopoverTriggerWrapper asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !value && "text-[#94a3b8]"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                    </Button>
                </PopoverTriggerWrapper>
                <PopoverContentWrapper className="w-auto p-0" align="start">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        className="p-3"
                        classNames={{
                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center",
                            caption_label: "text-sm font-medium text-[#f1f5f9]",
                            nav: "space-x-1 flex items-center",
                            nav_button: cn(
                                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                                "text-[#f1f5f9] hover:bg-[#334155] rounded-md"
                            ),
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-[#94a3b8] rounded-md w-9 font-normal text-[0.8rem]",
                            row: "flex w-full mt-2",
                            cell: "text-center text-sm p-0 relative",
                            day: cn(
                                "h-9 w-9 p-0 font-normal text-[#f1f5f9]",
                                "hover:bg-[#334155] rounded-md transition-colors",
                                "aria-selected:opacity-100"
                            ),
                            day_selected: "bg-[#3b82f6] text-white hover:bg-[#2563eb]",
                            day_today: "bg-[#334155] text-[#f1f5f9]",
                            day_outside: "text-[#64748b] opacity-50",
                            day_disabled: "text-[#64748b] opacity-50",
                            day_hidden: "invisible",
                        }}
                    />
                </PopoverContentWrapper>
            </PopoverWrapper>
        </div>
    );
}
