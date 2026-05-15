"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedInstrument, setSelectedInstrument] = useState<"guitar" | "piano" | "vocals" | null>(null);

  const handleContinue = () => {
    if (selectedInstrument) {
      router.push("/practicecoach-ai");
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Welcome to PracticeCoach AI</CardTitle>
          <CardDescription>Let's get started with your first analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-gray-300 mb-4 text-sm font-medium">What instrument do you play?</p>
            <div className="grid grid-cols-3 gap-3">
              {(["guitar", "piano", "vocals"] as const).map((instrument) => (
                <button
                  key={instrument}
                  onClick={() => setSelectedInstrument(instrument)}
                  className={`p-4 rounded-lg font-medium transition-colors ${
                    selectedInstrument === instrument
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {instrument.charAt(0).toUpperCase() + instrument.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!selectedInstrument}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
