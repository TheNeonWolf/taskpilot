"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchFilter from "@/components/SearchFilter";
import TaskCard from "@/components/TaskCard";
import { tasks } from "@/data/mockData";

export default function TasksPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [taskList, setTaskList] = useState(tasks);

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
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                No tasks found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}