import { prisma } from "@/lib/prisma";

export async function syncProjectStatus(
  projectId: number,
  userId: number
) {
  const tasks = await prisma.task.findMany({
    where: {
      projectId,
      userId,
    },

    select: {
      status: true,
    },
  });

  const allTasksCompleted =
    tasks.length > 0 &&
    tasks.every(
      (task) => task.status === "DONE"
    );

  const status = allTasksCompleted
    ? "COMPLETED"
    : "ACTIVE";

  await prisma.project.updateMany({
    where: {
      id: projectId,
      userId,
    },

    data: {
      status,
    },
  });

  return status;
}