import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "12-Step Recovery Workbook",
  description: "A digital workbook for guiding users through a 12-step recovery process. Emphasizes privacy, calm UX, and encouragement without pressure.",
  keywords: ["recovery", "12-step", "workbook", "sobriety", "support"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#0f172a]`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <div className="ethereal-bg watercolor-overlay min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
