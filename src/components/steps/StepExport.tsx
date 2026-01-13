"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Printer } from "lucide-react";
import { Step, StepSection } from "@/data/steps";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";

interface StepExportProps {
    step: Step;
    stepData: Record<string, unknown>;
    assignmentDate?: string;
    completionDate?: string;
    onExportComplete: () => void;
}

export function StepExport({ step, stepData, assignmentDate, completionDate, onExportComplete }: StepExportProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Step ${step.number} - ${step.title} - Recovery Workbook`,
        onAfterPrint: () => {
            onExportComplete();
        },
    });

    const renderSectionContent = (section: StepSection, partNumber?: number) => {
        const sectionKey = `${section.type}_${section.title}${partNumber ? `_part${partNumber}` : ""}`;

        switch (section.type) {
            case "definitions":
                return (
                    <div className="grid grid-cols-1 gap-4">
                        {section.items.map((item) => (
                            <div key={item.key} className="border-b border-gray-200 pb-2 mb-2 break-inside-avoid">
                                <span className="font-semibold text-gray-700 block mb-1">{item.prompt || item.key}:</span>
                                <div className="text-gray-900 whitespace-pre-wrap">
                                    {(stepData[item.key] as string) || "_________________________________"}
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case "writing":
                return (
                    <div className="space-y-6">
                        {section.items.map((item) => {
                            if (item.count) {
                                // List based writing
                                const listValue = (stepData[item.key] as any[]) || [];
                                return (
                                    <div key={item.key} className="break-inside-avoid">
                                        <h4 className="font-semibold text-gray-700 mb-2">{item.prompt}:</h4>
                                        <ol className="list-decimal pl-5 space-y-2">
                                            {Array.from({ length: item.count }).map((_, idx) => (
                                                <li key={idx} className="text-gray-900 border-b border-gray-100 pb-1">
                                                    {listValue[idx]?.content || "_________________________________"}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                );
                            }
                            return (
                                <div key={item.key} className="break-inside-avoid">
                                    <h4 className="font-semibold text-gray-700 mb-2">{item.prompt}:</h4>
                                    <div className="text-gray-900 p-3 bg-gray-50 border border-gray-200 rounded-md min-h-[100px] whitespace-pre-wrap">
                                        {(stepData[item.key] as string) || ""}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );

            case "list":
                return (
                    <div className="space-y-4">
                        {section.items.map((item) => {
                            if (item.count) {
                                // List based
                                const listValue = (stepData[item.key] as any[]) || [];
                                return (
                                    <div key={item.key} className="break-inside-avoid">
                                        <h4 className="font-semibold text-gray-700 mb-2">{item.prompt || item.key}:</h4>
                                        <ol className="list-decimal pl-5 space-y-2">
                                            {Array.from({ length: item.count }).map((_, idx) => (
                                                <li key={idx} className="text-gray-900 border-b border-gray-100 pb-1">
                                                    {listValue[idx]?.content || "_________________________________"}
                                                    {item.hasDate && (
                                                        <span className="float-right text-gray-500 text-sm">
                                                            Date: {listValue[idx]?.date ? format(new Date(listValue[idx].date), "MM/dd/yyyy") : "___/___/___"}
                                                        </span>
                                                    )}
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                );
                            }
                            // Text based list item
                            return (
                                <div key={item.key} className="break-inside-avoid border-b border-gray-200 pb-2">
                                    <span className="font-semibold text-gray-700 block mb-1">{item.prompt}:</span>
                                    <div className="text-gray-900">
                                        {(stepData[item.key] as string) || "_________________________________"}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );

            case "resentment":
                const resentments = (stepData.resentments as any[]) || [];
                return (
                    <div className="break-inside-avoid">
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-1 text-left">Resentment</th>
                                    <th className="border p-1 text-left">Cause</th>
                                    <th className="border p-1 text-left">Affects</th>
                                    <th className="border p-1 text-left">My Part</th>
                                    <th className="border p-1 text-left">Fear</th>
                                    <th className="border p-1 text-left">Sex/Harm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resentments.length === 0 ? (
                                    <tr><td colSpan={6} className="border p-4 text-center text-gray-400">No entries recorded</td></tr>
                                ) : (
                                    resentments.map((entry, idx) => (
                                        <tr key={idx}>
                                            <td className="border p-1 align-top">{entry.resentfulAt}</td>
                                            <td className="border p-1 align-top">{entry.theCause}</td>
                                            <td className="border p-1 align-top">{Object.entries(entry.affectsMy || {}).filter(([_, v]) => v).map(([k]) => k).join(", ")}</td>
                                            <td className="border p-1 align-top">{Object.entries(entry.myPart || {}).filter(([_, v]) => v).map(([k]) => k).join(", ")}</td>
                                            <td className="border p-1 align-top">{entry.fears?.join(", ")}</td>
                                            <td className="border p-1 align-top">{Object.entries(entry.sexConduct || {}).filter(([_, v]) => v).map(([k]) => k).join(", ")}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                );

            case "prayer":
            case "reading":
            case "todo":
                return (
                    <div className="space-y-2 break-inside-avoid">
                        <p className="text-gray-600 italics">{section.instruction}</p>
                        <div className="flex items-center gap-2 text-sm">
                            <div className={`h-4 w-4 border border-gray-400 flex items-center justify-center ${stepData[`${sectionKey}_completed`] ? "bg-gray-800 text-white" : ""}`}>
                                {(stepData[`${sectionKey}_completed`] as boolean) && "✓"}
                            </div>
                            <span>Section Completed</span>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            <Button
                onClick={handlePrint}
                variant="outline"
                className="w-full gap-2 border-amber-500/50 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400"
            >
                <Printer className="h-4 w-4" />
                Export Step to PDF (Required)
            </Button>

            {/* Hidden Printable Content */}
            <div className="hidden">
                <div ref={printRef} className="p-8 bg-white text-black max-w-[210mm] mx-auto min-h-screen">
                    {/* Header */}
                    <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
                        <h1 className="text-3xl font-bold mb-2">12-Step Recovery Workbook</h1>
                        <h2 className="text-2xl text-gray-600">Step {step.number}: {step.title}</h2>
                        <div className="flex justify-between mt-4 text-sm text-gray-500 uppercase tracking-widest">
                            <span>Assignment: {assignmentDate ? format(new Date(assignmentDate), "PPP") : "Not set"}</span>
                            <span>Completion: {completionDate ? format(new Date(completionDate), "PPP") : "In Progress"}</span>
                        </div>
                    </div>

                    {/* Quote */}
                    <div className="mb-8 p-6 bg-gray-50 border-l-4 border-gray-400 italic text-gray-700">
                        "{step.quote}"
                    </div>

                    {/* Content */}
                    <div className="space-y-8">
                        {step.parts ? (
                            step.parts.map((part) => (
                                <div key={part.partNumber} className="space-y-6">
                                    <h3 className="text-xl font-bold uppercase tracking-wider border-b border-gray-200 pb-2">Part {part.partNumber}</h3>
                                    {part.sections.map((section, idx) => (
                                        <div key={idx} className="mb-6">
                                            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                                <span className="bg-gray-800 text-white px-2 py-0.5 rounded text-xs uppercase">{section.type}</span>
                                                {section.title}
                                            </h4>
                                            {renderSectionContent(section, part.partNumber)}
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            step.sections?.map((section, idx) => (
                                <div key={idx} className="mb-6">
                                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <span className="bg-gray-800 text-white px-2 py-0.5 rounded text-xs uppercase">{section.type}</span>
                                        {section.title}
                                    </h4>
                                    {renderSectionContent(section)}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400 flex justify-between">
                        <span>12-Step Recovery Workbook</span>
                        <span>Generated on {format(new Date(), "PPP")}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
