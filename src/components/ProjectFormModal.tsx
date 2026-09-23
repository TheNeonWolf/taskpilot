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

import {
  CheckCircle2,
  Circle,
  Clock3,
  Plus,
  Trash2,
} from "lucide-react";

type ProjectFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
  onSaved: (project: Project) => void;
};

type NewProjectTask = {
  title: string;
  priority: TaskPriority;
  dueDate: string;
  estimatedHours: string;
};

export default function ProjectFormModal({
  isOpen,
  onClose,
  project,
  onSaved,
}: ProjectFormModalProps) {
  const isEditing =
    project !== null &&
    project !== undefined;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Used only when creating a new project.
  const [tasks, setTasks] = useState<NewProjectTask[]>([]);

  // Used only when editing an existing project.
  const [existingTasks, setExistingTasks] = useState<Task[]>([]);

  // Keeps track of the original task statuses
  // so only PATCH tasks that actually changed.
  const [originalTaskStatuses, setOriginalTaskStatuses] = useState<
    Record<number, TaskStatus>
  >({});

  const [tasksLoading, setTasksLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // AI Handler to pre-fill project details and ML-predicted subtasks
  const handleAIGenerated = async (aiData: {
    name: string;
    description: string;
    tasks?: {
      title: string;
      priority?: TaskPriority;
      dueDate: string;
      estimatedHours?: number | null;
    }[];
  }) => {
    if (aiData.name) setName(aiData.name);
    if (aiData.description) setDescription(aiData.description);

    if (aiData.tasks && Array.isArray(aiData.tasks)) {
      const initialFormattedTasks = aiData.tasks.map((task) => ({
        title: task.title || "",
        dueDate: task.dueDate || "",
        estimatedHours:
          task.estimatedHours !== undefined && task.estimatedHours !== null
            ? String(task.estimatedHours)
            : "2",
      }));

      // Pass AI generated tasks to ML batch predictor
      try {
        const mlRes = await fetch("/api/ml/predict-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tasks: initialFormattedTasks }),
        });

        const mlData = await mlRes.json();

        if (mlData.success && Array.isArray(mlData.tasks)) {
          setTasks(mlData.tasks);
          return;
        }
      } catch (err) {
        console.error("Failed to run ML priority prediction:", err);
      }

      // Fallback if ML prediction service is offline
      setTasks(
        initialFormattedTasks.map((t) => ({
          ...t,
          priority: "MEDIUM" as TaskPriority,
        }))
      );
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setError("");

    if (project) {
      setName(project.name);
      setDescription(project.description);
      setTasks([]);

      const fetchProjectTasks = async () => {
        setTasksLoading(true);

        try {
          const response = await fetch(
            `/api/projects/${project.id}/tasks`
          );

          const result = await response.json();

          if (!response.ok || !result.success) {
            throw new Error(
              typeof result.error === "string"
                ? result.error
                : "Failed to load project tasks"
            );
          }

          const fetchedTasks: Task[] = result.data;

          setExistingTasks(fetchedTasks);

          const statuses: Record<number, TaskStatus> = {};

          fetchedTasks.forEach((task) => {
            statuses[task.id] = task.status;
          });

          setOriginalTaskStatuses(statuses);
        } catch (error) {
          console.error(
            "Failed to fetch project tasks:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "Failed to load project tasks."
          );

          setExistingTasks([]);
          setOriginalTaskStatuses({});
        } finally {
          setTasksLoading(false);
        }
      };

      fetchProjectTasks();
    } else {
      setName("");
      setDescription("");
      setTasks([]);
      setExistingTasks([]);
      setOriginalTaskStatuses({});
      setTasksLoading(false);
    }
  }, [project, isOpen]);

  const addTask = () => {
    setTasks((currentTasks) => [
      ...currentTasks,
      {
        title: "",
        priority: "MEDIUM",
        dueDate: "",
        estimatedHours: "",
      },
    ]);
  };

  const updateTask = (
    index: number,
    field: keyof NewProjectTask,
    value: string
  ) => {
    setTasks((currentTasks) =>
      currentTasks.map((task, taskIndex) =>
        taskIndex === index
          ? {
              ...task,
              [field]: value,
            }
          : task
      )
    );
  };

  const removeTask = (index: number) => {
    setTasks((currentTasks) =>
      currentTasks.filter((_, taskIndex) => taskIndex !== index)
    );
  };

  const updateExistingTaskStatus = (
    taskId: number,
    status: TaskStatus
  ) => {
    setExistingTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
            }
          : task
      )
    );
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setTasks([]);
    setExistingTasks([]);
    setOriginalTaskStatuses({});
    setTasksLoading(false);
    setError("");
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }

    resetForm();
    onClose();
  };

  const completedTaskCount = existingTasks.filter(
    (task) => task.status === "DONE"
  ).length;

  const calculatedStatus: "ACTIVE" | "COMPLETED" =
    existingTasks.length > 0 &&
    existingTasks.every((task) => task.status === "DONE")
      ? "COMPLETED"
      : "ACTIVE";

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter a project name.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a project description.");
      return;
    }

    if (description.length > 200) {
      setError("Description cannot exceed 200 characters.");
      return;
    }

    // Validate initial tasks only when creating a project
    if (!isEditing) {
      for (let index = 0; index < tasks.length; index++) {
        const task = tasks[index];

        if (!task.title.trim()) {
          setError(`Please enter a title for Task ${index + 1}.`);
          return;
        }

        if (!task.dueDate) {
          setError(`Please select a due date for Task ${index + 1}.`);
          return;
        }

        if (task.estimatedHours !== "") {
          const hours = Number(task.estimatedHours);

          if (!Number.isFinite(hours) || hours < 0.5) {
            setError(
              `Estimated hours for Task ${index + 1} must be at least 0.5.`
            );
            return;
          }
        }
      }
    }

    setSubmitting(true);

    try {
      if (isEditing && project) {
        for (const task of existingTasks) {
          const originalStatus = originalTaskStatuses[task.id];

          if (originalStatus !== task.status) {
            const taskResponse = await fetch(`/api/tasks/${task.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: task.status,
              }),
            });

            const taskResult = await taskResponse.json();

            if (!taskResponse.ok || !taskResult.success) {
              throw new Error(
                typeof taskResult.error === "string"
                  ? taskResult.error
                  : `Failed to update task "${task.title}"`
              );
            }
          }
        }

        const projectResponse = await fetch(`/api/projects/${project.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
          }),
        });

        const projectResult = await projectResponse.json();

        if (!projectResponse.ok || !projectResult.success) {
          throw new Error(
            typeof projectResult.error === "string"
              ? projectResult.error
              : "Failed to update project"
          );
        }

        const refreshedResponse = await fetch(
          `/api/projects/${project.id}`
        );

        const refreshedResult = await refreshedResponse.json();

        if (!refreshedResponse.ok || !refreshedResult.success) {
          throw new Error(
            typeof refreshedResult.error === "string"
              ? refreshedResult.error
              : "Failed to refresh project"
          );
        }

        onSaved(refreshedResult.data);
      } else {
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            status: "ACTIVE",
            tasks: tasks.map((task) => ({
              title: task.title.trim(),
              priority: task.priority,
              dueDate: task.dueDate,
              estimatedHours:
                task.estimatedHours === ""
                  ? undefined
                  : Number(task.estimatedHours),
            })),
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            typeof result.error === "string"
              ? result.error
              : "Failed to create project"
          );
        }

        // Send feedback for each task to retrain the ML model with user choices
        tasks.forEach((task) => {
          if (task.dueDate) {
            fetch("/api/ml/feedback", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                dueDate: task.dueDate,
                estimatedHours: task.estimatedHours,
                actualPriority: task.priority,
              }),
            }).catch((err) =>
              console.error("Failed to send ML feedback:", err)
            );
          }
        });

        onSaved(result.data);
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Failed to save project:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save project."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isEditing ? "Update Project" : "Add Project"}
        </h2>

        {/* AI Generator Bar - Rendered when creating a new project */}
        {!isEditing && (
          <div className="mt-4">
            <AIPromptInput
              type="project"
              onGenerated={handleAIGenerated}
              placeholder="e.g., Redesign landing page with hero section, features, and pricing table"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={200}
              rows={3}
              className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />

            <p className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
              {description.length}/200
            </p>
          </div>

          {/* Automatic status - edit only */}
          {isEditing && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>

              <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  {calculatedStatus === "COMPLETED" ? (
                    <CheckCircle2
                      size={18}
                      className="text-green-600 dark:text-green-400"
                    />
                  ) : (
                    <Clock3
                      size={18}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  )}

                  <span className="font-medium text-gray-900 dark:text-white">
                    {calculatedStatus === "COMPLETED"
                      ? "Completed"
                      : "Active"}
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Project status is updated automatically based on task
                  completion.
                </p>
              </div>
            </div>
          )}

          {/* Existing tasks - edit only */}
          {isEditing && (
            <div className="border-t border-gray-200 pt-5 dark:border-gray-800">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Project Tasks
                  </h3>

                  {!tasksLoading && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {completedTaskCount} of {existingTasks.length} tasks
                      completed
                    </p>
                  )}
                </div>

                {!tasksLoading && existingTasks.length > 0 && (
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {Math.round(
                      (completedTaskCount / existingTasks.length) * 100
                    )}
                    %
                  </span>
                )}
              </div>

              {tasksLoading ? (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Loading tasks...
                </p>
              ) : existingTasks.length === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-5 text-center dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    No tasks in this project yet
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Add a task from the Tasks page and assign it to this
                    project.
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {existingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            {task.status === "DONE" ? (
                              <CheckCircle2
                                size={17}
                                className="shrink-0 text-green-600 dark:text-green-400"
                              />
                            ) : task.status === "IN_PROGRESS" ? (
                              <Clock3
                                size={17}
                                className="shrink-0 text-blue-600 dark:text-blue-400"
                              />
                            ) : (
                              <Circle
                                size={17}
                                className="shrink-0 text-gray-400"
                              />
                            )}

                            <p className="truncate font-medium text-gray-900 dark:text-white">
                              {task.title}
                            </p>
                          </div>

                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                            <span>Priority: {task.priority}</span>

                            {task.estimatedHours !== null && (
                              <span>
                                {task.estimatedHours} hr
                                {task.estimatedHours !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>

                        <select
                          value={task.status}
                          onChange={(event) =>
                            updateExistingTaskStatus(
                              task.id,
                              event.target.value as TaskStatus
                            )
                          }
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white sm:w-40"
                        >
                          <option value="TODO">Todo</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="DONE">Done</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Initial tasks - create only */}
          {!isEditing && (
            <div className="border-t border-gray-200 pt-5 dark:border-gray-800">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Initial Tasks
                  </h3>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Optional tasks to create with this project.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addTask}
                  className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium transition hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                >
                  <Plus size={16} />
                  Add Task
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Task {index + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeTask(index)}
                        title="Remove task"
                        aria-label={`Remove Task ${index + 1}`}
                        className="cursor-pointer rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {/* Task title */}
                      <div className="sm:col-span-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Title
                        </label>

                        <input
                          type="text"
                          value={task.title}
                          onChange={(event) =>
                            updateTask(index, "title", event.target.value)
                          }
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>

                      {/* Priority */}
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Priority
                        </label>

                        <select
                          value={task.priority}
                          onChange={(event) =>
                            updateTask(index, "priority", event.target.value)
                          }
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                          <option value="LOW">Low</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HIGH">High</option>
                        </select>
                      </div>

                      {/* Due date */}
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Due Date
                        </label>

                        <input
                          type="date"
                          value={task.dueDate}
                          onChange={(event) =>
                            updateTask(index, "dueDate", event.target.value)
                          }
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>

                      {/* Estimated hours */}
                      <div>
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Estimated Hours
                        </label>

                        <input
                          type="number"
                          min="0.5"
                          step="0.5"
                          value={task.estimatedHours}
                          onChange={(event) =>
                            updateTask(
                              index,
                              "estimatedHours",
                              event.target.value
                            )
                          }
                          placeholder="Optional"
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error + buttons */}
          <div className="border-t border-gray-200 pt-5 dark:border-gray-800">
            {error && (
              <p className="mb-3 text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting || tasksLoading}
                className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
              >
                {submitting
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                    ? "Update Project"
                    : "Create Project"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}