export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type Project = {
    id: number;
    name: string;
    description: string;
    progress: number;
};

export type Task = {
    id: number;
    title: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
};