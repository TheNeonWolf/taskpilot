import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getAuthenticatedUserId } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { Summary } from "lucide-react";

const CANDIDATE_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json(
      {
        error: "Invalid project ID"
      },
      {
        status: 400
      }
    );
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: { tasks: true }
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter((t) => t.status === "DONE").length;
  const inProgressTasks = project.tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const todoTasks = project.tasks.filter((t) => t.status === "TODO").length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured" },
      { status: 500 }
    )
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Generate a concise, professional 2 to 3 sentence status summary for the following project:
Project Name: "${project.name}"
Description: "${project.description}"
Overall Status: ${project.status}
Progress: ${progressPercent}% (${completedTasks} of ${totalTasks} tasks done)
Task Breakdown: ${todoTasks} To Do, ${inProgressTasks} In Progress, ${completedTasks} Done.
Task Titles & Statuses: ${project.tasks.map((t) => `${t.title} (${t.status})`).join(", ") || "No tasks added yet"}

Do not include formatting headers or bullet points. Provide raw plain text only.
  `;

  let lastError: Error | unknown = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt
      });

      if (response.text) {
        return NextResponse.json({
          success: true,
          summary: response.text.trim()
        });
      }
    } catch (err) {
      console.warn(`Summary generation failed for ${modelName}:`, err);
      lastError = err;
    }
  }

  return NextResponse.json(
    {
      error: "Failed to generate AI summary.",
      details: lastError instanceof Error ? lastError.message : "Unknown error"
    },
    { status: 503 }
  );
}