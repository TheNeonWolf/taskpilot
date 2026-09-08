"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
  type PieSectorShapeProps,
} from "recharts";
import EmptyState from "@/components/EmptyState";
import { ChartPie } from "lucide-react";
import type { Project } from "@/types";

type ProjectCompletionChartProps = {
  projects: Project[];
};

function ProjectSector(props: PieSectorShapeProps) {
  const outerRadius = 
    Number(props.outerRadius ?? 0) +
    (props.isActive ? 8 : 0);

  return (
    <Sector
      {...props}
      outerRadius={outerRadius}
      fill={props.fill}
      style={{
        outline: "none",
        transition: "all 0.2s ease",
      }}
    />
  );
}

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
      fill: "#16a34a"
    },
    {
      name: "Active",
      value: activeProjects,
      fill: "#2563eb"
    },
  ];

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 dark:botder-grey-800 bg-white dark:bg-grey-900 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Project Completion
          </h2>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
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
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Project Completion
        </h2>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of your project progress.
        </p>
      </div>

      <div className="relative h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart accessibilityLayer={false}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={105}
              paddingAngle={3}
              shape={ProjectSector}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--chart-tooltip-bg)",
                border: "1px solid var(--chart-tooltip-border)",
                borderRadius: "8px",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
              }}
              itemStyle={{
                color: "var(--chart-tooltip-title)",
              }}
              formatter={(value, name) => [
                `${value} ${Number(value) === 1 ? "project" : "projects"}`,
                name,
              ]}
            />
            
            <Legend
              formatter={(value) => (
                <span style={{ color: "var(--chart-text)" }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            {completedProjects}/{projects.length}
          </span>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            Completed
          </span>
        </div>
      </div>
    </div>
  );
}