"use client";

import { useState } from "react";
import { Project } from "@/types";
import ConfirmModal from "@/components/ConfirmModal";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/mockData";
import EmptyState from "@/components/EmptyState";
import { FolderOpen, SearchX } from "lucide-react";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [projectList, setProjectList] = useState(projects);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const filteredProjects = projectList.filter((project) => {
    const query = search.toLowerCase();

    return (
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
    );
  });

  const handleDeleteProject = () => {
    if (!projectToDelete) {
      return;
    }

    setProjectList((currentProjects) =>
      currentProjects.filter(
        (project) => project.id !== projectToDelete.id
      )
    );

    setProjectToDelete(null);
  };

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
                  searchQuery={search}
                  onDelete={setProjectToDelete}
                />
              ))}
            </div>
          ) : (
            <div className="mt-8">
              {projectList.length === 0 ? (
                <EmptyState
                  icon={<FolderOpen size={40} />}
                  title="No projects yet"
                  message="Create your first project to start organizing your work."
                />
              ) : filteredProjects.length === 0 ? (
                <EmptyState
                  icon={<SearchX size={40} />}
                  title="No projects found"
                  message="Try changing your search to find what you're looking for."
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      showUpdateButton
                      searchQuery={search}
                      onDelete={setProjectToDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <ConfirmModal
        isOpen={projectToDelete !== null}
        title="Delete project?"
        message={`Are you sure you want to delete "${
          projectToDelete?.name ?? ""
        }"? This action cannot be undone.`}
        onCancel={() => setProjectToDelete(null)}
        onConfirm={handleDeleteProject}
      />
    </>
  );
}