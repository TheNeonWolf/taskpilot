import { NextResponse } from "next/server";

import { syncProjectStatus } from "@/lib/project-status";
import { taskUpdateSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth-server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
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
        userId,
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
    console.error(
      "Failed to fetch task:",
      error
    );

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
    const existingTask =
      await prisma.task.findFirst({
        where: {
          id: taskId,
          userId,
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
    
    const previousProjectId = existingTask.projectId;

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

    const result =
      taskUpdateSchema.safeParse(body);

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

    // If moving/linking the task to a project,
    // make sure the project belongs to this user.
    if (
      result.data.projectId !== undefined &&
      result.data.projectId !== null
    ) {
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

    const updatedTask =
      await prisma.task.update({
        where: {
          id: taskId,
        },

        data: {
          title: result.data.title,
          status: result.data.status,
          priority: result.data.priority,

          dueDate:
            result.data.dueDate !== undefined
              ? new Date(
                  result.data.dueDate
                )
              : undefined,

          estimatedHours:
            result.data.estimatedHours,

          projectId:
            result.data.projectId,
        },
      });

    // Recalculate the status of the project
    // the task previously belonged to.
    //
    // This also handles normal status changes
    // such as TODO -> DONE while staying in
    // the same project.
    if (previousProjectId !== null) {
      await syncProjectStatus(
        previousProjectId,
        userId
      );
    }

    // If the task was moved to a different
    // project, also recalculate the new project.
    if (
      updatedTask.projectId !== null &&
      updatedTask.projectId !==
        previousProjectId
    ) {
      await syncProjectStatus(
        updatedTask.projectId,
        userId
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTask,
    });
  } catch (error) {
    console.error(
      "Failed to update task:",
      error
    );

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
    // Make sure the task belongs
    // to the logged-in user.
    const existingTask =
      await prisma.task.findFirst({
        where: {
          id: taskId,
          userId,
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

    const projectId =
      existingTask.projectId;

    const deletedTask =
      await prisma.task.delete({
        where: {
          id: taskId,
        },
      });

    // Recalculate the project after deletion.
    if (projectId !== null) {
      await syncProjectStatus(
        projectId,
        userId
      );
    }

    return NextResponse.json({
      success: true,
      data: deletedTask,
    });
  } catch (error) {
    console.error(
      "Failed to delete task:",
      error
    );

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