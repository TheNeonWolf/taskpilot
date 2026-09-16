import { NextResponse } from "next/server";
import { projects, tasks } from "@/data/mockData";

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

    const project = projects.find(
        (project) => project.id === projectId
    )

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

    const projectTasks = tasks.filter(
        (task) => task.projectId === projectId
    );

    return NextResponse.json({
        success: true,
        data: projectTasks
    });
}