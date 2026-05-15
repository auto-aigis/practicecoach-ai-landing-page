"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { sessionApi, paymentApi } from "@/_lib/api";
import { useAuth } from "../../_components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SessionData {
  id: string;
  instrument: "guitar" | "piano" | "vocals";
  audio_duration_secs: number | null;
  quality_check_passed: boolean;
  diagnosis: Array<{ weakness: string; explanation: string; severity: "low" | "medium" | "high" }>;
  drill: Array<{ name: string; goal: string; duration_mins: number; instructions: string[] }>;
  created_at: string;
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tier, setTier] = useState<"free" | "coach" | "pro" | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradingTo, setUpgradingTo] = useState<"coach" | "pro" | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const data = await sessionApi.get(sessionId);
        setSession(data);

        const subData = await (async () => {
          try {
            const sub = await paymentApi.cancel.toString().includes("cancel")
              ? (async () => {
                  try {
                    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/subscription`, {
                      credentials: "include",
                    });
                    return resp.json();
                  } catch {
                    return { tier: "free" };
                  }
                })()
              : { tier: "free" };
            return sub;
          } catch {
            return { tier: "free" };
          }
        })();

        setTier(subData.tier || "free");

        if (subData.tier === "free") {
          setShowUpgradePrompt(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load session");
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [sessionId]);

  const handleUpgrade = async (targetTier: "coach" | "pro") => {
    setUpgradingTo(targetTier);
    try {
      const result = await paymentApi.checkout(targetTier);
      window.location.href = result.checkout_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start checkout");
      setUpgradingTo(null);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-900 text-red-200";
      case "medium":
        return "bg-yellow-900 text-yellow-200";
      case "low":
        return "bg-green-900 text-green-200";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-white mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex-1 bg-gray-900 p-6">
        <Alert className="bg-red-950 border-red-800">
          <AlertDescription className="text-red-200">{error || "Session not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const displayDiagnosis = tier === "free" ? session.diagnosis.slice(0, 2) : session.diagnosis;
  const displayDrill = tier === "free" ? session.drill.slice(0, 1) : session.drill;
  const drillDuration = displayDrill.reduce((sum, ex) => sum + ex.duration_mins, 0);

  return (
    <div className="flex-1 bg-gray-900 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold text-white mb-2">Your Analysis Results</h1>
        <p className="text-gray-400 mb-6">
          {session.instrument.charAt(0).toUpperCase() + session.instrument.slice(1)} • {new Date(session.created_at).toLocaleDateString()}
        </p>

        <div className="grid gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Performance Diagnosis</CardTitle>
              <CardDescription>
                {tier === "free" && session.diagnosis.length > 2 && `Showing top 2 of ${session.diagnosis.length} issues (upgrade to see all)`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {displayDiagnosis.length > 0 ? (
                displayDiagnosis.map((item, idx) => (
                  <div key={idx} className="border border-gray-700 rounded p-4">
                    <div className="flex items-start gap-3 mb-2">
                      <Badge className={getSeverityColor(item.severity)}>
                        {item.severity.charAt(0).toUpperCase() + item.severity.slice(1)}
                      </Badge>
                      <h3 className="text-lg font-semibold text-white">{item.weakness}</h3>
                    </div>
                    <p className="text-gray-300">{item.explanation}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">Great performance! No significant issues detected.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Your Personalized Practice Drill</CardTitle>
              <CardDescription>
                {drillDuration} minutes • {tier === "free" && displayDrill.length < session.drill.length && `${displayDrill.length} exercise (upgrade for complete ${session.drill.length}-exercise drill)`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {displayDrill.map((exercise, idx) => (
                <div key={idx}>
                  {idx > 0 && <Separator className="mb-6 bg-gray-700" />}
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-white">Exercise {idx + 1}: {exercise.name}</h3>
                    <p className="text-gray-400 text-sm">{exercise.duration_mins} minutes • Goal: {exercise.goal}</p>
                  </div>
                  <ol className="space-y-2 text-gray-300">
                    {exercise.instructions.map((instruction, instIdx) => (
                      <li key={instIdx} className="flex gap-3">
                        <span className="font-semibold text-blue-400">{instIdx + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </CardContent>
          </Card>

          {showUpgradePrompt && tier === "free" && (
            <Card className="bg-blue-950 border-blue-800">
              <CardHeader>
                <CardTitle className="text-white">Upgrade to Coach Tier</CardTitle>
                <CardDescription>Get unlimited analyses and complete personalized drills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-gray-300">
                  <p>✓ Unlimited analyses per month</p>
                  <p>✓ See all diagnosed weaknesses</p>
                  <p>✓ Complete 3–5 exercise drills</p>
                  <p>✓ Full session history and dashboard</p>
                  <p>✓ Email support</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleUpgrade("coach")}
                    disabled={upgradingTo === "coach"}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {upgradingTo === "coach" ? "Processing..." : "Upgrade to Coach — $12.99/mo"}
                  </Button>
                  <Button
                    onClick={() => handleUpgrade("pro")}
                    disabled={upgradingTo === "pro"}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-700"
                  >
                    {upgradingTo === "pro" ? "Processing..." : "Pro — $24.99/mo"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/practicecoach-ai/analyze")}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-700"
            >
              Analyze Another Performance
            </Button>
            <Button
              onClick={() => router.push("/practicecoach-ai/dashboard")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
