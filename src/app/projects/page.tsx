"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/mockData";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");

  const filteredProjects = projects.filter((project) => {
    const query = search.toLowerCase();

    return (
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Page heading */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Projects
            </h1>

            <p className="mt-2 text-gray-600">
              View and manage all your projects.
            </p>
          </div>

          <button
            type="button"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            + New Project
          </button>
        </div>

        {/* Search */}
        <div className="mt-8">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        {/* Projects */}
        <div className="mt-8">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  showUpdateButton
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                No projects found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search.
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}