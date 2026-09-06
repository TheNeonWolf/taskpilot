import Navbar from "@/components/Navbar";

import TaskCardSkeleton from "@/components/skeletons/TaskCardSkeleton";
import Skeleton from "@/components/skeletons/Skeleton";

export default function Loading() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Skeleton className="h-9 w-24" />
            <Skeleton className="mt-3 h-4 w-56" />
          </div>

          <Skeleton className="h-10 w-28" />
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <Skeleton className="h-10 w-full md:flex-1" />
          <Skeleton className="h-10 w-full md:w-40" />
          <Skeleton className="h-10 w-full md:w-40" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
          <TaskCardSkeleton />
        </div>
      </main>
    </>
  );
}