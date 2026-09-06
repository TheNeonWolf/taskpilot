import Navbar from "@/components/Navbar";

import ProjectCardSkeleton from "@/components/skeletons/ProjectCardSkeleton";
import Skeleton from "@/components/skeletons/Skeleton";

export default function Loading() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Skeleton className="h-9 w-32" />
            <Skeleton className="mt-3 h-4 w-60" />
          </div>

          <Skeleton className="h-10 w-32" />
        </div>

        <Skeleton className="mt-8 h-10 w-full" />

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </main>
    </>
  );
}