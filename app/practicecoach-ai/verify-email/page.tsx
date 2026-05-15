"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authApi } from "@/_lib/api";
import { useAuth } from "../_components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    setVerifying(true);
    try {
      await authApi.me();
      await refresh();
      router.push("/practicecoach-ai/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await authApi.resendVerification(email);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend verification email");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-white mx-auto"></div>
              <p className="mt-4 text-gray-300">Verifying your email...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Check Your Email</CardTitle>
          <CardDescription>We sent you a verification link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <Alert className="bg-red-950 border-red-800"><AlertDescription className="text-red-200">{error}</AlertDescription></Alert>}

          {resendSuccess && (
            <Alert className="bg-green-950 border-green-800">
              <AlertDescription className="text-green-200">Email sent! Check your inbox.</AlertDescription>
            </Alert>
          )}

          <p className="text-gray-300">
            We sent a verification link to <strong>{email}</strong>. Click the link in your email to verify your account.
          </p>

          <Button
            onClick={handleResend}
            disabled={loading}
            variant="outline"
            className="w-full text-gray-300 border-gray-700 hover:bg-gray-800"
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </Button>

          <div className="text-center text-sm text-gray-400">
            <Link href="/practicecoach-ai/login" className="text-blue-400 hover:text-blue-300">
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
