import { NextResponse } from "next/server";
import { projects, tasks } from "@/data/mockData";
import { projectCreateSchema } from "@/lib/validations";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: projects,
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

  const result = projectCreateSchema.safeParse(body);

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

  const newProject = {
    id: Math.max(...projects.map((project) => project.id), 0) + 1,
    ...projectData,
    progress: 0,
  };

  projects.push(newProject);

  const nextTaskId =
    Math.max(...tasks.map((task) => task.id), 0) + 1;

  const createdTasks = initialTasks.map(
    (task, index) => ({
      id: nextTaskId + index,
      projectId: newProject.id,
      ...task,
      status: "TODO" as const,
    })
  );

  tasks.push(...createdTasks);

  return NextResponse.json(
    {
      success: true,
      data: {
        ...newProject,
        tasks: createdTasks,
      },
    },
    {
      status: 201,
    }
  );
}