type SearchFilterProps = {
  search: string;
  status: string;
  priority: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
};

export default function SearchFilter({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: SearchFilterProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-[minmax(0,1fr)_10rem_10rem]">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search tasks..."
        className="col-span-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 md:col-span-1"
      />

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      >
        <option value="ALL">All Statuses</option>
        <option value="TODO">Todo</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>

      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value)}
        className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 outline-none transition focus:border-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
      >
        <option value="ALL">All Priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
    </div>
  );
}