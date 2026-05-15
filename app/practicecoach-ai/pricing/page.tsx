"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_components/AuthProvider";
import { paymentApi } from "@/_lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const [currentTier, setCurrentTier] = useState<"free" | "coach" | "pro" | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<"coach" | "pro" | null>(null);

  useEffect(() => {
    const loadTier = async () => {
      try {
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/subscription`, {
          credentials: "include",
        });
        const data = await resp.json();
        setCurrentTier(data.tier || "free");
      } catch {
        setCurrentTier("free");
      } finally {
        setLoading(false);
      }
    };

    loadTier();
  }, []);

  const handleUpgrade = async (tier: "coach" | "pro") => {
    if (!user) {
      router.push("/practicecoach-ai/login");
      return;
    }

    setUpgrading(tier);
    try {
      const result = await paymentApi.checkout(tier);
      window.location.href = result.checkout_url;
    } catch (err) {
      console.error("Checkout failed:", err);
      setUpgrading(null);
    }
  };

  const plans = [
    {
      name: "Free",
      tier: "free" as const,
      monthlyPrice: 0,
      annualPrice: 0,
      description: "Perfect to get started",
      features: [
        "3 analyses per month",
        "Top 1–2 weaknesses identified",
        "1-exercise drill",
        "7-day session history",
        "Community support",
      ],
      cta: "Your Current Plan",
      ctaDisabled: true,
    },
    {
      name: "Coach",
      tier: "coach" as const,
      monthlyPrice: 12.99,
      annualPrice: 99,
      annualSavings: 45,
      description: "For serious improvers",
      features: [
        "Unlimited analyses",
        "All weaknesses identified",
        "3–5 exercise drills",
        "Full session history",
        "Progress dashboard",
        "Email support",
      ],
      cta: "Upgrade to Coach",
      ctaDisabled: currentTier !== "free",
    },
    {
      name: "Pro",
      tier: "pro" as const,
      monthlyPrice: 24.99,
      annualPrice: 179,
      annualSavings: 120,
      description: "For committed musicians",
      features: [
        "Everything in Coach",
        "Before/after session comparison",
        "Skill trajectory charts",
        "Downloadable progress reports",
        "Priority support",
        "Early access to new features",
      ],
      cta: "Upgrade to Pro",
      ctaDisabled: currentTier === "pro",
    },
  ];

  if (loading) {
    return (
      <div className="flex-1 bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-white mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Simple, Transparent Pricing</h1>
        <p className="text-gray-400 text-center mb-8">Choose the plan that's right for your musical journey</p>

        <div className="flex justify-center gap-4 mb-12">
          <Button
            onClick={() => setBillingPeriod("monthly")}
            variant={billingPeriod === "monthly" ? "default" : "outline"}
            className={
              billingPeriod === "monthly"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-800"
            }
          >
            Monthly
          </Button>
          <Button
            onClick={() => setBillingPeriod("annual")}
            variant={billingPeriod === "annual" ? "default" : "outline"}
            className={
              billingPeriod === "annual"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-800"
            }
          >
            Annual <span className="ml-2 text-green-400">(Save up to 50%)</span>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.tier}
              className={
                plan.tier === "pro"
                  ? "bg-gradient-to-b from-purple-950 to-gray-800 border-purple-800 md:scale-105"
                  : "bg-gray-800 border-gray-700"
              }
            >
              <CardHeader>
                <CardTitle className="text-white">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                {plan.tier === "pro" && (
                  <Badge className="w-fit mt-2 bg-purple-600">Most Popular</Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      {billingPeriod === "monthly" ? `$${plan.monthlyPrice}` : `$${plan.annualPrice}`}
                    </span>
                    <span className="text-gray-400">/{billingPeriod === "monthly" ? "month" : "year"}</span>
                  </div>
                  {billingPeriod === "annual" && plan.annualSavings && (
                    <p className="text-green-400 text-sm mt-2">Save ${plan.annualSavings}/year</p>
                  )}
                </div>

                <Button
                  onClick={() => plan.tier !== "free" && handleUpgrade(plan.tier as "coach" | "pro")}
                  disabled={plan.ctaDisabled || upgrading === plan.tier}
                  className={
                    plan.tier === "pro"
                      ? "w-full bg-purple-600 hover:bg-purple-700 text-white"
                      : "w-full bg-blue-600 hover:bg-blue-700 text-white"
                  }
                >
                  {upgrading === plan.tier
                    ? "Processing..."
                    : currentTier === plan.tier
                      ? "Your Current Plan"
                      : plan.cta}
                </Button>


                <ul className="space-y-3 text-gray-300 text-sm">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex gap-2">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Have questions?</p>
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-800"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
