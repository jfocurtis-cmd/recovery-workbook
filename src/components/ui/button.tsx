import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-[#3b82f6] text-white hover:bg-[#2563eb] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] active:translate-y-0",
                destructive:
                    "bg-[#ef4444] text-white hover:bg-[#dc2626] hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]",
                outline:
                    "border border-[#334155] bg-transparent text-[#f1f5f9] hover:bg-[#1e293b] hover:border-[rgba(59,130,246,0.3)]",
                secondary:
                    "bg-[#1e293b] text-[#f1f5f9] hover:bg-[#334155]",
                ghost:
                    "text-[#f1f5f9] hover:bg-[#1e293b] hover:text-[#f1f5f9]",
                link:
                    "text-[#3b82f6] underline-offset-4 hover:underline",
                success:
                    "bg-[#22c55e] text-white hover:bg-[#16a34a] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
