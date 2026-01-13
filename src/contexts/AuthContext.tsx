"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "firebase/auth";
import {
    onAuthChange,
    getUserProfile,
    signIn as firebaseSignIn,
    signUp as firebaseSignUp,
    signOut as firebaseSignOut,
    UserProfile,
    UserRole,
} from "@/lib/firebase/auth";

// Demo mode flag - set to true to bypass Firebase auth
const DEMO_MODE = true;

// Mock user for demo mode
const DEMO_USER: User = {
    uid: "demo-user-123",
    email: "demo@example.com",
    emailVerified: true,
    displayName: "Demo User",
} as User;

const DEMO_PROFILE: UserProfile = {
    uid: "demo-user-123",
    email: "demo@example.com",
    role: "sponsee",
    createdAt: new Date("2024-01-01"),
    displayName: "Demo User",
};

interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, role: UserRole, displayName?: string) => Promise<void>;
    signOut: () => Promise<void>;
    isSponsor: boolean;
    isSponsee: boolean;
    isDemoMode: boolean;
    toggleDemoRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(DEMO_MODE ? DEMO_USER : null);
    const [profile, setProfile] = useState<UserProfile | null>(DEMO_MODE ? DEMO_PROFILE : null);
    const [loading, setLoading] = useState(!DEMO_MODE);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (DEMO_MODE) {
            // In demo mode, skip Firebase auth
            return;
        }

        const unsubscribe = onAuthChange(async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                try {
                    const userProfile = await getUserProfile(firebaseUser.uid);
                    setProfile(userProfile);
                } catch (err) {
                    console.error("Error fetching user profile:", err);
                    setProfile(null);
                }
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        if (DEMO_MODE) {
            // In demo mode, just set demo user
            setUser(DEMO_USER);
            setProfile(DEMO_PROFILE);
            return;
        }

        setError(null);
        setLoading(true);
        try {
            await firebaseSignIn(email, password);
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, role: UserRole, displayName?: string) => {
        if (DEMO_MODE) {
            // In demo mode, create a demo profile with selected role
            setUser(DEMO_USER);
            setProfile({
                ...DEMO_PROFILE,
                role,
                displayName: displayName || "Demo User",
            });
            return;
        }

        setError(null);
        setLoading(true);
        try {
            const newProfile = await firebaseSignUp(email, password, role, displayName);
            setProfile(newProfile);
        } catch (err: any) {
            setError(err.message || "Failed to sign up");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        if (DEMO_MODE) {
            setUser(null);
            setProfile(null);
            return;
        }

        setError(null);
        try {
            await firebaseSignOut();
            setUser(null);
            setProfile(null);
        } catch (err: any) {
            setError(err.message || "Failed to sign out");
            throw err;
        }
    };

    // Toggle between sponsor and sponsee in demo mode
    const toggleDemoRole = () => {
        if (profile) {
            setProfile({
                ...profile,
                role: profile.role === "sponsor" ? "sponsee" : "sponsor",
            });
        }
    };

    const value: AuthContextType = {
        user,
        profile,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        isSponsor: profile?.role === "sponsor",
        isSponsee: profile?.role === "sponsee",
        isDemoMode: DEMO_MODE,
        toggleDemoRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
