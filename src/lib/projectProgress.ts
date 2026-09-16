import { projects, tasks } from "@/data/mockData";

export function updateProjectProgress(projectId: number) {
    const project = projects.find(
        (project) => project.id === projectId
    );

    if (!project) {
        return;
    }

    const projectTasks = tasks.filter(
        (task) => task.projectId === projectId
    );

    if (projectTasks.length === 0) {
        project.progress = 0;
        return;
    }

    const completedTasks = projectTasks.filter(
        (tasks) => tasks.status === "DONE"
    );

    project.progress = Math.round(
        (completedTasks.length / projectTasks.length) * 100
    );
}