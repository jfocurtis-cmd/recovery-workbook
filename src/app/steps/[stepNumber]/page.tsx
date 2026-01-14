"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { StepHeader } from "@/components/steps/StepHeader";
import { DatePicker } from "@/components/steps/DatePicker";
import { FillableDefinition } from "@/components/steps/FillableDefinition";
import { FillableList } from "@/components/steps/FillableList";
import { FillableChecklist } from "@/components/steps/FillableChecklist";
import { SectionCompletionCheckbox } from "@/components/steps/SectionCompletionCheckbox";
import { StepPasswordGate } from "@/components/steps/StepPasswordGate";
import { ResentmentInventory } from "@/components/steps/step4/ResentmentInventory";
import { StepExport } from "@/components/steps/StepExport";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    getStepProgress,
    saveStepProgress,
    updateStepData,
    completeStep,
    StepProgress,
} from "@/lib/firebase/firestore";
import { getStepByNumber, thirdStepPrayer, seventhStepPrayer, StepSection, SectionItem, Step, StepPart } from "@/data/steps";
import { ArrowLeft, ArrowRight, Check, BookOpen, Sparkles, AlertCircle, HeartHandshake } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";
import { StepNavigationHeader } from "@/components/steps/StepNavigationHeader";

export default function StepPage() {
    const params = useParams();
    const stepNumber = parseInt(params.stepNumber as string, 10);
    const router = useRouter();
    const { user, profile, loading, isSponsor } = useAuth();

    const [stepProgress, setStepProgress] = useState<StepProgress | null>(null);
    const [stepData, setStepData] = useState<Record<string, unknown>>({});
    const [assignmentDate, setAssignmentDate] = useState<string | undefined>();
    const [completionDate, setCompletionDate] = useState<string | undefined>();
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [hasExported, setHasExported] = useState(false);

    const step = getStepByNumber(stepNumber);

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Load step progress
    useEffect(() => {
        if (!user || !step) return;

        const loadProgress = async () => {
            setIsLoadingData(true);
            try {
                const progress = await getStepProgress(user.uid, stepNumber);
                if (progress) {
                    setStepProgress(progress);
                    setStepData(progress.data || {});
                    setAssignmentDate(progress.assignmentDate);
                    setCompletionDate(progress.completionDate);
                    // Check if step is already unlocked
                    if (progress.data?.stepUnlocked) {
                        setIsUnlocked(true);
                    }
                    // Check if step has been exported
                    if (progress.data?.hasExported) {
                        setHasExported(true);
                    }
                }
            } catch (err) {
                console.error("Error loading progress:", err);
            } finally {
                setIsLoadingData(false);
            }
        };

        loadProgress();
    }, [user, stepNumber, step]);

    // Handle field change with debounced save
    const handleFieldChange = useCallback(
        async (fieldKey: string, value: unknown) => {
            setStepData((prev) => ({ ...prev, [fieldKey]: value }));

            if (user) {
                try {
                    await updateStepData(user.uid, stepNumber, fieldKey, value);
                } catch (err) {
                    console.error("Error saving:", err);
                }
            }
        },
        [user, stepNumber]
    );

    // Handle assignment date change
    const handleAssignmentDateChange = async (date: string | undefined) => {
        setAssignmentDate(date);
        if (user && date) {
            try {
                await saveStepProgress(user.uid, stepNumber, { assignmentDate: date });
            } catch (err) {
                console.error("Error saving assignment date:", err);
            }
        }
    };

    // Handle step unlock
    const handleUnlock = async () => {
        setIsUnlocked(true);
        // Save unlock status
        if (user) {
            try {
                await updateStepData(user.uid, stepNumber, "stepUnlocked", true);
            } catch (err) {
                console.error("Error saving unlock status:", err);
            }
        }
    };


    // Handle PDF export completion
    const handleExportComplete = async () => {
        setHasExported(true);
        if (user) {
            try {
                await updateStepData(user.uid, stepNumber, "hasExported", true);
            } catch (err) {
                console.error("Error saving export status:", err);
            }
        }
    };

    // Validate if all required work is complete
    const validateStepCompletion = useMemo(() => {
        if (!step) return { isComplete: false, missingItems: [] as string[] };

        const missingItems: string[] = [];

        // Check if PDF has been exported
        if (!hasExported) {
            missingItems.push("Export step to PDF");
        }

        // Get all sections from the step (either from parts or directly)
        const allSections: { section: StepSection; partNumber?: number }[] = [];

        if (step.parts) {
            step.parts.forEach((part) => {
                part.sections.forEach((section) => {
                    allSections.push({ section, partNumber: part.partNumber });
                });
            });
        } else if (step.sections) {
            step.sections.forEach((section) => {
                allSections.push({ section });
            });
        }

        // Check each section
        allSections.forEach(({ section, partNumber }) => {
            const sectionKey = `${section.type}_${section.title}${partNumber ? `_part${partNumber}` : ""}`;

            switch (section.type) {
                case "definitions":
                    // All definitions must have text
                    section.items.forEach((item) => {
                        const value = stepData[item.key] as string;
                        if (!value || value.trim() === "") {
                            missingItems.push(`${section.title}: ${item.prompt || item.key}`);
                        }
                    });
                    break;

                case "reading":
                    // Reading checklist items should be checked
                    const readingChecklist = stepData[`${sectionKey}_checklist`] as Record<string, boolean> || {};
                    const allReadingChecked = section.items.every((item) => readingChecklist[item.key]);
                    if (!allReadingChecked) {
                        missingItems.push(`${section.title}: Check all reading items`);
                    }
                    // Section completion checkbox
                    const readingCompleted = stepData[`${sectionKey}_completed`] as boolean;
                    if (!readingCompleted) {
                        missingItems.push(`${section.title}: Confirm reading completion`);
                    }
                    break;

                case "writing":
                    // All writing items must have content
                    section.items.forEach((item) => {
                        if (item.count) {
                            // List-based writing - check if array has items with content
                            const listValue = stepData[item.key] as any[] || [];
                            const hasContent = listValue.some((entry) =>
                                entry && entry.content && entry.content.trim() !== ""
                            );
                            if (!hasContent) {
                                missingItems.push(`${section.title}: ${item.prompt || item.key}`);
                            }
                        } else {
                            // Text-based writing
                            const value = stepData[item.key] as string;
                            if (!value || value.trim() === "") {
                                missingItems.push(`${section.title}: ${item.prompt || item.key}`);
                            }
                        }
                    });
                    break;

                case "list":
                    // List items with prompts need text, items with count need at least one entry
                    section.items.forEach((item) => {
                        if (item.prompt) {
                            const value = stepData[item.key] as string;
                            if (!value || value.trim() === "") {
                                missingItems.push(`${section.title}: ${item.prompt}`);
                            }
                        } else if (item.count) {
                            const listValue = stepData[item.key] as any[] || [];
                            const hasContent = listValue.some((entry) =>
                                entry && entry.content && entry.content.trim() !== ""
                            );
                            if (!hasContent) {
                                missingItems.push(`${section.title}: Fill in list items`);
                            }
                        }
                    });
                    break;

                case "todo":
                case "checklist":
                    // All checklist items must be checked
                    const todoChecklist = stepData[`${sectionKey}_checklist`] as Record<string, boolean> || {};
                    const allTodoChecked = section.items.every((item) => todoChecklist[item.key]);
                    if (!allTodoChecked) {
                        missingItems.push(`${section.title}: Complete all items`);
                    }
                    break;

                case "prayer":
                    // Prayer completion checkbox must be checked
                    const prayerCompleted = stepData[`${sectionKey}_completed`] as boolean;
                    if (!prayerCompleted) {
                        missingItems.push(`${section.title}: Confirm prayer completion`);
                    }
                    // Also check prayer checklist items if any
                    if (section.items.length > 0) {
                        const prayerChecklist = stepData[`${sectionKey}_checklist`] as Record<string, boolean> || {};
                        const allPrayerChecked = section.items.every((item) => prayerChecklist[item.key]);
                        if (!allPrayerChecked) {
                            missingItems.push(`${section.title}: Complete all prayer items`);
                        }
                    }
                    break;

                case "resentment":
                    // At least one resentment entry with required fields
                    const resentments = stepData.resentments as any[] || [];
                    if (resentments.length === 0) {
                        missingItems.push(`${section.title}: Add at least one resentment entry`);
                    } else {
                        const hasCompleteEntry = resentments.some((entry) =>
                            entry.resentfulAt && entry.resentfulAt.trim() !== "" &&
                            entry.theCause && entry.theCause.trim() !== ""
                        );
                        if (!hasCompleteEntry) {
                            missingItems.push(`${section.title}: Complete at least one entry (Resentful At + Cause)`);
                        }
                    }
                    break;
            }
        });

        return {
            isComplete: missingItems.length === 0,
            missingItems,
        };
    }, [step, stepData]);

    // Mark step as complete
    const handleComplete = async () => {
        if (!user || !validateStepCompletion.isComplete) return;
        try {
            await completeStep(user.uid, stepNumber);
            router.push("/dashboard");
        } catch (err) {
            console.error("Error completing step:", err);
        }
    };

    if (loading || isLoadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-[#3b82f6]">Loading step...</div>
            </div>
        );
    }

    if (!step) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#f1f5f9] mb-4">Step Not Found</h1>
                    <Link href="/dashboard">
                        <Button>Return to Dashboard</Button>
                    </Link>
                </div>
            </div>
        );
    }

    // Password gate for sponsees (sponsors bypass this)
    // Password gate for sponsees (sponsors bypass this)
    if (!isSponsor && !isUnlocked) {
        return (
            <main className="min-h-screen relative z-10">
                <StepNavigationHeader stepNumber={stepNumber} />
                <StepPasswordGate
                    stepNumber={stepNumber}
                    stepTitle={step.title}
                    onUnlock={handleUnlock}
                />

                {/* Manual Role Switch for stuck users */}
                <div className="fixed bottom-8 left-0 right-0 flex justify-center z-50">
                    <button
                        onClick={async () => {
                            const code = prompt("Enter Sponsor Access Code:");
                            if (code?.toLowerCase() === "freelygiven") {
                                if (user) {
                                    try {
                                        // Dynamic import to avoid circular dependency issues if any
                                        const { updateUserRole } = await import("@/lib/firebase/auth");
                                        await updateUserRole(user.uid, "sponsor");
                                        alert("Role updated to Sponsor! Reloading...");
                                        window.location.reload();
                                    } catch (e) {
                                        alert("Error updating role: " + e);
                                    }
                                }
                            } else if (code) {
                                alert("Incorrect code.");
                            }
                        }}
                        className="text-sm text-blue-400 hover:text-blue-300 underline font-medium cursor-pointer"
                    >
                        I am a Sponsor (Fix Permissions)
                    </button>
                </div>
            </main>
        );
    }

    // Render a section based on its type
    const renderSection = (section: StepSection, partNumber?: number) => {
        const sectionKey = `${section.type}_${section.title}${partNumber ? `_part${partNumber}` : ""}`;

        switch (section.type) {
            case "definitions":
                return (
                    <div className="space-y-4">
                        {section.items.map((item) => (
                            <FillableDefinition
                                key={item.key}
                                fieldKey={item.key}
                                prompt={item.prompt || ""}
                                value={(stepData[item.key] as string) || ""}
                                onChange={handleFieldChange}
                            />
                        ))}
                    </div>
                );

            case "reading":
                const readingCompletedKey = `${sectionKey}_completed`;
                return (
                    <div className="space-y-4">
                        {section.instruction && (
                            <p className="text-[#94a3b8] text-sm mb-4">{section.instruction}</p>
                        )}
                        <FillableChecklist
                            fieldKey={`${sectionKey}_checklist`}
                            title=""
                            items={section.items.map((item) => ({
                                key: item.key,
                                text: item.text || item.prompt || "",
                            }))}
                            value={(stepData[`${sectionKey}_checklist`] as Record<string, boolean>) || {}}
                            onChange={handleFieldChange}
                        />
                        {/* Completion checkbox for reading sections */}
                        <SectionCompletionCheckbox
                            fieldKey={readingCompletedKey}
                            label="I have completed this reading assignment"
                            checked={(stepData[readingCompletedKey] as boolean) || false}
                            onChange={(key, val) => handleFieldChange(key, val)}
                        />
                    </div>
                );

            case "writing":
                return (
                    <div className="space-y-6">
                        {section.items.map((item) => (
                            <div key={item.key} className="space-y-2">
                                <h4 className="font-medium text-[#f1f5f9]">{item.prompt}</h4>
                                {item.subItems && (
                                    <ul className="list-disc list-inside text-sm text-[#94a3b8] mb-2">
                                        {item.subItems.map((sub, i) => (
                                            <li key={i}>{sub}</li>
                                        ))}
                                    </ul>
                                )}
                                {item.count ? (
                                    <FillableList
                                        fieldKey={item.key}
                                        title=""
                                        count={item.count}
                                        value={(stepData[item.key] as any[]) || []}
                                        onChange={handleFieldChange}
                                    />
                                ) : (
                                    <Textarea
                                        value={(stepData[item.key] as string) || ""}
                                        onChange={(e) => handleFieldChange(item.key, e.target.value)}
                                        placeholder="Write your response..."
                                        className="min-h-[120px]"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                );

            case "list":
                return (
                    <div className="space-y-6">
                        {section.instruction && (
                            <p className="text-[#94a3b8] text-sm">{section.instruction}</p>
                        )}
                        {section.items.map((item) => (
                            <div key={item.key}>
                                {item.text && <p className="text-sm text-[#94a3b8] mb-2">{item.text}</p>}
                                {item.prompt ? (
                                    <Textarea
                                        value={(stepData[item.key] as string) || ""}
                                        onChange={(e) => handleFieldChange(item.key, e.target.value)}
                                        placeholder={item.prompt}
                                        className="min-h-[100px]"
                                    />
                                ) : item.count ? (
                                    <FillableList
                                        fieldKey={item.key}
                                        title=""
                                        count={item.count}
                                        hasDate={item.hasDate}
                                        hasRippleEffects={item.hasRippleEffects}
                                        dateLabel={item.dateLabel}
                                        rippleEffectsLabel={item.rippleEffectsLabel}
                                        value={(stepData[item.key] as any[]) || []}
                                        onChange={handleFieldChange}
                                    />
                                ) : null}
                            </div>
                        ))}
                    </div>
                );

            case "todo":
            case "checklist":
                return (
                    <div className="space-y-4">
                        {section.instruction && (
                            <p className="text-[#94a3b8] text-sm mb-4">{section.instruction}</p>
                        )}
                        <FillableChecklist
                            fieldKey={`${sectionKey}_checklist`}
                            title=""
                            items={section.items.map((item) => ({
                                key: item.key,
                                text: item.text || item.prompt || "",
                            }))}
                            value={(stepData[`${sectionKey}_checklist`] as Record<string, boolean>) || {}}
                            onChange={handleFieldChange}
                        />
                    </div>
                );

            case "prayer":
                const prayerText = stepNumber === 3 ? thirdStepPrayer : stepNumber === 7 ? seventhStepPrayer : null;
                const prayerCompletedKey = `${sectionKey}_completed`;
                return (
                    <div className="space-y-4">
                        {section.instruction && (
                            <p className="text-[#94a3b8] text-sm mb-4">{section.instruction}</p>
                        )}
                        {prayerText && (
                            <blockquote className="quote-style bg-[#0f172a] p-4 rounded-lg">
                                {prayerText}
                            </blockquote>
                        )}
                        {section.items.length > 0 && (
                            <FillableChecklist
                                fieldKey={`${sectionKey}_checklist`}
                                title=""
                                items={section.items.map((item) => ({
                                    key: item.key,
                                    text: item.text || "",
                                }))}
                                value={(stepData[`${sectionKey}_checklist`] as Record<string, boolean>) || {}}
                                onChange={handleFieldChange}
                            />
                        )}
                        {/* Completion checkbox for prayer sections */}
                        <SectionCompletionCheckbox
                            fieldKey={prayerCompletedKey}
                            label="I have completed this prayer"
                            checked={(stepData[prayerCompletedKey] as boolean) || false}
                            onChange={(key, val) => handleFieldChange(key, val)}
                        />
                    </div>
                );

            case "resentment":
                return (
                    <ResentmentInventory
                        value={(stepData.resentments as any[]) || []}
                        onChange={(entries) => handleFieldChange("resentments", entries)}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen relative z-10 pb-24">
            {/* Navigation header */}
            {/* Navigation header */}
            <StepNavigationHeader stepNumber={stepNumber} />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Step header */}
                <StepHeader
                    stepNumber={step.number}
                    title={step.title}
                    quote={step.quote}
                />

                {/* Dates card */}
                <Card className="mb-8">
                    <CardContent className="py-6">
                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* Assignment date */}
                            <div className="flex-1">
                                <DatePicker
                                    label="Assignment Date"
                                    value={assignmentDate}
                                    onChange={handleAssignmentDateChange}
                                />
                            </div>

                            {/* Completion date - shown only if completed */}
                            {completionDate && (
                                <div className="flex-1">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm font-medium text-[#f1f5f9]">Completion Date</span>
                                        <div className="flex items-center gap-2 p-3 bg-[rgba(34,197,94,0.1)] border border-[#22c55e] rounded-lg">
                                            <Check className="h-5 w-5 text-[#22c55e]" />
                                            <span className="text-[#22c55e] font-medium">
                                                {format(new Date(completionDate), "PPP")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Step content */}
                {step.parts ? (
                    // Steps with parts
                    <Accordion type="multiple" defaultValue={step.parts.map((p) => `part-${p.partNumber}`)}>
                        {step.parts.map((part) => (
                            <AccordionItem key={part.partNumber} value={`part-${part.partNumber}`}>
                                <Card className="mb-4">
                                    <AccordionTrigger className="px-6">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[rgba(59,130,246,0.2)] text-[#3b82f6] text-sm font-medium">
                                                {part.partNumber}
                                            </span>
                                            <span className="font-semibold text-[#f1f5f9]">
                                                Part {part.partNumber}
                                                {part.title ? `: ${part.title}` : ""}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <CardContent className="pt-0 space-y-8">
                                            {part.sections.map((section, idx) => (
                                                <div key={idx}>
                                                    <h3 className="text-lg font-semibold text-[#f1f5f9] mb-4 flex items-center gap-2">
                                                        <BookOpen className="h-5 w-5 text-[#3b82f6]" />
                                                        {section.title}
                                                    </h3>
                                                    {renderSection(section, part.partNumber)}
                                                </div>
                                            ))}
                                        </CardContent>
                                    </AccordionContent>
                                </Card>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    // Steps without parts
                    <div className="space-y-6">
                        {step.sections?.map((section, idx) => (
                            <Card key={idx}>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <BookOpen className="h-5 w-5 text-[#3b82f6]" />
                                        {section.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>{renderSection(section)}</CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Export & Complete step section */}
                <div className="mt-8 space-y-4">
                    {/* Export Button */}
                    <StepExport
                        step={step}
                        stepData={stepData}
                        assignmentDate={assignmentDate}
                        completionDate={completionDate}
                        onExportComplete={handleExportComplete}
                    />

                    {/* Show missing items if not complete */}
                    {!validateStepCompletion.isComplete && (
                        <Card className="border-amber-500/30 bg-amber-500/5">
                            <CardContent className="py-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-medium text-amber-500 mb-2">
                                            Complete the following before marking this step done:
                                        </h4>
                                        <ul className="text-sm text-amber-200/80 space-y-1">
                                            {validateStepCompletion.missingItems.slice(0, 5).map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-amber-500">•</span>
                                                    {item}
                                                </li>
                                            ))}
                                            {validateStepCompletion.missingItems.length > 5 && (
                                                <li className="text-amber-400 italic">
                                                    ...and {validateStepCompletion.missingItems.length - 5} more items
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Complete button */}
                    <div className="flex justify-center">
                        <Button
                            size="lg"
                            variant={validateStepCompletion.isComplete ? "success" : "outline"}
                            onClick={handleComplete}
                            disabled={!validateStepCompletion.isComplete}
                            className={`gap-2 w-full sm:w-auto ${!validateStepCompletion.isComplete ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            <Check className="h-5 w-5" />
                            {validateStepCompletion.isComplete
                                ? `Mark Step ${stepNumber} Complete`
                                : `Complete All Work First (${validateStepCompletion.missingItems.length} remaining)`
                            }
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}
