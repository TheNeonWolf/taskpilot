import { NextResponse } from "next/server";
import { projects, tasks } from "@/data/mockData";
import { taskUpdateSchema } from "@/lib/validations";
import { updateProjectProgress } from "@/lib/projectProgress";

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
        error: "Invalid project ID",
      },
      {
        status: 400,
      }
    );
  }

  const task = tasks.find(
    (task) => task.id === taskId
  );

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
        error: "Invalid project ID",
      },
      {
        status: 400,
      }
    );
  }

  const task = tasks.find(
    (task) => task.id === taskId
  );

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

  const previousProjectId = task.projectId;

  if (result.data.title !== undefined) {
    task.title = result.data.title;
  }

  if (result.data.status !== undefined) {
    task.status = result.data.status;
  }

  if (result.data.priority !== undefined) {
    task.priority = result.data.priority;
  }

  if (result.data.dueDate !== undefined) {
    task.dueDate = result.data.dueDate;
  }

  if (result.data.projectId === null) {
    delete task.projectId;
  } else if (result.data.projectId !== undefined) {
    task.projectId = result.data.projectId;
  }

  if (previousProjectId !== undefined) {
    updateProjectProgress(previousProjectId);
  }

  if (
    task.projectId !== undefined &&
    task.projectId !== previousProjectId
  ) {
    updateProjectProgress(task.projectId);
  }

  return NextResponse.json({
    success: true,
    data: task,
  });
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
        error: "Invalid project ID",
      },
      {
        status: 400,
      }
    );
  }

  const taskIndex = tasks.findIndex(
    (task) => task.id === taskId
  );

  if (taskIndex === -1) {
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

  const deletedTask = tasks.splice(taskIndex, 1)[0];

  if (deletedTask.projectId !== undefined) {
    updateProjectProgress(deletedTask.projectId);
  }

  return NextResponse.json({
    success: true,
    data: deletedTask,
  });
}