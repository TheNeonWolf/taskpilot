import Skeleton from "@/components/skeletons/Skeleton";

export default function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-12" />
    </div>
  );
}