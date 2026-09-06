import Skeleton from "@/components/skeletons/Skeleton";

export default function ProjectCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <Skeleton className="h-5 w-36 justify-self-start" />
        <Skeleton className="h-6 w-20 rounded-full justify-self-center" />
        <Skeleton className="h-8 w-20 justify-self-end" />
      </div>

      <Skeleton className="mt-4 h-4 w-2/3" />

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-10" />
        </div>

        <Skeleton className="mt-3 h-2 w-full rounded-full" />
      </div>
    </div>
  );
}