"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import SearchFilter from "@/components/SearchFilter";
import TaskCard from "@/components/TaskCard";
import { Project, Task } from "@/types";
import ConfirmModal from "@/components/ConfirmModal";
import EmptyState from "@/components/EmptyState";
import { ListTodo, SearchX } from "lucide-react";
import TaskFormModal from "@/components/TaskFormModal";

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");

  const [taskList, setTaskList] = useState<Task[]>([]);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskToEdit, setTaskToEdit] =useState<Task | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          tasksResponse,
          projectsResponse,
        ] = await Promise.all([
          fetch("/api/tasks"),
          fetch("/api/projects"),
        ]);

        const tasksResult =
          await tasksResponse.json();

        const projectsResult =
          await projectsResponse.json();

        if (
          !tasksResponse.ok ||
          !tasksResult.success
        ) {
          throw new Error(
            tasksResult.error ||
              "Failed to fetch tasks"
          );
        }

        if (
          !projectsResponse.ok ||
          !projectsResult.success
        ) {
          throw new Error(
            projectsResult.error ||
              "Failed to fetch projects"
          );
        }

        setTaskList(tasksResult.data);
        setProjects(projectsResult.data);
      } catch (error) {
        console.error(
          "Failed to fetch task data:",
          error
        );

        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTasks = taskList.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      status === "ALL" || task.status === status;

    const matchesPriority =
      priority === "ALL" || task.priority === priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = async (
    taskId: number,
    newStatus: "TODO" | "IN_PROGRESS" | "DONE"
  ) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update task");
      }

      setTaskList((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? result.data
            : task
        )
      );
    } catch (error) {
      console.error("Failed to update task status:", error);
      setError("Failed to update task");
    }
  };

  const handlePriorityChange = async (
    taskId: number,
    newPriority: "LOW" | "MEDIUM" | "HIGH"
  ) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priority: newPriority,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update task");
      }

      setTaskList((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? result.data
            : task
        )
      );
    } catch (error) {
      console.error("Failed to update task priority:", error);
      setError("Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) {
      return;
    }

    try {
      const response = await fetch(
        `/api/tasks/${taskToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete task");
      }

      setTaskList((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== taskToDelete.id
        )
      );

      setTaskToDelete(null);
    } catch (error) {
      console.error("Failed to delete task:", error);
      setError("Failed to delete task");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Loading tasks...
          </p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <main className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-red-600">
            {error}
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tasks
            </h1>

            <p className="mt-2 text-gray-600 dark:text-gray-400">
              View and manage all your tasks.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setTaskToEdit(null);
              setShowTaskForm(true);
            }}
            className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
          >
            + Add Task
          </button>
        </div>

        <div className="mt-8">
          <SearchFilter
            search={search}
            status={status}
            priority={priority}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onPriorityChange={setPriority}
          />
        </div>

        <div className="mt-8">
          {filteredTasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectName={
                    task.projectId !== null
                      ? projects.find(
                          (project) =>
                            project.id === task.projectId
                        )?.name
                      : undefined
                  }
                  searchQuery={search}
                  onStatusChange={handleStatusChange}
                  onPriorityChange={handlePriorityChange}
                  onEdit={(task) => {
                    setTaskToEdit(task);
                    setShowTaskForm(true);
                  }}
                  onDelete={setTaskToDelete}
                />
              ))}
            </div>
          ) : taskList.length === 0 ? (
            <EmptyState
              icon={<ListTodo size={40} />}
              title="No tasks yet"
              message="Create your first task to start tracking your work."
            />
          ) : (
            <EmptyState
              icon={<SearchX size={40} />}
              title="No tasks found"
              message="Try changing your search or filters."
            />
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={taskToDelete !== null}
        title="Delete task?"
        message={`Are you sure you want to delete "${
          taskToDelete?.title ?? ""
        }"? This action cannot be undone.`}
        onCancel={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
      />

      <TaskFormModal
        isOpen={showTaskForm}
        task={taskToEdit}
        onClose={() => {
          setShowTaskForm(false);
          setTaskToEdit(null);
        }}
        onSaved={(savedTask) => {
          setTaskList((currentTasks) => {
            const alreadyExists = currentTasks.some(
              (task) => task.id === savedTask.id
            );

            if (alreadyExists) {
              return currentTasks.map((task) =>
                task.id === savedTask.id
                  ? savedTask
                  : task
              );
            }

            return [...currentTasks, savedTask];
          });
        }}
      />
    </>
  );
}