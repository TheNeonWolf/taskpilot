"use client";

import type { Project } from "@/types";

import ProgressBar from "@/components/ProgressBar";

import { Trash2 } from "lucide-react";

type ProjectCardProps = {
  project: Project;
  showUpdateButton?: boolean;
  searchQuery?: string;
  onDelete?: (project: Project) => void;
};

function highlightMatch(text: string, query: string) {
  if (!query.trim()) {
    return text;
  }

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

export default function ProjectCard({
  project,
  showUpdateButton = false,
  searchQuery = "",
  onDelete,
}: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <h3 className="justify-self-start text-lg font-semibold text-gray-900">
          {highlightMatch(project.name, searchQuery)}
        </h3>

        <span
          className={`justify-self-center rounded-full px-3 py-1 text-xs font-medium ${
            project.status === "COMPLETED"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {project.status}
        </span>

        <div className="flex items-center gap-2 justify-self-end">
          {showUpdateButton && (
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Update
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(project)}
              title="Delete project"
              aria-label="Delete project"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm text-gray-600">
        {highlightMatch(project.description, searchQuery)}
      </p>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Progress
          </span>

          <span className="text-sm font-medium text-gray-700">
            {project.progress}%
          </span>
        </div>

        <ProgressBar progress={project.progress} />
      </div>
    </div>
  );
}