import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Gemini API usage follows @google/generative-ai SDK:
 * https://ai.google.dev/gemini-api/docs — getGenerativeModel → startChat → sendMessage(string).
 * Each generation uses a new chat session (history: []) so requests are independent and token usage is minimal.
 */

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY);
}

export function getChatSession() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY is not defined. Add it to .env.local (see .env.example). Get a key at https://aistudio.google.com/apikey"
    );
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  // Default: gemini-2.0-flash (works with Google AI Studio keys). Override with NEXT_PUBLIC_GEMINI_MODEL if needed.
  const modelId = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-2.0-flash";
  const model = genAI.getGenerativeModel({ model: modelId });
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseModalities: [] as string[],
    responseMimeType: "text/plain",
  };
  return model.startChat({ generationConfig, history: [] });
}

  
