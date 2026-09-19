"use client";

import {
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types";

import {
  CalendarDays,
  Clock3,
  FolderKanban,
  Pencil,
  Trash2,
} from "lucide-react";

type TaskCardProps = {
  task: Task;
  projectName?: string;
  searchQuery?: string;

  onStatusChange?: (
    taskId: number,
    status: TaskStatus
  ) => void;

  onPriorityChange?: (
    taskId: number,
    priority: TaskPriority
  ) => void;

  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
};

function highlightMatch(text: string, query: string) {
  if (!query.trim()) {
    return text;
  }

  const escapedQuery = query.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

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

function formatDueDate(dateString: string) {
  const [year, month, day] = dateString
    .slice(0, 10)
    .split("-")
    .map(Number);

  return new Intl.DateTimeFormat("en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(
    new Date(year, month - 1, day)
  );
}

export default function TaskCard({
  task,
  projectName,
  searchQuery = "",
  onStatusChange,
  onPriorityChange,
  onEdit,
  onDelete,
}: TaskCardProps) {
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
      className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 ${
        task.status === "DONE"
          ? "opacity-60"
          : "opacity-100"
      }`}
    >
      {/* Top section */}
      <div className="flex items-start justify-between gap-4">
        <h3
          className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${
            task.status === "DONE"
              ? "line-through"
              : ""
          }`}
        >
          {highlightMatch(task.title, searchQuery)}
        </h3>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {onStatusChange ? (
            <button
              type="button"
              onClick={() =>
                onStatusChange(
                  task.id,
                  getNextStatus()
                )
              }
              title="Click to change status"
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition hover:scale-105 ${
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
                onPriorityChange(
                  task.id,
                  getNextPriority()
                )
              }
              title="Click to change priority"
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition hover:scale-105 ${
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
        </div>
      </div>

      {/* Task information */}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <CalendarDays size={16} />

          <span>
            {formatDueDate(task.dueDate)}
          </span>
        </div>

        {projectName && (
          <div className="flex items-center gap-2">
            <FolderKanban size={16} />

            <span>
              {projectName}
            </span>
          </div>
        )}

        {task.estimatedHours !== null && (
          <div className="flex items-center gap-2">
            <Clock3 size={16} />

            <span>
              {task.estimatedHours}{" "}
              {task.estimatedHours === 1
                ? "hour"
                : "hours"}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          {onEdit && (
            <button
                type="button"
                onClick={() => onEdit(task)}
                title="Update task"
                aria-label="Update task"
                className="cursor-pointer rounded-lg border border-gray-200 p-2 text-gray-600 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
                >
                <Pencil size={16} />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(task)}
              title="Delete task"
              aria-label="Delete task"
              className="cursor-pointer rounded-lg border border-red-200 p-2 text-red-500 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-300"            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}