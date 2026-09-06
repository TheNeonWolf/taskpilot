"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchFilter from "@/components/SearchFilter";
import TaskCard from "@/components/TaskCard";
import { tasks } from "@/data/mockData";
import { Task } from "@/types";
import ConfirmModal from "@/components/ConfirmModal";
import EmptyState from "@/components/EmptyState";
import { ListTodo, SearchX } from "lucide-react";

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [taskList, setTaskList] = useState(tasks);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

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

  const handleStatusChange = (
    taskId: number,
    newStatus: "TODO" | "IN_PROGRESS" | "DONE"
  ) => {
    setTaskList((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );
  };

  const handlePriorityChange = (
    taskId: number,
    newPriority: "LOW" | "MEDIUM" | "HIGH"
  ) => {
    setTaskList((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? { ...task, priority: newPriority }
          : task
      )
    );
  };

  const handleDeleteTask = () => {
    if(!taskToDelete) {
      return;
    }

    setTaskList((currentTasks) =>
      currentTasks.filter(
        (tasks) => tasks.id !== taskToDelete.id
      )
    );
    
    setTaskToDelete(null);
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Tasks
            </h1>

            <p className="mt-2 text-gray-600">
              View and manage all your tasks.
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
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
                  searchQuery={search}
                  onStatusChange={handleStatusChange}
                  onPriorityChange={handlePriorityChange}
                  onDelete={setTaskToDelete}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              {taskList.length === 0 ? (
                <EmptyState
                  icon={<ListTodo size={40} />}
                  title="No tasks yet"
                  message="Create your first task to start tracking your work."
                />
              ) : filteredTasks.length === 0 ? (
                <EmptyState
                  icon={<SearchX size={40} />}
                  title="No tasks found"
                  message="Try changing your search or filters."
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      searchQuery={search}
                      onStatusChange={handleStatusChange}
                      onPriorityChange={handlePriorityChange}
                      onDelete={setTaskToDelete}
                    />
                  ))}
                </div>
              )}
            </div>
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
    </>
  );
}