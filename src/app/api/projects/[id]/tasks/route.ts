import { NextResponse } from "next/server";

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
  const projectId = Number(id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid project ID",
      },
      {
        status: 400,
      }
    );
  }

  try {
    // First make sure the project belongs
    // to the logged-in user.
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
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

    // Then get only that user's tasks
    // belonging to this project.
    const projectTasks = await prisma.task.findMany({
      where: {
        projectId,
        userId,
      },

      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: projectTasks,
    });
  } catch (error) {
    console.error(
      "Failed to fetch project tasks:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch project tasks",
      },
      {
        status: 500,
      }
    );
  }
}