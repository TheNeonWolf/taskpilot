import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import { projects, tasks } from "@/data/mockData";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import Link from "next/link";
import TaskStatusChart from "@/components/charts/TaskStatusChart";

export default function Home() {

  const totalProjects = projects.length;
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "DONE"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const dashboardProjects = projects.slice(0, 4);
  const dashboardTasks = tasks.slice(0, 4);

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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {dashboardProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                showUpdateButton
              />
            ))}
          </div>
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {dashboardTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <TaskStatusChart tasks={tasks} />
        </section>
      </main>
    </>
  );
}