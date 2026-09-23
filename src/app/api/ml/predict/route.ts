import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { dueDate, estimatedHours } = body;

    if (!dueDate) {
      return NextResponse.json(
        { error: "Due date is required for priority prediction" },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const daysUntilDue = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const activeTaskCount = await prisma.task.count({
      where: {
        userId,
        status: { in: ["TODO", "IN_PROGRESS"] },
      },
    });

    const mlResponse = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        daysUntilDue,
        estimatedHours: Number(estimatedHours) || 1,
        activeTaskCount,
      }),
    });

    if (!mlResponse.ok) {
      throw new Error("ML service returned an error");
    }

    const mlData = await mlResponse.json();

    return NextResponse.json({
      success: true,
      suggestedPriority: mlData.suggestedPriority,
      features: {
        daysUntilDue,
        estimatedHours: Number(estimatedHours) || 1,
        activeTaskCount,
      },
    });
  } catch (error) {
    console.error("ML Prediction Error:", error);
    return NextResponse.json(
      {
        success: false,
        suggestedPriority: "MEDIUM",
        message: "ML Service unreachable, using default priority.",
      },
      { status: 200 }
    );
  }
}