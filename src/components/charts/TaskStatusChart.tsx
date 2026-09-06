"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import EmptyState from "@/components/EmptyState";
import { ChartNoAxesColumn } from "lucide-react";

import { Task } from "@/types";

type TaskStatusChartProps = {
  tasks: Task[];
};

export default function TaskStatusChart({
  tasks,
}: TaskStatusChartProps) {
  const todoCount = tasks.filter(
    (task) => task.status === "TODO"
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const doneCount = tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  const data = [
    {
      status: "Todo",
      tasks: todoCount,
    },
    {
      status: "In Progress",
      tasks: inProgressCount,
    },
    {
      status: "Done",
      tasks: doneCount,
    },
  ];

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Tasks by Status
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Overview of your current tasks.
          </p>
        </div>

        <EmptyState
          icon={<ChartNoAxesColumn size={40} />}
          title="No task data"
          message="Task statistics will appear here once you create some tasks."
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Tasks by Status
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your current tasks.
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="status"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip cursor={false} />

            <Bar
              dataKey="tasks"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
              activeBar={{
                fill: "#1d4ed8",
                stroke: "#1e40af",
                strokeWidth: 2,
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}