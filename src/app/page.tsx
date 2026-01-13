"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#3b82f6]">Loading...</div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6">
      {/* Hero content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        {/* Logo/Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.3)] animate-pulse-glow">
          <Sparkles className="w-10 h-10 text-[#3b82f6]" />
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#f1f5f9] leading-tight">
            12-Step Recovery
            <span className="block text-gradient">Workbook</span>
          </h1>
          <p className="text-lg text-[#94a3b8] max-w-md mx-auto">
            A digital companion for your recovery journey. Work through the steps at your own pace with privacy, support, and encouragement.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="min-w-[160px]">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="min-w-[160px]">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
          <div className="p-4 rounded-lg bg-[rgba(30,41,59,0.5)] border border-[#334155]">
            <h3 className="font-medium text-[#f1f5f9] mb-1">Private & Secure</h3>
            <p className="text-sm text-[#94a3b8]">Your work stays private. Review with your sponsor verbally.</p>
          </div>
          <div className="p-4 rounded-lg bg-[rgba(30,41,59,0.5)] border border-[#334155]">
            <h3 className="font-medium text-[#f1f5f9] mb-1">Track Progress</h3>
            <p className="text-sm text-[#94a3b8]">See your journey with day counters and step completion.</p>
          </div>
          <div className="p-4 rounded-lg bg-[rgba(30,41,59,0.5)] border border-[#334155]">
            <h3 className="font-medium text-[#f1f5f9] mb-1">Daily Support</h3>
            <p className="text-sm text-[#94a3b8]">Gentle encouragement notifications to keep you motivated.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-center text-sm text-[#64748b]">
        <p>Based on the 12-step program. Not affiliated with any specific organization.</p>
      </footer>
    </main>
  );
}
