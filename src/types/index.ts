export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type ProjectStatus = "ACTIVE" | "COMPLETED";

export type Project = {
    id: number;
    name: string;
    description: string;
    progress: number;
    status: ProjectStatus;
};

export type Task = {
    id: number;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
};