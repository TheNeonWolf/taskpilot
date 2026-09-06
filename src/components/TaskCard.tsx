"use client"

import { Task,
    TaskPriority,
    TaskStatus
 } from "@/types";
 import { Trash2 } from "lucide-react";

type TaskCardProps = {
  task: Task;
  searchQuery?: string;
  onStatusChange?: (
    taskId: number,
    status: TaskStatus
  ) => void;
  onPriorityChange?: (
    taskId: number,
    priority: TaskPriority
  ) => void;
  onDelete?: (task: Task) => void;
};

function highlightMatch(text: string, query: string) {
  if (!query.trim()) {
    return text;
  }

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");

  return text.split(regex).map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span
        key={index}
        className="font-semibold text-green-600 underline decoration-2 underline-offset-2"
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function TaskCard({ task, searchQuery = "", onStatusChange, onPriorityChange, onDelete }: TaskCardProps) {
  
    const getNextStatus = (): TaskStatus => {
        if (task.status === "TODO") {
            return "IN_PROGRESS";
        }

        if (task.status === "IN_PROGRESS") {
            return "DONE";
        }

        return "TODO";
        };

        const getNextPriority = (): TaskPriority => {
        if (task.priority === "LOW") {
            return "MEDIUM";
        }

        if (task.priority === "MEDIUM") {
            return "HIGH";
        }

        return "LOW";
    };

    return (
        <div
            className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition ${
                task.status === "DONE"
                ? "opacity-50"
                : "opacity-100"
            }`}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h3
                        className={`font-semibold text-gray-900 ${
                            task.status === "DONE"
                            ? "line-through"
                            : ""
                        }`}
                        >
                        {highlightMatch(task.title, searchQuery)}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        Due: {task.dueDate}
                    </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                    {onStatusChange ? (
                        <button
                            type="button"
                            onClick={() =>
                                onStatusChange(task.id, getNextStatus())
                            }
                            title="Click to change status"
                            className={`rounded-full px-3 py-1 text-xs font-medium transition hover:scale-105 ${
                                task.status === "DONE"
                                    ? "bg-green-100 text-green-700"
                                    : task.status === "IN_PROGRESS"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {task.status.replace("_", " ")}
                        </button>
                    ) : (
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                task.status === "DONE"
                                    ? "bg-green-100 text-green-700"
                                    : task.status === "IN_PROGRESS"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {task.status.replace("_", " ")}
                        </span>
                    )}

                    {onPriorityChange ? (
                        <button
                            type="button"
                            onClick={() =>
                                onPriorityChange(task.id, getNextPriority())
                            }
                            title="Click to change priority"
                            className={`rounded-full px-3 py-1 text-xs font-medium transition hover:scale-105 ${
                                task.priority === "HIGH"
                                    ? "bg-red-100 text-red-700"
                                    : task.priority === "MEDIUM"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {task.priority}
                        </button>
                    ) : (
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                task.priority === "HIGH"
                                    ? "bg-red-100 text-red-700"
                                    : task.priority === "MEDIUM"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {task.priority}
                        </span>
                    )}

                    {onDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(task)}
                            title="Delete task"
                            aria-label="Delete task"
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-red-200 text-red-600 transition hover:bg-red-50 hover:text-red-700"
                        >
                            <Trash2 size={15} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}