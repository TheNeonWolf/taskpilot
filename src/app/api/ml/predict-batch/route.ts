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
    const { tasks } = body;

    if (!Array.isArray(tasks)) {
      return NextResponse.json({ error: "Tasks must be an array" }, { status: 400 });
    }

    const activeTaskCount = await prisma.task.count({
      where: {
        userId,
        status: { in: ["TODO", "IN_PROGRESS"] },
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updatedTasks = await Promise.all(
      tasks.map(async (task) => {
        let daysUntilDue = 3;
        if (task.dueDate) {
          const due = new Date(task.dueDate);
          due.setHours(0, 0, 0, 0);
          const diffTime = due.getTime() - today.getTime();
          daysUntilDue = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        }

        const estHours = Number(task.estimatedHours) || 2;

        try {
          const mlRes = await fetch("http://127.0.0.1:8000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              daysUntilDue,
              estimatedHours: estHours,
              activeTaskCount,
            }),
          });

          if (mlRes.ok) {
            const mlData = await mlRes.json();
            return {
              ...task,
              priority: mlData.suggestedPriority || "MEDIUM",
            };
          }
        } catch (err) {
          console.error("ML server unreachable, defaulting to MEDIUM:", err);
        }

        return { ...task, priority: "MEDIUM" };
      })
    );

    return NextResponse.json({ success: true, tasks: updatedTasks });
  } catch (error) {
    console.error("Batch ML prediction error:", error);
    return NextResponse.json({ error: "Failed to process predictions" }, { status: 500 });
  }
}
