"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_components/AuthProvider";
import { paymentApi } from "@/_lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [tier, setTier] = useState<"free" | "coach" | "pro" | null>(null);
  const [periodEnd, setPeriodEnd] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/subscription`, {
          credentials: "include",
        });
        const data = await resp.json();
        setTier(data.tier || "free");
        setPeriodEnd(data.current_period_end);
      } catch (err) {
        setError("Failed to load subscription info");
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, []);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription?")) return;

    setCanceling(true);
    setError("");

    try {
      await paymentApi.cancel();
      setCancelSuccess(true);
      setTier("free");
      setTimeout(() => setCancelSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel subscription");
    } finally {
      setCanceling(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/practicecoach-ai/login");
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-white mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        <div className="grid gap-6">
          {error && (
            <Alert className="bg-red-950 border-red-800">
              <AlertDescription className="text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {cancelSuccess && (
            <Alert className="bg-green-950 border-green-800">
              <AlertDescription className="text-green-200">Subscription canceled successfully</AlertDescription>
            </Alert>
          )}

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300 block mb-2">Email</Label>
                <Input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-700 border-gray-600 text-gray-300"
                />
              </div>
              <div>
                <Label className="text-gray-300 block mb-2">Name</Label>
                <Input
                  type="text"
                  value={user?.display_name || ""}
                  disabled
                  className="bg-gray-700 border-gray-600 text-gray-300"
                />
              </div>
              <p className="text-gray-400 text-sm">
                Member since {new Date(user?.created_at || "").toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 mb-1">Current Plan</p>
                  <Badge className={tier === "pro" ? "bg-purple-900" : tier === "coach" ? "bg-blue-900" : "bg-gray-700"}>
                    {tier?.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {tier !== "free" && periodEnd && (
                <div>
                  <p className="text-gray-400 text-sm">
                    Renews on {new Date(periodEnd).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                {tier === "free" && (
                  <Button
                    onClick={() => router.push("/practicecoach-ai/pricing")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Upgrade Plan
                  </Button>
                )}

                {tier !== "free" && (
                  <Button
                    onClick={handleCancel}
                    disabled={canceling}
                    variant="outline"
                    className="w-full border-red-600 text-red-400 hover:border-red-500 hover:bg-red-950/20"
                  >
                    {canceling ? "Canceling..." : "Cancel Subscription"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Session</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-700"
              >
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
