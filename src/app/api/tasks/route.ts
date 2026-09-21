import { NextResponse } from "next/server";
import { syncProjectStatus } from "@/lib/project-status";
import { taskCreateSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth-server";

export async function GET() {
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

  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
      },

      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    console.error(
      "Failed to fetch tasks:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tasks",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
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

  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON body",
      },
      {
        status: 400,
      }
    );
  }

  const result = taskCreateSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.error.issues,
      },
      {
        status: 400,
      }
    );
  }

  try {
    if (result.data.projectId !== undefined) {
      const project =
        await prisma.project.findFirst({
          where: {
            id: result.data.projectId,
            userId,
          },
        });

      if (!project) {
        return NextResponse.json(
          {
            success: false,
            error: "Project not found",
          },
          {
            status: 404,
          }
        );
      }
    }

    const newTask = await prisma.task.create({
      data: {
        title: result.data.title,
        priority: result.data.priority,
        dueDate: new Date(
          result.data.dueDate
        ),

        estimatedHours: result.data.estimatedHours ?? null,
        status: "TODO",
        userId,
        projectId: result.data.projectId ?? null,
      },
    });

    if (newTask.projectId !== null) {
      await syncProjectStatus(
        newTask.projectId,
        userId
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: newTask,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Failed to create task:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create task",
      },
      {
        status: 500,
      }
    );
  }
}