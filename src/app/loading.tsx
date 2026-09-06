import Navbar from "@/components/Navbar";

import StatCardSkeleton from "@/components/skeletons/StatCardSkeleton";
import ProjectCardSkeleton from "@/components/skeletons/ProjectCardSkeleton";
import TaskCardSkeleton from "@/components/skeletons/TaskCardSkeleton";
import ChartSkeleton from "@/components/skeletons/ChartSkeleton";
import Skeleton from "@/components/skeletons/Skeleton";

export default function Loading() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="mt-3 h-4 w-72" />

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
            <ProjectCardSkeleton />
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <Skeleton className="h-7 w-36" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
            <TaskCardSkeleton />
          </div>
        </section>
      </main>
    </>
  );
}