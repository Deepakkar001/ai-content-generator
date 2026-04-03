/**
 * Client: calls our server /api/generate-content. No API key on client.
 * Server tries multiple Gemini models and returns the first successful result.
 */

export async function isGeminiConfigured(): Promise<boolean> {
  try {
    const res = await fetch("/api/generate-content", { method: "GET" });
    const data = await res.json().catch(() => ({}));
    return Boolean(data?.configured);
  } catch {
    return false;
  }
}

export async function generateContent(prompt: string): Promise<string> {
  const res = await fetch("/api/generate-content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.error ?? data?.detail ?? data?.message ?? res.statusText;
    const err = new Error(typeof msg === "string" ? msg : "Request failed");
    (err as any).status = res.status;
    (err as any).isRateLimit = res.status === 429;
    (err as any).retryAfterSeconds = typeof data?.retryAfterSeconds === "number" ? data.retryAfterSeconds : null;
    throw err;
  }

  return typeof data?.text === "string" ? data.text : "";
}
