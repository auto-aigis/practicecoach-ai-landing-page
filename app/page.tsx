"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Zap,
  Headphones,
  Target,
  Clock,
  CheckCircle,
  Music,
  TrendingUp,
  Mic,
  Brain,
  Play,
} from "lucide-react";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface StepType {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface InstrumentTab {
  value: string;
  label: string;
}

const Home = () => {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => {
        setSubmitted(false);
      }, 3000);
    }
  };

  const features: Feature[] = [
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered Diagnosis",
      description:
        "Advanced audio analysis identifies your specific technical weaknesses like timing drift, finger transitions, and pitch inconsistencies.",
    },
    {
      icon: <Target className="w-8 h-8 text-purple-600" />,
      title: "Personalized Practice Plans",
      description:
        "Get a tailored 15-minute daily drill targeting exactly what you need to work on, not generic exercises.",
    },
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: "Save Time & Money",
      description:
        "Cut through the plateau in weeks instead of months. No $60–$150/hr coach fees—just affordable AI guidance.",
    },
    {
      icon: <Music className="w-8 h-8 text-pink-600" />,
      title: "Multiple Instruments",
      description:
        "Works with guitar, piano, and vocals—designed specifically for adult intermediate hobbyists.",
    },
  ];

  const steps: StepType[] = [
    {
      number: 1,
      title: "Record Your Performance",
      description:
        "Play a 30-60 second clip in your browser. No downloads, no setup.",
      icon: <Mic className="w-12 h-12 text-blue-500" />,
    },
    {
      number: 2,
      title: "AI Listens & Analyzes",
      description:
        "Our audio AI and NLP engine diagnoses the root cause of your plateau.",
      icon: <Brain className="w-12 h-12 text-purple-500" />,
    },
    {
      number: 3,
      title: "Get Your Drill",
      description:
        "Receive a clear explanation of what is wrong and a personalized 15-minute practice exercise.",
      icon: <Target className="w-12 h-12 text-green-500" />,
    },
    {
      number: 4,
      title: "Breakthrough",
      description:
        "Practice daily for 2–3 weeks and watch your technique transform.",
      icon: <TrendingUp className="w-12 h-12 text-pink-500" />,
    },
  ];

  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for curious hobbyists",
      features: [
        "2 practice audits per month",
        "AI diagnosis & drill generation",
        "One instrument focus",
        "Email support",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$24",
      period: "/month",
      description: "Serious about breakthrough",
      features: [
        "Unlimited practice audits",
        "AI diagnosis & drill generation",
        "All instruments (guitar, piano, vocals)",
        "Progress tracking dashboard",
        "Priority email support",
        "Advanced drill customization",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Band",
      price: "$59",
      period: "/month",
      description: "For groups & ensembles",
      features: [
        "Everything in Pro",
        "Up to 5 musicians",
        "Shared progress analytics",
        "Collaborative drill planning",
        "Live chat support",
        "Custom practice setlists",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  const instruments: InstrumentTab[] = [
    { value: "guitar", label: "Guitar" },
    { value: "piano", label: "Piano" },
    { value: "vocals", label: "Vocals" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-900">
              PracticeCoach AI
            </span>
          </div>
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered Music Coaching
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Break Through Your Plateau with{" "}
            <span className="text-blue-600">AI Coaching</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Record a 60-second clip. Get diagnosed. Practice smarter. Your AI
            coach listens, identifies exactly why you are stuck, and builds your
            personalized daily drill. Breakthrough in weeks, not months.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Start Free Audit
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <div className="font-bold text-gray-900">No Setup</div>
              <div>Browser-based</div>
            </div>
            <div>
              <div className="font-bold text-gray-900">5 Minutes</div>
              <div>First diagnosis</div>
            </div>
            <div>
              <div className="font-bold text-gray-900">Results</div>
              <div>2–3 weeks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            You are stuck. That is the real problem.
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 bg-white border-red-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Without PracticeCoach
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Generic online lessons never address YOUR specific issues</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>
                    Human coaches cost $60–$150/hr and are not accessible
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>App games like Yousician only say "wrong note" but not why</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Months or years of unfocused practice repeating the same mistakes</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                With PracticeCoach
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>
                    AI diagnoses the root cause: timing drift, finger transition speed,
                    pitch control
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>$24/month vs. $600–$1500/month for human coaching</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Personalized 15-minute daily drill, not generic exercises</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>
                    Breakthrough in 2–3 weeks with laser-focused practice
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why PracticeCoach Wins
            </h2>
            <p className="text-lg text-gray-600">
              Built by musicians, powered by AI. Built for your breakthrough.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 bg-white border-gray-200">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              From recording to breakthrough in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-8 bg-white text-center h-full">
                  <div className="flex justify-center mb-4">{step.icon}</div>
                  <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </Card>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instruments Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for Your Instrument
            </h2>
            <p className="text-lg text-gray-600">
              AI-tuned diagnosis for guitar, piano, and vocals
            </p>
          </div>

          <Tabs defaultValue="guitar" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {instruments.map((instrument) => (
                <TabsTrigger key={instrument.value} value={instrument.value}>
                  {instrument.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="guitar">
              <Card className="p-8 bg-blue-50 border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Guitar Diagnostics
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span>Finger transition speed and smoothness</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span>Timing consistency across chord changes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span>Muting technique and string noise</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span>Pick attack and dynamic control</span>
                  </li>
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="piano">
              <Card className="p-8 bg-purple-50 border-purple-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Piano Diagnostics
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span>Hand positioning and ergonomics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span>Pedal timing and syncopation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span>Finger independence and dexterity gaps</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span>Dynamic balance between hands</span>
                  </li>
                </ul>
              </Card>
            </TabsContent>

            <TabsContent value="vocals">
              <Card className="p-8 bg-pink-50 border-pink-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Vocal Diagnostics
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0" />
                    <span>Pitch accuracy and vibrato consistency</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0" />
                    <span>Breath support and phrasing</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0" />
                    <span>Vocal tone and resonance control</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-pink-600 flex-shrink-0" />
                    <span>Tuning drift in sustained notes</span>
                  </li>
                </ul>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Simple, Affordable Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Way less than a single human coaching session
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden ${
                  tier.highlighted
                    ? "border-blue-400 border-2 shadow-lg"
                    : "border-gray-200"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 text-xs font-bold rounded-bl">
                    POPULAR
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">{tier.description}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      {tier.price}
                    </span>
                    <span className="text-gray-600">{tier.period}</span>
                  </div>

                  <Button
                    className={`w-full mb-6 ${
                      tier.highlighted
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "border-gray-300"
                    }`}
                    variant={tier.highlighted ? "default" : "outline"}
                  >
                    {tier.cta}
                  </Button>

                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-3 text-sm text-gray-700"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12 text-gray-600">
            <p>
              All plans include 7-day free trial. No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Break Through?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Get your first free AI diagnosis today. No credit card required. See exactly
            what is holding you back.
          </p>

          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-blue-300 bg-blue-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
            >
              Start Free
            </Button>
          </form>

          {submitted && (
            <p className="mt-4 text-white text-sm">
              Check your email for your first audit invite!
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-5 h-5 text-blue-400" />
                <span className="font-bold text-white">PracticeCoach AI</span>
              </div>
              <p className="text-sm">
                Your AI music coach that listens, diagnoses, and builds your
                breakthrough.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    How It Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>
              {new Date().getFullYear()} PracticeCoach AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;