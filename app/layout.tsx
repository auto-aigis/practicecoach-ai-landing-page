import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import "./globals.css";

export const metadata: Metadata = {
  title: "PracticeCoach AI - AI Music Coaching",
  description: "Get personalized feedback and practice drills for guitar, piano, and vocals",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        <header className="border-b border-gray-800 sticky top-0 z-50 bg-gray-950">
          <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              PracticeCoach AI
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/practicecoach-ai/login">
                <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                  Sign In
                </Button>
              </Link>
              <Link href="/practicecoach-ai/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
