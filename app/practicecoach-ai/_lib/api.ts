const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Unknown error" }));
    const message = error.detail || error.message || "API error";
    if (res.status === 403 && message === "email_not_verified") {
      throw new Error("email_not_verified");
    }
    throw new Error(message);
  }
  return res.json();
}

export const authApi = {
  register: (email: string, password: string, display_name?: string) =>
    apiFetch<{ id: string; email: string; display_name: string | null; created_at: string }>(
      "/api/auth/register",
      { method: "POST", body: JSON.stringify({ email, password, display_name: display_name || null }) }
    ),
  login: (email: string, password: string) =>
    apiFetch<{ id: string; email: string; display_name: string | null; created_at: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  logout: () => apiFetch<{ status: string }>("/api/auth/logout", { method: "POST" }),
  me: () =>
    apiFetch<{ id: string; email: string; display_name: string | null; instrument_preference: string | null; created_at: string }>(
      "/api/auth/me"
    ),
  subscription: () =>
    apiFetch<{ tier: "free" | "coach" | "pro"; status: "active" | "inactive" | "canceled"; current_period_end: string | null }>(
      "/api/auth/subscription"
    ),
  resetPassword: (email: string) => apiFetch<{ status: string }>("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ email }) }),
  resendVerification: (email: string) =>
    apiFetch<{ status: string }>("/api/auth/resend-verification", { method: "POST", body: JSON.stringify({ email }) }),
};

export const analysisApi = {
  analyze: (file: File, instrument: "guitar" | "piano" | "vocals") => {
    const formData = new FormData();
    formData.append("file", file);
    return apiFetch<{
      session_id: string;
      diagnosis: Array<{ weakness: string; explanation: string; severity: "low" | "medium" | "high" }>;
      drill: Array<{ name: string; goal: string; duration_mins: number; instructions: string[] }>;
      quality_check_passed: boolean;
      message: string | null;
    }>(`/api/analyze?instrument=${instrument}`, {
      method: "POST",
      body: formData,
      headers: { "Content-Type": undefined as any },
    });
  },
};

export const sessionApi = {
  list: () =>
    apiFetch<
      Array<{
        id: string;
        instrument: "guitar" | "piano" | "vocals";
        weakness_tags: string | null;
        created_at: string;
      }>
    >("/api/sessions"),
  get: (sessionId: string) =>
    apiFetch<{
      id: string;
      instrument: "guitar" | "piano" | "vocals";
      audio_duration_secs: number | null;
      quality_check_passed: boolean;
      diagnosis: Array<{ weakness: string; explanation: string; severity: "low" | "medium" | "high" }>;
      drill: Array<{ name: string; goal: string; duration_mins: number; instructions: string[] }>;
      created_at: string;
    }>(`/api/sessions/${sessionId}`),
  getAudio: (sessionId: string) => apiFetch<{ url: string }>(`/api/sessions/${sessionId}/audio`),
};

export const paymentApi = {
  checkout: (tier: "coach" | "pro") => apiFetch<{ checkout_url: string }>(`/api/payments/checkout?tier=${tier}`, { method: "POST" }),
  verifyTransaction: (transaction_id: string) =>
    apiFetch<{ status: string; tier: "coach" | "pro" }>("/api/payments/verify-transaction", {
      method: "POST",
      body: JSON.stringify({ transaction_id }),
    }),
  cancel: () => apiFetch<{ status: string }>("/api/payments/cancel", { method: "PUT" }),
  report: () => apiFetch<{ report_text: string; generated_at: string }>("/api/progress/report"),
};
