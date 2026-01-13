import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[100px] w-full rounded-md border border-[#334155] bg-[#0f172a] px-3 py-2 text-sm text-[#f1f5f9] placeholder:text-[#94a3b8] transition-all duration-200 resize-y",
                    "focus:outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[rgba(59,130,246,0.1)]",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Textarea.displayName = "Textarea";

export { Textarea };
