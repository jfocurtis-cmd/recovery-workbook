import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Phone, ArrowRight, Loader2, Check } from "lucide-react";
import { setupRecaptcha, signInWithPhone } from "@/lib/firebase/auth";
import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth";

interface PhoneAuthFormProps {
    onVerificationSuccess: (user: any) => void;
}

export function PhoneAuthForm({ onVerificationSuccess }: PhoneAuthFormProps) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

    // Initialize reCAPTCHA on mount
    useEffect(() => {
        try {
            const verifier = setupRecaptcha("recaptcha-container");
            setRecaptchaVerifier(verifier);
        } catch (err) {
            console.error("Failed to setup reCAPTCHA", err);
        }
    }, []);

    const formatPhoneNumber = (value: string) => {
        // Basic formatting to ensure E.164 format (+1...)
        // This is a naive implementation; verifying standard format is better
        let cleaned = value.replace(/\D/g, '');
        // If user enters 10 digits (US), prepend +1
        if (cleaned.length === 10) {
            return `+1${cleaned}`;
        }
        // If user explicitly types +, keep it
        if (value.startsWith("+")) {
            return value;
        }
        return `+${cleaned}`;
    };

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const formattedNumber = formatPhoneNumber(phoneNumber);
        if (formattedNumber.length < 10) {
            setError("Please enter a valid phone number.");
            setIsLoading(false);
            return;
        }

        if (!recaptchaVerifier) {
            setError("reCAPTCHA not initialized. Please refresh.");
            setIsLoading(false);
            return;
        }

        try {
            // Firebase phone auth
            const confirmation = await signInWithPhone(formattedNumber, recaptchaVerifier);
            setConfirmationResult(confirmation);
        } catch (err: any) {
            console.error("Error sending code:", err);
            if (err.code === "auth/invalid-phone-number") {
                setError("Invalid phone number format.");
            } else if (err.code === "auth/too-many-requests") {
                setError("Too many requests. Please try again later.");
            } else {
                setError(err.message || "Failed to send verification code.");
            }
            // Reset captcha on error so they can try again
            if (recaptchaVerifier) {
                recaptchaVerifier.clear();
                const verifier = setupRecaptcha("recaptcha-container");
                setRecaptchaVerifier(verifier);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!confirmationResult) return;

        try {
            const result = await confirmationResult.confirm(verificationCode);
            onVerificationSuccess(result.user);
        } catch (err: any) {
            console.error("Error verifying code:", err);
            setError("Incorrect code. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {!confirmationResult ? (
                /* Step 1: Phone Number */
                <form onSubmit={handleSendCode} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="(555) 555-5555"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="pl-10 bg-slate-900 border-slate-700 text-slate-100"
                                disabled={isLoading}
                            />
                        </div>
                        <p className="text-xs text-slate-500">
                            We will send you a text with a verification code. Message and data rates may apply.
                        </p>
                    </div>

                    <div id="recaptcha-container"></div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        disabled={isLoading || !phoneNumber}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending Code...
                            </>
                        ) : (
                            <>
                                Send Verification Code
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>
            ) : (
                /* Step 2: Verification Code */
                <form onSubmit={handleVerifyCode} className="space-y-4 animate-in fade-in slide-in-from-right-4">
                    <div className="space-y-2">
                        <Label htmlFor="code">Enter Verification Code</Label>
                        <Input
                            id="code"
                            type="text"
                            placeholder="123456"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className="bg-slate-900 border-slate-700 text-slate-100 text-center tracking-[1em] font-mono text-lg"
                            maxLength={6}
                        />
                        <button
                            type="button"
                            onClick={() => setConfirmationResult(null)}
                            className="text-xs text-blue-400 hover:underline"
                        >
                            Change Phone Number
                        </button>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={isLoading || verificationCode.length !== 6}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                Verify & Sign In
                                <Check className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>
            )}
        </div>
    );
}
