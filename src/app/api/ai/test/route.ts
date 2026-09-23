import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getAuthenticatedUserId } from "@/lib/auth-server";

// Fallback models in priority order
const CANDIDATE_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
  "gemini-1.5-flash",
];

export async function POST() {
  // 1. Authenticate user
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Check API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  let lastError: Error | unknown = null;

  // 3. Try models sequentially if one is overloaded or unavailable
  for (const modelName of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: "Reply with JSON: {\"status\": \"ok\", \"message\": \"TaskPilot Gemini connection active\"}",
      });

      if (response.text) {
        return NextResponse.json({
          success: true,
          modelUsed: modelName,
          rawOutput: response.text,
        });
      }
    } catch (err) {
      console.warn(`Model ${modelName} failed/overloaded:`, err);
      lastError = err;
      // Brief delay before trying the next fallback
      await new Promise((res) => setTimeout(res, 500));
    }
  }

  return NextResponse.json(
    {
      error: "All Gemini models are currently busy or unavailable. Please try again in a few moments.",
      details: lastError instanceof Error ? lastError.message : "High demand",
    },
    { status: 503 }
  );
}