"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import EmptyState from "@/components/EmptyState";
import { ChartPie } from "lucide-react";
import type { Project } from "@/types";

type ProjectCompletionChartProps = {
  projects: Project[];
};

export default function ProjectCompletionChart({
  projects,
}: ProjectCompletionChartProps) {
  const completedProjects = projects.filter(
    (project) => project.status === "COMPLETED"
  ).length;

  const activeProjects = projects.filter(
    (project) => project.status === "ACTIVE"
  ).length;

  const data = [
    {
      name: "Completed",
      value: completedProjects,
    },
    {
      name: "Active",
      value: activeProjects,
    },
  ];

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Project Completion
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Overview of your project progress.
          </p>
        </div>

        <EmptyState
          icon={<ChartPie size={40} />}
          title="No project data"
          message="Project statistics will appear here once you create a project."
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Project Completion
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your project progress.
        </p>
      </div>

      <div className="relative h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={3}
            >
              <Cell fill="#16a34a" />
              <Cell fill="#2563eb" />
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
          <span className="text-3xl font-bold text-gray-900">
            {completedProjects}/{projects.length}
          </span>

          <span className="text-sm text-gray-500">
            Completed
          </span>
        </div>
      </div>
    </div>
  );
}