/**
 * Server-side AI: OpenAI (ChatGPT) or Gemini. No API key on client.
 * Prefers OPENAI_API_KEY if set; otherwise uses Gemini.
 */

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const MODELS_TO_TRY = [
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-002",
  "gemini-1.5-pro",
  "gemini-pro",
];

function parseRetryAfterSeconds(message: string): number {
  const match = message.match(/retry in (\d+(?:\.\d+)?)\s*s/i);
  if (match) return Math.min(90, Math.ceil(parseFloat(match[1])));
  return 60;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function getOpenAIKey(): string | null {
  return process.env.OPENAI_API_KEY || null;
}

function getGeminiKey(): string | null {
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY ||
    null
  );
}

function isConfigured(): boolean {
  return Boolean(getOpenAIKey() || getGeminiKey());
}

export async function POST(req: Request) {
  let body: { prompt?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = body?.prompt;
  if (typeof prompt !== "string" || !prompt.trim()) {
    return Response.json({ error: "Missing or empty prompt" }, { status: 400 });
  }

  const text = prompt.trim();

  // Prefer OpenAI (ChatGPT) when API key is set
  const openAIKey = getOpenAIKey();
  if (openAIKey) {
    try {
      const res = await fetch(OPENAI_CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openAIKey}`,
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          messages: [{ role: "user", content: text }],
          max_tokens: 8192,
          temperature: 1,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = data?.error?.message ?? data?.error ?? res.statusText;
        if (res.status === 429) {
          return Response.json(
            { error: "RATE_LIMIT", message: msg, retryAfterSeconds: 60 },
            { status: 429 }
          );
        }
        return Response.json({ error: msg }, { status: res.status });
      }

      const content = data?.choices?.[0]?.message?.content ?? "";
      return Response.json({ text: typeof content === "string" ? content.trim() || "(No content)" : "(No content)" });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return Response.json({ error: message }, { status: 500 });
    }
  }

  // Fallback: Gemini
  const apiKey = getGeminiKey();
  if (!apiKey) {
    return Response.json(
      { error: "Add OPENAI_API_KEY or GEMINI_API_KEY (or GOOGLE_GEMINI_API_KEY) to .env.local." },
      { status: 500 }
    );
  }

  const requestBody = {
    contents: [{ role: "user", parts: [{ text }] }],
    generationConfig: {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "text/plain",
    },
  };

  let lastError: string = "";
  for (const model of MODELS_TO_TRY) {
    try {
      const res = await fetch(
        `${GEMINI_BASE}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        lastError = data?.error?.message || res.statusText || String(res.status);
        if (res.status === 404) continue;
        // 429 = rate limit: wait and retry this model once before failing
        if (res.status === 429) {
          const waitSec = parseRetryAfterSeconds(lastError);
          await sleep(waitSec * 1000);
          const retryRes = await fetch(
            `${GEMINI_BASE}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody),
            }
          );
          const retryData = await retryRes.json().catch(() => ({}));
          if (retryRes.ok) {
            const text = retryData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
            return Response.json({ text: text.trim() || "(No content)" });
          }
          const retryErr = retryData?.error?.message || lastError;
          return Response.json(
            { error: "RATE_LIMIT", message: retryErr, retryAfterSeconds: waitSec },
            { status: 429 }
          );
        }
        return Response.json(
          { error: lastError },
          { status: res.status }
        );
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      return Response.json({ text: text.trim() || "(No content)" });
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      continue;
    }
  }

  return Response.json(
    {
      error: "No model available",
      detail: "Tried: " + MODELS_TO_TRY.join(", ") + ". " + (lastError || "Check your API key and quota."),
    },
    { status: 503 }
  );
}

export async function GET() {
  return Response.json({ configured: isConfigured() });
}
