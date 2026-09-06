import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import { projects, tasks } from "@/data/mockData";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import Link from "next/link";
import TaskStatusChart from "@/components/charts/TaskStatusChart";
import ProjectCompletionChart from "@/components/charts/ProjectCompletionChart";
import EmptyState from "@/components/EmptyState";
import { FolderOpen, ListTodo } from "lucide-react";

export default function Home() {

  const totalProjects = projects.length;
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const dashboardProjects = projects
    .filter((project) => project.status === "ACTIVE")
    .slice(0, 4);
  const dashboardTasks = tasks
    .filter((task) => task.status !== "DONE")
    .slice(0, 4);

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome 👋
        </h2>

        <p className="mt-2 text-gray-600">
          Here's what's happening with your projects.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Projects" value={totalProjects} />
          <StatCard title="Total Tasks" value={totalTasks} />
          <StatCard title="Completed" value={completedTasks} />
          <StatCard title="In Progress" value={inProgressTasks} />
        </div>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Active Projects
            </h2>

            <Link
              href="/projects"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View All →
            </Link>
          </div>

          {dashboardProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {dashboardProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FolderOpen size={40} />}
              title="No active projects"
              message="You currently don't have any active projects."
            />
          )}
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Tasks
            </h2>

            <Link
              href="/tasks"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View All →
            </Link>
          </div>

          {dashboardTasks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {dashboardTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<ListTodo size={40} />}
              title="No tasks yet"
              message="Your recent tasks will appear here once you create one."
            />
          )}
        </section>

        <section className="mt-10">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ProjectCompletionChart projects={projects} />
            <TaskStatusChart tasks={tasks} />
          </div>
        </section>
      </main>
    </>
  );
}