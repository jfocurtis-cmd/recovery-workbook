"use client";

import React from "react";
import Link from "next/link";
import { Check, Lock, ChevronRight } from "lucide-react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { steps, getStepTitle } from "@/data/steps";
import { StepProgress } from "@/lib/firebase/firestore";

interface StepAccordionProps {
    progress: StepProgress[];
    currentStep: number;
    isSponsor: boolean;
}

export function StepAccordion({ progress, currentStep, isSponsor }: StepAccordionProps) {
    const getStepStatus = (stepNumber: number): "completed" | "current" | "locked" => {
        const stepProgress = progress.find((p) => p.stepNumber === stepNumber);

        if (stepProgress?.completionDate) {
            return "completed";
        }

        if (stepProgress?.assignmentDate || stepNumber === currentStep) {
            return "current";
        }

        return "locked";
    };

    const isStepAccessible = (stepNumber: number): boolean => {
        if (isSponsor) return true;

        const status = getStepStatus(stepNumber);
        return status === "completed" || status === "current";
    };

    const getProgressPercentage = (stepNumber: number): number => {
        const stepProgress = progress.find((p) => p.stepNumber === stepNumber);
        if (!stepProgress?.data) return 0;

        // Simple heuristic: count filled data fields
        const dataEntries = Object.values(stepProgress.data);
        const filledEntries = dataEntries.filter((v) =>
            v !== null && v !== undefined && v !== "" &&
            (typeof v !== "object" || Object.keys(v).length > 0)
        );

        return Math.min(100, Math.round((filledEntries.length / Math.max(dataEntries.length, 1)) * 100));
    };

    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold text-[#f1f5f9] mb-4">Your Steps</h2>

            <Accordion type="single" collapsible className="w-full">
                {steps.map((step) => {
                    const status = getStepStatus(step.number);
                    const accessible = isStepAccessible(step.number);
                    const progressPercent = getProgressPercentage(step.number);

                    return (
                        <AccordionItem key={step.number} value={`step-${step.number}`}>
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-4 text-left">
                                    {/* Status indicator */}
                                    <div
                                        className={`
                      flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold
                      ${(isSponsor || status === "completed")
                                                ? "bg-[rgba(34,197,94,0.2)] text-[#22c55e]"
                                                : status === "current"
                                                    ? "bg-[#3b82f6] text-white animate-pulse-glow"
                                                    : "bg-[#334155] text-[#94a3b8]"
                                            }
                    `}
                                    >
                                        {(isSponsor || status === "completed") ? (
                                            <Check className="h-4 w-4" />
                                        ) : status === "locked" ? (
                                            <Lock className="h-3 w-3" />
                                        ) : (
                                            step.number
                                        )}
                                    </div>

                                    {/* Step info */}
                                    <div>
                                        <p className="font-medium text-[#f1f5f9]">
                                            Step {step.number}: {step.title}
                                        </p>
                                        {status === "current" && progressPercent > 0 && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="h-1.5 w-24 bg-[#334155] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#3b82f6] rounded-full transition-all duration-500"
                                                        style={{ width: `${progressPercent}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-[#94a3b8]">{progressPercent}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </AccordionTrigger>

                            <AccordionContent>
                                <div className="pl-12 pr-4 pb-2">
                                    {/* Step quote */}
                                    <p className="text-sm text-[#94a3b8] italic border-l-2 border-[#3b82f6] pl-3 mb-4">
                                        "{step.quote}"
                                    </p>

                                    {accessible ? (
                                        <Link
                                            href={`/steps/${step.number}`}
                                            className="inline-flex items-center gap-2 text-[#3b82f6] hover:text-[#60a5fa] transition-colors text-sm font-medium"
                                        >
                                            {status === "completed" ? "Review Step" : "Continue Working"}
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    ) : (
                                        <p className="text-sm text-[#64748b]">
                                            Complete previous steps to unlock
                                        </p>
                                    )}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}
