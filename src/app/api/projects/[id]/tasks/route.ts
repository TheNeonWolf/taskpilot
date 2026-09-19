import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DEV_USER_ID = 1;

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId: DEV_USER_ID
        }
      });

      if (!project) {
        return NextResponse.json(
          {
            success: false,
            error: "Project not found"
          },
          {
            status: 404
          }
        );
      }

      const projectTasks = await prisma.task.findMany({
        where: {
          projectId: projectId,
          userId: DEV_USER_ID
        },
        orderBy: {
          id: "asc"
        }
      });

      return NextResponse.json({
        success: true,
        data: projectTasks
      });
    } catch (error) {
      console.error("Failed to fetch project tasks:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch project tasks"
        },
        {
          status: 500
        }
      );
    }
}