import { Project, Task } from "@/types";

export const projects: Project[] = [
  {
    id: 1,
    name: "Portfolio Website",
    description: "Build a personal developer portfolio",
    progress: 75,
    status: "ACTIVE"
  },
  {
    id: 2,
    name: "E-Commerce Platform",
    description: "Create a full-stack online store",
    progress: 100,
    status: "COMPLETED"
  },
  {
    id: 3,
    name: "Study Planner",
    description: "Plan and track university coursework",
    progress: 60,
    status: "ACTIVE"
  },
  {
    id: 4,
    name: "Fitness Tracker",
    description: "Track workouts and fitness goals",
    progress: 30,
    status: "ACTIVE"
  },
];

export const tasks: Task[] = [
  {
    id: 1,
    title: "Design dashboard layout",
    status: "DONE",
    priority: "HIGH",
    dueDate: "2026-09-06",
  },
  {
    id: 2,
    title: "Build navigation bar",
    status: "DONE",
    priority: "MEDIUM",
    dueDate: "2026-09-07",
  },
  {
    id: 3,
    title: "Create project cards",
    status: "IN_PROGRESS",
    priority: "HIGH",
    dueDate: "2026-09-09",
  },
  {
    id: 4,
    title: "Add task filtering",
    status: "TODO",
    priority: "MEDIUM",
    dueDate: "2026-09-11",
  },
  {
    id: 5,
    title: "Create responsive mobile layout",
    status: "TODO",
    priority: "HIGH",
    dueDate: "2026-09-13",
  },
  {
    id: 6,
    title: "Add loading states",
    status: "IN_PROGRESS",
    priority: "LOW",
    dueDate: "2026-09-14",
  },
  {
    id: 7,
    title: "Add empty states",
    status: "DONE",
    priority: "LOW",
    dueDate: "2026-09-15",
  },
  {
    id: 8,
    title: "Polish dashboard styling",
    status: "DONE",
    priority: "MEDIUM",
    dueDate: "2026-09-16",
  },
];