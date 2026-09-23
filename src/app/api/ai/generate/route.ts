import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { getAuthenticatedUserId } from "@/lib/auth-server";
import {
  aiGenerateInputSchema,
  generatedTaskSchema,
  generatedProjectSchema,
} from "@/lib/validations";

// Supported 3.x Flash models
const CANDIDATE_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
];

// Gemini SDK JSON Schemas using Type enums
const taskResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Actionable title of the task" },
    priority: {
      type: Type.STRING,
      enum: ["LOW", "MEDIUM", "HIGH"],
      description: "Priority based on urgency",
    },
    dueDate: {
      type: Type.STRING,
      description: "Due date in YYYY-MM-DD format based on context",
    },
    estimatedHours: {
      type: Type.NUMBER,
      description: "Estimated completion time in hours",
    },
  },
  required: ["title", "priority", "dueDate"],
};

const projectResponseSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Short descriptive project name" },
    description: { type: Type.STRING, description: "Detailed overview of the project" },
    tasks: {
      type: Type.ARRAY,
      items: taskResponseSchema,
      description: "List of subtasks needed for this project",
    },
  },
  required: ["name", "description", "tasks"],
};

export async function POST(request: Request) {
  // 1. Authenticate user
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Validate input request body
  const body = await request.json().catch(() => null);
  const parsedInput = aiGenerateInputSchema.safeParse(body);
  if (!parsedInput.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsedInput.error.format() },
      { status: 400 }
    );
  }

  const { prompt, type } = parsedInput.data;

  // 3. Check Gemini API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const ai = new GoogleGenAI({ apiKey });
  const todayStr = new Date().toISOString().split("T")[0];

  const systemInstruction = `
You are TaskPilot AI, an intelligent project management assistant.
Current Date: ${todayStr}.
Parse the user's natural language request into a structured JSON representation for a ${type}.
- Assume realistic due dates relative to today (${todayStr}) if days of the week (e.g. "by Friday") or relative times (e.g. "in 3 days") are mentioned.
- Priority must strictly be LOW, MEDIUM, or HIGH.
- Respond with pure valid JSON matching the schema.
  `;

  const selectedSchema = type === "task" ? taskResponseSchema : projectResponseSchema;
  let lastError: Error | unknown = null;

  // 4. Try models sequentially
  for (const modelName of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: selectedSchema,
          temperature: 0.2,
        },
      });

      if (response.text) {
        const jsonOutput = JSON.parse(response.text);

        // 5. Validate output structure using Zod schemas from validations.ts
        if (type === "task") {
          const validatedTask = generatedTaskSchema.parse(jsonOutput);
          return NextResponse.json({
            success: true,
            type: "task",
            modelUsed: modelName,
            data: validatedTask,
          });
        } else {
          const validatedProject = generatedProjectSchema.parse(jsonOutput);
          return NextResponse.json({
            success: true,
            type: "project",
            modelUsed: modelName,
            data: validatedProject,
          });
        }
      }
    } catch (err) {
      console.warn(`Model ${modelName} failed during generation:`, err);
      lastError = err;
      await new Promise((res) => setTimeout(res, 500));
    }
  }

  return NextResponse.json(
    {
      error: "AI Generation failed. Please try again in a moment.",
      details: lastError instanceof Error ? lastError.message : "Generation failure",
    },
    { status: 503 }
  );
}