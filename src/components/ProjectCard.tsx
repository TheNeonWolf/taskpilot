"use client"

import { Project } from "@/types";
import ProgressBar from "@/components/ProgressBar";

type ProjectCardProps = {
  project: Project;
  showUpdateButton?: boolean;
  searchQuery?: string;
  onDelete?: (project: Project) => void;
};

function highliteMatch(text: string, query: string) {
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

export default function ProjectCard({ project, showUpdateButton = false, searchQuery = "", onDelete}: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {highliteMatch(project.name, searchQuery)}
        </h3>

        <div className="flex items-center gap-2">
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
              className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-600">
        {highliteMatch(project.description, searchQuery)}
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