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

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [role, setRole] = useState<UserRole>("sponsee");
    const [sponsorPassword, setSponsorPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { signUp } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (role === "sponsor" && sponsorPassword.toLowerCase() !== "freelygiven") {
            setError("Incorrect Sponsor Access Password");
            return;
        }
        setIsLoading(true);

        try {
            await signUp(email, password, role, displayName);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to create account. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto inline-flex items-center justify-center w-14 h-14 rounded-full bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.3)]">
                        <Sparkles className="w-7 h-7 text-[#3b82f6]" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl">Create Account</CardTitle>
                        <CardDescription>Start your recovery journey today</CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#ef4444] text-sm">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Role Selection */}
                        <div className="space-y-2">
                            <Label>I am a...</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setRole("sponsee")}
                                    className={`
                    flex flex-col items-center gap-2 p-4 rounded-lg border transition-all
                    ${role === "sponsee"
                                            ? "bg-[rgba(59,130,246,0.1)] border-[#3b82f6] text-[#3b82f6]"
                                            : "bg-[#0f172a] border-[#334155] text-[#94a3b8] hover:border-[rgba(59,130,246,0.3)]"
                                        }
                  `}
                                >
                                    <UserCheck className="h-6 w-6" />
                                    <span className="text-sm font-medium">Sponsee</span>
                                    <span className="text-xs opacity-75">Working the steps</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("sponsor")}
                                    className={`
                    flex flex-col items-center gap-2 p-4 rounded-lg border transition-all
                    ${role === "sponsor"
                                            ? "bg-[rgba(59,130,246,0.1)] border-[#3b82f6] text-[#3b82f6]"
                                            : "bg-[#0f172a] border-[#334155] text-[#94a3b8] hover:border-[rgba(59,130,246,0.3)]"
                                        }
                  `}
                                >
                                    <Users className="h-6 w-6" />
                                    <span className="text-sm font-medium">Sponsor</span>
                                    <span className="text-xs opacity-75">Guiding others</span>
                                </button>
                            </div>
                        </div>

                        {/* Sponsor Access Password Gate */}
                        {role === "sponsor" && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="sponsorPassword">Sponsor Access Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3b82f6]" />
                                    <Input
                                        id="sponsorPassword"
                                        type="password"
                                        placeholder="Enter access code"
                                        value={sponsorPassword}
                                        onChange={(e) => setSponsorPassword(e.target.value)}
                                        className="pl-10 border-[#3b82f6] focus:ring-[#3b82f6]"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-[#94a3b8]">
                                    Hint: "Freely ye have received..." (Code: FreelyGiven)
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="displayName">Display Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                                <Input
                                    id="displayName"
                                    type="text"
                                    placeholder="Your name"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Creating account..." : "Create Account"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-[#94a3b8]">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#3b82f6] hover:underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
