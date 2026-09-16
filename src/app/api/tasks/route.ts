import { NextResponse } from "next/server";
import { projects, tasks } from "@/data/mockData";
import { taskCreateSchema } from "@/lib/validations";
import { updateProjectProgress } from "@/lib/projectProgress";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: tasks,
  });
}

export async function POST(request: Request) {
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

  if (result.data.projectId !== undefined) {
    const projectExists = projects.some(
      (project) => project.id === result.data.projectId
    );

    if (!projectExists) {
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

  const newTask = {
    id: Math.max(...tasks.map((task) => task.id), 0) + 1,
    ...result.data,
    status: "TODO" as const,
  };

  tasks.push(newTask);

  if (newTask.projectId !== undefined) {
    updateProjectProgress(newTask.projectId);
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
}