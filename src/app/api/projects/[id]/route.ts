import { NextResponse } from "next/server";
import { projectUpdateSchema } from "@/lib/validations";
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
        userId: DEV_USER_ID,
      },
      include: {
        tasks: {
          select: {
            status: true,
          },
        },
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

    const completedTasks = project.tasks.filter(
      (task) => task.status === "DONE"
    ).length;

    const progress =
      project.tasks.length === 0
        ? 0
        : Math.round(
            (completedTasks / project.tasks.length) * 100
          );

    const { tasks, ...projectData } = project;

    return NextResponse.json({
      success: true,
      data: {
        ...projectData,
        progress,
      },
    });
  } catch (error) {
    console.error("Failed to fetch project:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch project",
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
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: DEV_USER_ID,
      },
    });

    if (!existingProject) {
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

    const result = projectUpdateSchema.safeParse(body);

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

    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data: result.data,
      include: {
        tasks: {
          select: {
            status: true,
          },
        },
      },
    });

    const completedTasks = updatedProject.tasks.filter(
      (task) => task.status === "DONE"
    ).length;

    const progress =
      updatedProject.tasks.length === 0
        ? 0
        : Math.round(
            (completedTasks / updatedProject.tasks.length) * 100
          );

    const { tasks, ...projectData } = updatedProject;

    return NextResponse.json({
      success: true,
      data: {
        ...projectData,
        progress,
      },
    });
  } catch (error) {
    console.error("Failed to update project:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update project",
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
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: DEV_USER_ID,
      },
      include: {
        tasks: {
          select: {
            status: true,
          },
        },
      },
    });

    if (!existingProject) {
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

    const completedTasks = existingProject.tasks.filter(
      (task) => task.status === "DONE"
    ).length;

    const progress =
      existingProject.tasks.length === 0
        ? 0
        : Math.round(
            (completedTasks / existingProject.tasks.length) * 100
          );

    const deletedProject = await prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...deletedProject,
        progress,
      },
    });
  } catch (error) {
    console.error("Failed to delete project:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete project",
      },
      {
        status: 500,
      }
    );
  }
}

