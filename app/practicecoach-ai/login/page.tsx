"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../_components/AuthProvider";
import { authApi } from "@/_lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const router = useRouter();
  const { refresh } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUnverified(false);
    setLoading(true);

    try {
      await authApi.login(email, password);
      await refresh();
      router.push("/practicecoach-ai");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      if (message === "email_not_verified") {
        setUnverified(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await authApi.resendVerification(email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch {
      setError("Failed to resend verification email");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Sign In</CardTitle>
          <CardDescription>Sign in to your PracticeCoach AI account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert className="bg-red-950 border-red-800"><AlertDescription className="text-red-200">{error}</AlertDescription></Alert>}

            {unverified && (
              <Alert className="bg-yellow-950 border-yellow-800">
                <AlertDescription className="text-yellow-200">
                  Please verify your email before signing in.
                </AlertDescription>
              </Alert>
            )}

            {resendSuccess && (
              <Alert className="bg-green-950 border-green-800">
                <AlertDescription className="text-green-200">Email sent! Check your inbox.</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {unverified && (
            <Button
              onClick={handleResend}
              disabled={resendLoading}
              variant="outline"
              className="w-full mt-4 text-gray-300 border-gray-700 hover:bg-gray-800"
            >
              {resendLoading ? "Sending..." : "Resend Verification Email"}
            </Button>
          )}

          <div className="mt-4 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link href="/practicecoach-ai/register" className="text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
          </div>

          <div className="mt-2 text-center text-sm text-gray-400">
            <Link href="/practicecoach-ai/reset-password" className="text-blue-400 hover:text-blue-300">
              Forgot password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
