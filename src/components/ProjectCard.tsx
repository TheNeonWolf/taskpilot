"use client";

import { Project } from "@/types";
import {
  Pencil,
  Trash2,
} from "lucide-react";

type ProjectCardProps = {
  project: Project;
  searchQuery?: string;
  showUpdateButton?: boolean;
  onEdit?: (
    project: Project
  ) => void;
  onDelete?: (
    project: Project
  ) => void;
};

function highlightMatch(
  text: string,
  query: string
) {
  if (!query.trim()) {
    return text;
  }

  const escapedQuery =
    query.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

  const regex = new RegExp(
    `(${escapedQuery})`,
    "gi"
  );

  return text
    .split(regex)
    .map((part, index) =>
      part.toLowerCase() ===
      query.toLowerCase() ? (
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
  searchQuery = "",
  showUpdateButton = true,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* Heading */}
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {highlightMatch(
            project.name,
            searchQuery
          )}
        </h3>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            project.status ===
            "COMPLETED"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {project.status}
        </span>
      </div>

      {/* Description */}
      <p className="mt-3 line-clamp-2 break-words text-sm text-gray-600 dark:text-gray-400">
        {project.description}
      </p>

      {/* Progress */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">
            Progress
          </span>

          <span className="font-medium text-gray-700 dark:text-gray-300">
            {Math.round(
              project.progress ?? 0
            )}
            %
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full rounded-full bg-gray-900 transition-all dark:bg-gray-100"
            style={{
              width: `${Math.min(
                100,
                Math.max(
                  0,
                  project.progress ??
                    0
                )
              )}%`,
            }}
          />
        </div>
      </div>

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div className="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
          {showUpdateButton &&
            onEdit && (
              <button
                type="button"
                onClick={() =>
                  onEdit(project)
                }
                title="Update project"
                aria-label="Update project"
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-700 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
              >
                Update
              </button>
            )}

          {onDelete && (
            <button
              type="button"
              onClick={() =>
                onDelete(project)
              }
              title="Delete project"
              aria-label="Delete project"
              className="cursor-pointer rounded-lg border border-red-200 p-2 text-red-500 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-red-900 dark:text-red-400 dark:hover:border-red-700 dark:hover:bg-red-950"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}