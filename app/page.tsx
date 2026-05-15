import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="bg-gray-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h1 className="text-5xl font-bold mb-4">Your Personal AI Music Coach</h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Get instant, teacher-quality feedback on your playing. Record or upload audio and receive personalized practice drills that target your specific weaknesses.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/practicecoach-ai/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Started Free
            </Button>
          </Link>
          <Link href="/practicecoach-ai/pricing">
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:border-gray-400 hover:bg-gray-800">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">1. Record</CardTitle>
              <CardDescription>Record a short clip directly in the browser or upload an audio file</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">Guitar, piano, or vocals — we analyze it all</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">2. Analyze</CardTitle>
              <CardDescription>Our AI diagnoses your technical weaknesses with specific, actionable feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">Powered by Whisper and GPT-4o</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">3. Practice</CardTitle>
              <CardDescription>Get a personalized 15-minute drill targeting your diagnosed issues</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm">Specific exercises, not generic tips</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Free</CardTitle>
              <CardDescription>Perfect to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold">$0</div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>3 analyses/month</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Top 1–2 weaknesses</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>1 exercise drill</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>7-day history</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Coach</CardTitle>
              <CardDescription>For serious improvers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold">$12.99<span className="text-sm text-gray-400">/mo</span></div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Unlimited analyses</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>All weaknesses</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>3–5 exercise drills</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Full history</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-b from-purple-950 to-gray-900 border-purple-800">
            <CardHeader>
              <CardTitle className="text-white">Pro</CardTitle>
              <CardDescription>For committed musicians</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-2xl font-bold">$24.99<span className="text-sm text-gray-400">/mo</span></div>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Everything in Coach</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Session comparison</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Progress reports</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Break Through Your Plateau?</h2>
        <p className="text-gray-400 mb-8">Join musicians who've already improved their technique with personalized AI coaching.</p>
        <Link href="/practicecoach-ai/register">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            Get Started Free
          </Button>
        </Link>
      </section>

      <footer className="border-t border-gray-800 bg-gray-900 py-8 mt-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-gray-400 text-sm">
          <p>&copy; 2024 PracticeCoach AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
