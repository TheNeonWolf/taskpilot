import { NextResponse } from "next/server";
import { projects, tasks } from "@/data/mockData";
import { projectUpdateSchema } from "@/lib/validations";

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
        project => project.id === projectId
    );

    if(!project) {
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

    return NextResponse.json(
        {
            success: true,
            data: project
        }
    );
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

    const project = projects.find(
        (project) => project.id === projectId
    );

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

    let body;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
        {
            success: false,
            error: "Invalid JSON body"
        },
        {
            status: 400
        }
        );
    }

    const result = projectUpdateSchema.safeParse(body);

    if (!result.success) {
        return NextResponse.json(
            {
                success: false,
                error: result.error.issues
            },
            {
                status: 400
            }
        );
    }

    if (result.data.name !== undefined) {
        project.name = result.data.name;
    }

    if (result.data.description !== undefined) {
        project.description = result.data.description;
    }

    if (result.data.status !== undefined) {
        project.status = result.data.status;
    }

    return NextResponse.json({
        success: true,
        data: project
    });
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
                error: "Invalid project ID"
            },
            {
                status: 400
            }
        );
    }

    const projectIndex = projects.findIndex(
        (project) => project.id === projectId
    );

    if (projectIndex === -1) {
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

    for (let i = tasks.length -1; i >= 0; i--) {
        if (tasks[i].projectId === projectId) {
            tasks.splice(i, 1);
        }
    }

    const deletedProject = projects.splice(projectIndex, 1)[0];

    return NextResponse.json({
        success: true,
        data: deletedProject
    })
}

