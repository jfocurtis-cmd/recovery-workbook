"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Mail, Lock, User, AlertCircle, Users, UserCheck } from "lucide-react";

import { PhoneAuthForm } from "@/components/auth/PhoneAuthForm";

export default function SignupPage() {
    const [step, setStep] = useState<"phone" | "profile">("phone");
    const [authUser, setAuthUser] = useState<any>(null);
    const [displayName, setDisplayName] = useState("");
    const [role, setRole] = useState<UserRole>("sponsee");
    const [sponsorPassword, setSponsorPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handlePhoneSuccess = async (user: any) => {
        setAuthUser(user);
        try {
            // Include checkUserProfileExists dynamically to avoid circular deps if any
            const { checkUserProfileExists } = await import("@/lib/firebase/auth");
            const exists = await checkUserProfileExists(user.uid);

            if (exists) {
                router.push("/dashboard");
            } else {
                setStep("profile");
            }
        } catch (err) {
            console.error("Error checking profile:", err);
            // If error, assume new user/retry
            setStep("profile");
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (role === "sponsor" && sponsorPassword.toLowerCase() !== "freelygiven") {
            setError("Incorrect Sponsor Access Password");
            return;
        }

        setIsLoading(true);
        try {
            const { createPhoneUserProfile } = await import("@/lib/firebase/auth");
            await createPhoneUserProfile(authUser, role, displayName);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to create profile.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-[#0f172a]">
            <Card className="w-full max-w-md bg-[#1e293b] border-[#334155]">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto inline-flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.3)]">
                        <Sparkles className="w-7 h-7 text-[#3b82f6]" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl text-[#f1f5f9]">Create Account</CardTitle>
                        <CardDescription className="text-[#94a3b8]">Start your recovery journey with a verified phone number</CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    {step === "phone" ? (
                        <div className="animate-in fade-in slide-in-from-left-4">
                            <PhoneAuthForm onVerificationSuccess={handlePhoneSuccess} />

                            <div className="mt-6 text-center text-sm text-[#94a3b8]">
                                Already have an account?{" "}
                                <Link href="/login" className="text-[#3b82f6] hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleProfileSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4">
                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#ef4444] text-sm">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Defaulting to Sponsee - Role Selection Removed */}


                            <div className="space-y-2">
                                <Label htmlFor="displayName" className="text-[#f1f5f9]">Display Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                                    <Input
                                        id="displayName"
                                        type="text"
                                        placeholder="Your name"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="pl-10 bg-[#0f172a] border-[#334155] text-[#f1f5f9]"
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                                {isLoading ? "Creating Profile..." : "Complete Setup"}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
