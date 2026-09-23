import { NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { dueDate, estimatedHours, actualPriority } = await request.json();

    if (!dueDate || !actualPriority) {
      return NextResponse.json({ success: false, message: "Incomplete feedback data" });
    }

    const activeTaskCount = await prisma.task.count({
      where: {
        userId,
        status: { in: ["TODO", "IN_PROGRESS"] },
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    const daysUntilDue = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const pyResponse = await fetch("http://127.0.0.1:8000/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        daysUntilDue,
        estimatedHours: Number(estimatedHours) || 2,
        activeTaskCount,
        actualPriority,
      }),
    });

    if (!pyResponse.ok) {
      throw new Error("Python ML server returned an error on feedback");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ML Feedback route error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}