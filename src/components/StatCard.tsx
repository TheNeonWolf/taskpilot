type StatCardProps = {
  title: string;
  value: number;
};

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}