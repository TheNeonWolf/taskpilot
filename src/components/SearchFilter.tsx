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
    <div className="flex flex-col gap-3 md:flex-row">
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm outline-none focus:border-gray-500 md:flex-1"
      />

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-gray-500"
      >
        <option value="ALL">All Statuses</option>
        <option value="TODO">Todo</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="DONE">Done</option>
      </select>

      <select
        value={priority}
        onChange={(event) => onPriorityChange(event.target.value)}
        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm outline-none focus:border-gray-500"
      >
        <option value="ALL">All Priorities</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
    </div>
  );
}