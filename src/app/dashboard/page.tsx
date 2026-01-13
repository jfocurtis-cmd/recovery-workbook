"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { CircularProgress } from "@/components/dashboard/CircularProgress";
import { DayCounterCard } from "@/components/dashboard/DayCounterCard";
import { StepAccordion } from "@/components/dashboard/StepAccordion";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    subscribeToStepProgress,
    calculateTotalDays,
    calculateCurrentStepDays,
    getCurrentStepNumber,
    getCompletedStepsCount,
    StepProgress,
} from "@/lib/firebase/firestore";
import { getRandomEncouragement } from "@/data/encouragements";
import { LogOut, Sparkles, Bell, Lock, User, Users } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

export default function DashboardPage() {
    const { user, profile, loading, signOut, isSponsor } = useAuth();
    const router = useRouter();
    const [progress, setProgress] = useState<StepProgress[]>([]);
    const [encouragement, setEncouragement] = useState("");
    const [viewRole, setViewRole] = useState<"sponsor" | "sponsee">("sponsee");
    const [isGateOpen, setIsGateOpen] = useState(false);
    const [gatePassword, setGatePassword] = useState("");
    const [gateError, setGateError] = useState("");

    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Set initial view role based on profile
    useEffect(() => {
        if (profile?.role) {
            setViewRole(profile.role);
        }
    }, [profile]);

    // Subscribe to progress updates
    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToStepProgress(user.uid, (stepProgress) => {
            setProgress(stepProgress);
        });

        return () => unsubscribe();
    }, [user]);

    // Set daily encouragement
    useEffect(() => {
        setEncouragement(getRandomEncouragement());
    }, []);

    const handleTabChange = (value: string) => {
        const newRole = value as "sponsor" | "sponsee";
        if (newRole === "sponsee") {
            setViewRole("sponsee");
        } else {
            // Check if user is actually a sponsor
            if (profile?.role === "sponsor") {
                setViewRole("sponsor");
            } else {
                // Open gate
                setGatePassword("");
                setGateError("");
                setIsGateOpen(true);
            }
        }
    };

    const handleGateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGateError(""); // Clear previous errors

        if (gatePassword.toLowerCase() === "freelygiven") {
            try {
                // Dynamically import to avoid circular dependencies if any
                const { updateUserRole } = await import("@/lib/firebase/auth");

                if (user) {
                    await updateUserRole(user.uid, "sponsor");
                    setViewRole("sponsor");
                    setIsGateOpen(false);
                    // Force a profile reload or wait for onIdTokenChanged? 
                    // Usually Firestore update triggers the hook, but let's be safe.
                    window.location.reload();
                }
            } catch (err) {
                console.error("Error upgrading role:", err);
                setGateError("Failed to update account. Please try again.");
            }
        } else {
            setGateError("Incorrect access code.");
        }
    };

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-[#3b82f6]">Loading...</div>
            </div>
        );
    }

    const completedSteps = getCompletedStepsCount(progress);
    const currentStep = getCurrentStepNumber(progress);
    const totalDays = calculateTotalDays(progress);
    const currentStepDays = calculateCurrentStepDays(progress, currentStep);

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <main className="min-h-screen relative z-10">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0f172a]/80 border-b border-[#334155]">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

                    <div className="flex items-center gap-4">
                        <BrandLogo />
                        <div className="h-6 w-px bg-slate-700 mx-2 hidden sm:block" />
                        <div className="hidden sm:block">
                            <p className="text-xs font-medium text-slate-400">
                                {profile?.displayName || profile?.email}
                            </p>
                            <p className="text-[10px] text-blue-400 uppercase tracking-wider font-semibold">
                                {profile?.role === "sponsor" ? "Sponsor" : "Sponsee"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Tabs value={viewRole} onValueChange={handleTabChange} className="hidden sm:block">
                            <TabsList className="bg-[#1e293b] border border-[#334155]">
                                <TabsTrigger value="sponsee" className="gap-2 data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white">
                                    <User className="h-4 w-4" />
                                    Sponsee
                                </TabsTrigger>
                                <TabsTrigger value="sponsor" className="gap-2 data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white">
                                    <Users className="h-4 w-4" />
                                    Sponsor
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="text-[#94a3b8]">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-[#94a3b8]">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Sponsor Gate Modal */}
            {isGateOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <Card className="w-full max-w-sm border-2 border-[#3b82f6] shadow-[0_0_50px_-12px_rgba(59,130,246,0.5)]">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Lock className="h-5 w-5 text-[#3b82f6]" />
                                Sponsor Access
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleGateSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Enter Access Code</Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={gatePassword}
                                        onChange={(e) => setGatePassword(e.target.value)}
                                        className="border-[#3b82f6]/50 focus:border-[#3b82f6]"
                                        autoFocus
                                    />
                                    {gateError && (
                                        <p className="text-sm text-red-400">{gateError}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button type="button" variant="ghost" className="flex-1" onClick={() => setIsGateOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                        Access
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Encouragement banner */}
                <Card className="mb-8 bg-gradient-to-r from-[rgba(59,130,246,0.1)] to-[rgba(139,92,246,0.1)] border-[rgba(59,130,246,0.2)]">
                    <CardContent className="py-4 flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[rgba(59,130,246,0.2)] flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-[#3b82f6]" />
                        </div>
                        <p className="text-[#f1f5f9] italic">"{encouragement}"</p>
                    </CardContent>
                </Card>

                {/* Progress section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Circular progress */}
                    <div className="lg:col-span-1 flex justify-center">
                        <Card className="w-full flex items-center justify-center py-8">
                            <CircularProgress completed={completedSteps} total={12} />
                        </Card>
                    </div>

                    {/* Day counters */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DayCounterCard
                            days={totalDays}
                            label="Total Days in Program"
                            type="total"
                        />
                        <DayCounterCard
                            days={currentStepDays}
                            label={`Days on Step ${currentStep}`}
                            type="current"
                        />

                        {/* Current step CTA */}
                        <Card className="sm:col-span-2">
                            <CardContent className="py-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-[#f1f5f9] mb-1">
                                            {completedSteps === 12
                                                ? "Congratulations! All Steps Complete"
                                                : `Currently Working: Step ${currentStep}`
                                            }
                                        </h3>
                                        <p className="text-sm text-[#94a3b8]">
                                            {completedSteps === 12
                                                ? "Continue practicing the principles in all your affairs."
                                                : "Continue your work or review previous steps below."
                                            }
                                        </p>
                                    </div>
                                    <Link href={`/steps/${currentStep}`}>
                                        <Button>
                                            {completedSteps === 12 ? "Review Steps" : "Continue"}
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Steps accordion */}
                <Card className="p-6">
                    <StepAccordion
                        progress={progress}
                        currentStep={currentStep}
                        isSponsor={viewRole === "sponsor"}
                    />
                </Card>
            </div>
        </main>
    );
}
