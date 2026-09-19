"use client";

import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";

import {
  Project,
  TaskPriority,
} from "@/types";

import {
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
  const [description, setDescription] =
    useState("");

  const [status, setStatus] =
    useState<"ACTIVE" | "COMPLETED">(
      "ACTIVE"
    );

  const [tasks, setTasks] =
    useState<NewProjectTask[]>([]);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setError("");

    if (project) {
      setName(project.name);
      setDescription(project.description);
      setStatus(project.status);

      // Existing tasks are edited from the Tasks page.
      setTasks([]);
    } else {
      setName("");
      setDescription("");
      setStatus("ACTIVE");
      setTasks([]);
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
      currentTasks.map(
        (task, taskIndex) =>
          taskIndex === index
            ? {
                ...task,
                [field]: value,
              }
            : task
      )
    );
  };

  const removeTask = (
    index: number
  ) => {
    setTasks((currentTasks) =>
      currentTasks.filter(
        (_, taskIndex) =>
          taskIndex !== index
      )
    );
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setStatus("ACTIVE");
    setTasks([]);
    setError("");
  };

  const handleClose = () => {
    if (submitting) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError(
        "Please enter a project name."
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Please enter a project description."
      );
      return;
    }

    if (description.length > 200) {
      setError(
        "Description cannot exceed 200 characters."
      );
      return;
    }

    // Only validate initial tasks when
    // creating a new project.
    if (!isEditing) {
      for (
        let index = 0;
        index < tasks.length;
        index++
      ) {
        const task = tasks[index];

        if (!task.title.trim()) {
          setError(
            `Please enter a title for Task ${index + 1}.`
          );
          return;
        }

        if (!task.dueDate) {
          setError(
            `Please select a due date for Task ${index + 1}.`
          );
          return;
        }

        if (
          task.estimatedHours !== ""
        ) {
          const hours = Number(
            task.estimatedHours
          );

          if (
            !Number.isFinite(hours) ||
            hours < 0.5
          ) {
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
      const payload = isEditing
        ? {
            name: name.trim(),
            description:
              description.trim(),
            status,
          }
        : {
            name: name.trim(),
            description:
              description.trim(),
            status,

            tasks: tasks.map(
              (task) => ({
                title:
                  task.title.trim(),

                priority:
                  task.priority,

                dueDate:
                  task.dueDate,

                estimatedHours:
                  task.estimatedHours ===
                  ""
                    ? undefined
                    : Number(
                        task.estimatedHours
                      ),
              })
            ),
          };

      const response = await fetch(
        isEditing
          ? `/api/projects/${project.id}`
          : "/api/projects",
        {
          method: isEditing
            ? "PATCH"
            : "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          typeof result.error ===
            "string"
            ? result.error
            : isEditing
              ? "Failed to update project"
              : "Failed to create project"
        );
      }

      onSaved(result.data);

      resetForm();
      onClose();
    } catch (error) {
      console.error(
        "Failed to save project:",
        error
      );

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
        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {isEditing
            ? "Update Project"
            : "Add Project"}
        </h2>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 space-y-5"
        >
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              maxLength={200}
              rows={3}
              className="mt-1 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800"
            />

            <p className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
              {description.length}/200
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value as
                    | "ACTIVE"
                    | "COMPLETED"
                )
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="ACTIVE">
                Active
              </option>

              <option value="COMPLETED">
                Completed
              </option>
            </select>
          </div>

          {/* Initial tasks only when creating */}
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
                  className="flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <Plus size={16} />
                  Add Task
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {tasks.map(
                  (task, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Task{" "}
                          {index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeTask(
                              index
                            )
                          }
                          title="Remove task"
                          aria-label={`Remove Task ${index + 1}`}
                          className="cursor-pointer rounded-lg p-2 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <Trash2
                            size={16}
                          />
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
                            value={
                              task.title
                            }
                            onChange={(
                              event
                            ) =>
                              updateTask(
                                index,
                                "title",
                                event
                                  .target
                                  .value
                              )
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800"
                          />
                        </div>

                        {/* Priority */}
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">
                            Priority
                          </label>

                          <select
                            value={
                              task.priority
                            }
                            onChange={(
                              event
                            ) =>
                              updateTask(
                                index,
                                "priority",
                                event
                                  .target
                                  .value
                              )
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800"
                          >
                            <option value="LOW">
                              Low
                            </option>

                            <option value="MEDIUM">
                              Medium
                            </option>

                            <option value="HIGH">
                              High
                            </option>
                          </select>
                        </div>

                        {/* Due date */}
                        <div>
                          <label className="text-sm text-gray-600 dark:text-gray-400">
                            Due Date
                          </label>

                          <input
                            type="date"
                            value={
                              task.dueDate
                            }
                            onChange={(
                              event
                            ) =>
                              updateTask(
                                index,
                                "dueDate",
                                event
                                  .target
                                  .value
                              )
                            }
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800"
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
                            value={
                              task.estimatedHours
                            }
                            onChange={(
                              event
                            ) =>
                              updateTask(
                                index,
                                "estimatedHours",
                                event
                                  .target
                                  .value
                              )
                            }
                            placeholder="Optional"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800"
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
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
                disabled={submitting}
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