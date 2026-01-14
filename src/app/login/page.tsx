"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { checkUserProfileExists } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Mail, Lock, AlertCircle, Smartphone } from "lucide-react"; // Added Smartphone
import { PhoneAuthForm } from "@/components/auth/PhoneAuthForm";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
    const { signIn } = useAuth();
    const router = useRouter();

    const handlePhoneSuccess = async (user: any) => {
        // Check if user has a profile
        try {
            const hasProfile = await checkUserProfileExists(user.uid);
            if (hasProfile) {
                router.push("/dashboard");
            } else {
                // New user via login flow -> Redirect to signup details
                router.push("/signup?step=details");
            }
        } catch (error) {
            console.error("Error checking profile:", error);
            // Fallback to dashboard if check fails
            router.push("/dashboard");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        // ... existing email submit logic ...
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await signIn(email, password);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message || "Failed to sign in. Please check your credentials.");
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
                        <CardTitle className="text-2xl">Welcome Back</CardTitle>
                        <CardDescription>Sign in to continue your recovery journey</CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Method Toggle */}
                    <div className="flex bg-slate-900 p-1 rounded-lg mb-6">
                        <button
                            onClick={() => setAuthMethod("phone")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${authMethod === "phone"
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <Smartphone className="h-4 w-4" />
                            Phone
                        </button>
                        <button
                            onClick={() => setAuthMethod("email")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${authMethod === "email"
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            <Mail className="h-4 w-4" />
                            Email
                        </button>
                    </div>

                    {authMethod === "phone" ? (
                        <PhoneAuthForm onVerificationSuccess={handlePhoneSuccess} />
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#ef4444] text-sm">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

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

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    )}

                    <div className="mt-6 text-center text-sm text-[#94a3b8]">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-[#3b82f6] hover:underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
