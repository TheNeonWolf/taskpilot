import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getAuthenticatedUserId } from "@/lib/auth-server";

export async function POST() {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        error: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Gemini API key is not configured",
      },
      {
        status: 500,
      }
    );
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
    });

    const interaction =
      await ai.interactions.create({
        model: "gemini-3.8-flash",

        input:
          "Reply with exactly: TaskPilot Gemini connection successful!",
      });

    return NextResponse.json({
      success: true,
      data: {
        message:
          interaction.output_text,
      },
    });
  } catch (error) {
    console.error(
      "Gemini test failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to communicate with Gemini",
      },
      {
        status: 500,
      }
    );
  }
}