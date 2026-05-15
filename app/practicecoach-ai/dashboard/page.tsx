"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { sessionApi, paymentApi } from "@/_lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Download } from "lucide-react";

interface Session {
  id: string;
  instrument: "guitar" | "piano" | "vocals";
  weakness_tags: string | null;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState<"free" | "coach" | "pro" | null>(null);
  const [downloadingReport, setDownloadingReport] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sessionData, subResp] = await Promise.all([
          sessionApi.list(),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/subscription`, {
            credentials: "include",
          }).then((r) => r.json()),
        ]);

        setSessions(sessionData);
        setTier(subResp.tier || "free");
      } catch (err) {
        console.error("Failed to load dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const downloadReport = async () => {
    if (tier !== "pro") return;
    setDownloadingReport(true);
    try {
      const report = await paymentApi.report();
      const element = document.createElement("a");
      element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(report.report_text));
      element.setAttribute("download", `progress_report_${new Date().toISOString().split("T")[0]}.txt`);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      console.error("Failed to download report", err);
    } finally {
      setDownloadingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-white mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white mb-2">Session History</h1>
        <p className="text-gray-400 mb-8">
          {tier === "free" ? "Last 7 days" : tier === "coach" ? "Last 30 days" : "All sessions"} • {sessions.length} total
        </p>

        <div className="grid gap-6">
          {tier === "pro" && (
            <Card className="bg-purple-950 border-purple-800">
              <CardHeader>
                <CardTitle className="text-white">Progress Report</CardTitle>
                <CardDescription>Download your personalized skill trajectory report</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={downloadReport}
                  disabled={downloadingReport}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadingReport ? "Generating..." : "Download Report"}
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">All Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">No sessions recorded yet</p>
                  <Button
                    onClick={() => router.push("/practicecoach-ai/analyze")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Start Your First Analysis
                  </Button>
                </div>
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
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-medium capitalize">{session.instrument}</p>
                            <Badge className="bg-gray-700">{new Date(session.created_at).toLocaleDateString()}</Badge>
                          </div>
                          {session.weakness_tags && (
                            <p className="text-gray-400 text-sm">{session.weakness_tags.split(";").join(", ")}</p>
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
        </div>
      </div>
    </div>
  );
}
