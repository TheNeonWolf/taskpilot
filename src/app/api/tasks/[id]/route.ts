import { NextResponse } from "next/server";
import { taskUpdateSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

const DEV_USER_ID = 1;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const taskId = Number(id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid task ID",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: DEV_USER_ID,
      },
    });

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          error: "Task not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Failed to fetch task:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch task",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const taskId = Number(id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid task ID",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: DEV_USER_ID,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        {
          success: false,
          error: "Task not found",
        },
        {
          status: 404,
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

    const result = taskUpdateSchema.safeParse(body);

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

    if (
      result.data.projectId !== undefined &&
      result.data.projectId !== null
    ) {
      const project = await prisma.project.findFirst({
        where: {
          id: result.data.projectId,
          userId: DEV_USER_ID,
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

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: result.data.title,
        status: result.data.status,
        priority: result.data.priority,

        dueDate:
          result.data.dueDate !== undefined
            ? new Date(result.data.dueDate)
            : undefined,
        
        estimatedHours: result.data.estimatedHours,

        projectId: result.data.projectId,
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    console.error("Failed to update task:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update task",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const taskId = Number(id);

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid task ID",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: DEV_USER_ID,
      },
    });

    if (!existingTask) {
      return NextResponse.json(
        {
          success: false,
          error: "Task not found",
        },
        {
          status: 404,
        }
      );
    }

    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return NextResponse.json({
      success: true,
      data: deletedTask,
    });
  } catch (error) {
    console.error("Failed to delete task:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete task",
      },
      {
        status: 500,
      }
    );
  }
}