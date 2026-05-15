"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "./_components/AuthProvider";
import { sessionApi, paymentApi } from "@/_lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle } from "lucide-react";

interface Session {
  id: string;
  instrument: "guitar" | "piano" | "vocals";
  weakness_tags: string | null;
  created_at: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<"free" | "coach" | "pro" | null>(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const transactionId = searchParams.get("transaction_id");
        const checkoutSuccess = searchParams.get("checkout");

        if (transactionId && checkoutSuccess === "success") {
          setPaymentProcessing(true);
          try {
            const result = await paymentApi.verifyTransaction(transactionId);
            setTier(result.tier);
            window.history.replaceState({}, document.title, "/practicecoach-ai");
            setPaymentProcessing(false);
          } catch (err) {
            setVerifyError("Payment verification in progress. Please wait...");
            let attempts = 0;
            const pollInterval = setInterval(async () => {
              attempts++;
              if (attempts > 20) {
                clearInterval(pollInterval);
                setPaymentProcessing(false);
                setVerifyError("");
              }
              try {
                const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/subscription`, {
                  credentials: "include",
                });
                const subData = await resp.json();
                if (subData.tier && subData.tier !== "free") {
                  setTier(subData.tier);
                  clearInterval(pollInterval);
                  window.history.replaceState({}, document.title, "/practicecoach-ai");
                  setPaymentProcessing(false);
                  setVerifyError("");
                }
              } catch {}
            }, 2000);
          }
        } else {
          setPaymentProcessing(false);
        }

        const [sessionData, subData] = await Promise.all([
          sessionApi.list().catch(() => []),
          (async () => {
            try {
              const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/subscription`, {
                credentials: "include",
              });
              return resp.json();
            } catch {
              return { tier: "free" };
            }
          })(),
        ]);

        setSessions(sessionData);
        setTier(subData.tier || "free");
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex-1 bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-white mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Welcome, <strong>{user?.display_name || user?.email}</strong>
          </p>
        </div>

        {paymentProcessing && (
          <Alert className="mb-6 bg-blue-950 border-blue-800">
            <AlertDescription className="text-blue-200">
              Payment processing... please wait. This may take a few seconds.
            </AlertDescription>
          </Alert>
        )}

        {verifyError && (
          <Alert className="mb-6 bg-yellow-950 border-yellow-800">
            <AlertDescription className="text-yellow-200">{verifyError}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Current Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white capitalize">{tier}</p>
                  <p className="text-gray-400 text-sm">
                    {tier === "free" && "3 analyses/month, limited features"}
                    {tier === "coach" && "Unlimited analyses, full features"}
                    {tier === "pro" && "Everything + advanced analytics & priority support"}
                  </p>
                </div>
                <Badge className={tier === "pro" ? "bg-purple-900" : tier === "coach" ? "bg-blue-900" : "bg-gray-700"}>
                  {tier?.toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Ready to Analyze?</CardTitle>
              <CardDescription>Record or upload your next performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/practicecoach-ai/analyze")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start New Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Sessions</CardTitle>
              <CardDescription>Your analysis history</CardDescription>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No sessions yet. Start your first analysis!</p>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => router.push(`/practicecoach-ai/results/${session.id}`)}
                      className="w-full text-left p-4 border border-gray-700 rounded-lg hover:border-gray-600 hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium capitalize">{session.instrument}</p>
                          <p className="text-gray-400 text-sm">{new Date(session.created_at).toLocaleDateString()}</p>
                          {session.weakness_tags && (
                            <p className="text-gray-500 text-xs mt-1">{session.weakness_tags.split(";").slice(0, 2).join(", ")}</p>
                          )}
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {tier === "free" && (
            <Card className="bg-gradient-to-r from-blue-950 to-purple-950 border-blue-800">
              <CardHeader>
                <CardTitle className="text-white">Upgrade to Coach Tier</CardTitle>
                <CardDescription>Get unlimited analyses and more features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Unlimited analyses per month</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>See all diagnosed weaknesses</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Complete 3–5 exercise drills</span>
                  </li>
                  <li className="flex gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>Full session history</span>
                  </li>
                </ul>
                <Button
                  onClick={() => router.push("/practicecoach-ai/pricing")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View Pricing
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex-1 bg-gray-900" />}>
      <DashboardContent />
    </Suspense>
  );
}
