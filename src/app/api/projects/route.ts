import { NextResponse } from "next/server";

import { projectCreateSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth-server";

export async function GET() {
  const userId =
    await getAuthenticatedUserId();

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
    const dbProjects =
      await prisma.project.findMany({
        where: {
          userId,
        },

        include: {
          tasks: {
            select: {
              status: true,
            },
          },
        },

        orderBy: {
          id: "asc",
        },
      });

    const projectsWithProgress =
      dbProjects.map((project) => {
        const completedTasks =
          project.tasks.filter(
            (task) =>
              task.status === "DONE"
          ).length;

        const progress =
          project.tasks.length === 0
            ? 0
            : Math.round(
                (completedTasks /
                  project.tasks.length) *
                  100
              );

        const {
          tasks,
          ...projectData
        } = project;

        return {
          ...projectData,
          progress,
        };
      });

    return NextResponse.json({
      success: true,
      data: projectsWithProgress,
    });
  } catch (error) {
    console.error(
      "Failed to fetch projects:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects",
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
  const userId =
    await getAuthenticatedUserId();

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

  const result =
    projectCreateSchema.safeParse(body);

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

  const {
    tasks: initialTasks,
    ...projectData
  } = result.data;

  try {
    const newProject =
      await prisma.project.create({
        data: {
          ...projectData,

          status: "ACTIVE",
          userId,

          tasks: {
            create: initialTasks.map(
              (task) => ({
                title: task.title,
                priority: task.priority,
                dueDate: new Date(
                  task.dueDate
                ),
                estimatedHours:
                  task.estimatedHours ??
                  null,
                status: "TODO",

                userId,
              })
            ),
          },
        },

        include: {
          tasks: true,
        },
      });

    return NextResponse.json(
      {
        success: true,

        data: {
          ...newProject,
          progress: 0,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Failed to create project:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to create project",
      },
      {
        status: 500,
      }
    );
  }
}