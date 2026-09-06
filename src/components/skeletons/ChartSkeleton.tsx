import Skeleton from "@/components/skeletons/Skeleton";

export default function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Skeleton className="h-5 w-36" />
      <Skeleton className="mt-3 h-4 w-48" />
      <Skeleton className="mt-8 h-64 w-full" />
    </div>
  );
}