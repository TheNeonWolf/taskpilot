"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import ProjectCard from "@/components/ProjectCard";
import ProjectFormModal from "@/components/ProjectFormModal";
import ConfirmModal from "@/components/ConfirmModal";

import { Project } from "@/types";

export default function ProjectsPage() {
  const [
    projectList,
    setProjectList,
  ] = useState<Project[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    showProjectForm,
    setShowProjectForm,
  ] = useState(false);

  const [
    projectToEdit,
    setProjectToEdit,
  ] = useState<Project | null>(null);

  const [
    projectToDelete,
    setProjectToDelete,
  ] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response =
          await fetch("/api/projects");

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            typeof result.error === "string"
              ? result.error
              : "Failed to fetch projects"
          );
        }

        setProjectList(result.data);
      } catch (error) {
        console.error(
          "Failed to fetch projects:",
          error
        );

        setError(
          "Failed to load projects."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase();

      if (!normalizedSearch) {
        return projectList;
      }

      return projectList.filter(
        (project) =>
          project.name
            .toLowerCase()
            .includes(normalizedSearch) ||
          project.description
            .toLowerCase()
            .includes(normalizedSearch)
      );
    }, [projectList, search]);

  const handleNewProject = () => {
    setProjectToEdit(null);
    setShowProjectForm(true);
  };

  const handleEditProject = (
    project: Project
  ) => {
    setProjectToEdit(project);
    setShowProjectForm(true);
  };

  const handleCloseProjectForm =
    () => {
      setShowProjectForm(false);
      setProjectToEdit(null);
    };

  const handleProjectSaved = (
    savedProject: Project
  ) => {
    setProjectList(
      (currentProjects) => {
        const existingProject =
          currentProjects.some(
            (project) =>
              project.id ===
              savedProject.id
          );

        if (existingProject) {
          return currentProjects.map(
            (project) =>
              project.id ===
              savedProject.id
                ? {
                    ...project,
                    ...savedProject,
                    progress:
                      savedProject.progress ??
                      project.progress,
                  }
                : project
          );
        }

        return [
          ...currentProjects,
          {
            ...savedProject,
            progress:
              savedProject.progress ?? 0,
          },
        ];
      }
    );

    setShowProjectForm(false);
    setProjectToEdit(null);
  };

  const handleDeleteProject =
    async () => {
      if (!projectToDelete) {
        return;
      }

      try {
        const response =
          await fetch(
            `/api/projects/${projectToDelete.id}`,
            {
              method: "DELETE",
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            typeof result.error === "string"
              ? result.error
              : "Failed to delete project"
          );
        }

        setProjectList(
          (currentProjects) =>
            currentProjects.filter(
              (project) =>
                project.id !==
                projectToDelete.id
            )
        );

        setProjectToDelete(null);
      } catch (error) {
        console.error(
          "Failed to delete project:",
          error
        );

        setError(
          "Failed to delete project."
        );

        setProjectToDelete(null);
      }
    };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading projects...
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Projects
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View and manage all your projects.
            </p>
          </div>

          <button
            type="button"
            onClick={handleNewProject}
            className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
          >
            + New Project
          </button>
        </div>

        <div className="relative mt-6">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search projects..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {error && (
          <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {filteredProjects.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {filteredProjects.map(
              (project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  searchQuery={search}
                  onEdit={
                    handleEditProject
                  }
                  onDelete={(project) =>
                    setProjectToDelete(
                      project
                    )
                  }
                />
              )
            )}
          </div>
        ) : (
          <div className="mt-10 rounded-xl border border-dashed border-gray-300 p-10 text-center dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {search
                ? "No projects found"
                : "No projects yet"}
            </h2>
          </div>
        )}

        <ProjectFormModal
          isOpen={showProjectForm}
          project={projectToEdit}
          onClose={
            handleCloseProjectForm
          }
          onSaved={
            handleProjectSaved
          }
        />

        <ConfirmModal
          isOpen={
            projectToDelete !== null
          }
          title="Delete Project"
          message={
            projectToDelete
              ? `Are you sure you want to delete "${projectToDelete.name}"? Tasks linked to this project will also be deleted.`
              : ""
          }
          onCancel={() =>
            setProjectToDelete(null)
          }
          onConfirm={
            handleDeleteProject
          }
        />
      </main>
    </>
  );
}