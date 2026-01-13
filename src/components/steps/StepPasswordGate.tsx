"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Unlock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { verifyStepPassword, getPasswordHint } from "@/data/passwords";

interface StepPasswordGateProps {
    stepNumber: number;
    stepTitle: string;
    onUnlock: () => void;
}

export function StepPasswordGate({ stepNumber, stepTitle, onUnlock }: StepPasswordGateProps) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [attempts, setAttempts] = useState(0);
    const [showHint, setShowHint] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (verifyStepPassword(stepNumber, password)) {
            onUnlock();
        } else {
            setAttempts((prev) => prev + 1);
            setError("Incorrect password. Please ask your sponsor for the correct password.");
            setPassword("");

            // Show hint after 3 failed attempts
            if (attempts >= 2) {
                setShowHint(true);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(59,130,246,0.1)] border border-[#3b82f6]">
                        <Lock className="h-8 w-8 text-[#3b82f6]" />
                    </div>
                    <CardTitle className="text-xl text-[#f1f5f9]">
                        Step {stepNumber}: {stepTitle}
                    </CardTitle>
                    <p className="text-sm text-[#94a3b8] mt-2">
                        This step is password protected. Please enter the password provided by your sponsor.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter step password"
                                className="pr-10"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#f1f5f9]"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>

                        {error && (
                            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-400">{error}</p>
                            </div>
                        )}

                        {showHint && (
                            <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                                <Lock className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-400">
                                    Hint: {getPasswordHint(stepNumber)}
                                </p>
                            </div>
                        )}

                        <Button type="submit" className="w-full gap-2">
                            <Unlock className="h-4 w-4" />
                            Unlock Step {stepNumber}
                        </Button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-[#334155]">
                        <p className="text-xs text-[#64748b] text-center">
                            Don't have the password? Your sponsor will provide it when you're ready to begin this step.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
