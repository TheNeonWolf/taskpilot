"use client";

import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";
import { AIPromptInput } from "@/components/AIPromptInput";

import {
  Project,
  Task,
  TaskPriority,
  TaskStatus,
} from "@/types";

type TaskFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  onSaved: (task: Task) => void;
};

export default function TaskFormModal({
  isOpen,
  onClose,
  task,
  onSaved,
}: TaskFormModalProps) {
  const isEditing = task !== null && task !== undefined;

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");

  const [dueDate, setDueDate] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [projectId, setProjectId] = useState("");

  const [projects, setProjects] = useState<Project[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // AI Handler with ML Priority Predictor integration
  const handleAIGenerated = async (aiData: {
    title: string;
    priority?: "LOW" | "MEDIUM" | "HIGH";
    dueDate: string;
    estimatedHours?: number;
  }) => {
    if (aiData.title) setTitle(aiData.title);
    if (aiData.dueDate) setDueDate(aiData.dueDate);
    if (aiData.estimatedHours !== undefined && aiData.estimatedHours !== null) {
      setEstimatedHours(String(aiData.estimatedHours));
    }

    // Default to Gemini priority if available
    let chosenPriority: TaskPriority = (aiData.priority as TaskPriority) || "MEDIUM";

    // Query ML Priority Predictor microservice
    if (aiData.dueDate) {
      try {
        const mlRes = await fetch("/api/ml/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dueDate: aiData.dueDate,
            estimatedHours: aiData.estimatedHours || 1,
          }),
        });

        const mlData = await mlRes.json();
        if (mlData.success && mlData.suggestedPriority) {
          chosenPriority = mlData.suggestedPriority as TaskPriority;
        }
      } catch (err) {
        console.error("ML service prediction failed, using fallback:", err);
      }
    }

    setPriority(chosenPriority);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || "Failed to fetch projects"
          );
        }

        setProjects(result.data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setError("");

    if (task) {
      setTitle(task.title);
      setStatus(task.status);
      setPriority(task.priority);

      setDueDate(
        task.dueDate
          ? task.dueDate.slice(0, 10)
          : ""
      );

      setEstimatedHours(
        task.estimatedHours !== null
          ? String(task.estimatedHours)
          : ""
      );

      setProjectId(
        task.projectId !== null
          ? String(task.projectId)
          : ""
      );
    } else {
      setTitle("");
      setStatus("TODO");
      setPriority("MEDIUM");
      setDueDate("");
      setEstimatedHours("");
      setProjectId("");
    }
  }, [task, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    // Manual validation
    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    if (!dueDate) {
      setError("Please select a due date.");
      return;
    }

    if (estimatedHours !== "") {
      const hours = Number(estimatedHours);

      if (!Number.isFinite(hours) || hours < 0.5) {
        setError(
          "Estimated hours must be at least 0.5."
        );
        return;
      }
    }

    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        priority,
        dueDate,

        estimatedHours:
          estimatedHours === ""
            ? isEditing
              ? null
              : undefined
            : Number(estimatedHours),

        projectId:
          projectId === ""
            ? isEditing
              ? null
              : undefined
            : Number(projectId),

        ...(isEditing
          ? {
              status,
            }
          : {}),
      };

      const response = await fetch(
        isEditing
          ? `/api/tasks/${task.id}`
          : "/api/tasks",
        {
          method: isEditing ? "PATCH" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Failed to save task"
        );
      }

      // Send feedback to retrain ML decision tree model with final user choice
      if (dueDate) {
        fetch("/api/ml/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dueDate,
            estimatedHours,
            actualPriority: priority,
          }),
        }).catch((err) =>
          console.error("Failed to send ML feedback:", err)
        );
      }

      onSaved(result.data);
      onClose();
    } catch (error) {
      console.error("Failed to save task:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save task."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isEditing ? "Update Task" : "Add Task"}
        </h2>

        {/* AI Prompt Bar - only show when creating a new task */}
        {!isEditing && (
          <div className="mt-4">
            <AIPromptInput
              type="task"
              onGenerated={handleAIGenerated}
              placeholder="e.g., Finish CS2030S assignment by Friday, 4 hours"
            />
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-4 space-y-4"
        >
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          {/* Status - only while editing */}
          {isEditing && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as TaskStatus
                  )
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority
            </label>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value as TaskPriority
                )
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Due date */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Due Date
            </label>

            <input
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          {/* Estimated hours */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Estimated Hours
            </label>

            <input
              type="number"
              min="0.5"
              step="0.5"
              value={estimatedHours}
              onChange={(event) =>
                setEstimatedHours(
                  event.target.value
                )
              }
              placeholder="Optional"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          {/* Project */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Project
            </label>

            <select
              value={projectId}
              onChange={(event) =>
                setProjectId(event.target.value)
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="">No project</option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bottom section */}
          <div className="border-t border-gray-200 pt-5 dark:border-gray-800">
            {error && (
              <p className="mb-3 text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
              >
                {submitting
                  ? "Saving..."
                  : isEditing
                    ? "Update Task"
                    : "Add Task"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}