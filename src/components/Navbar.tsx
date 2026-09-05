export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">
          TaskPilot
        </h1>

        <div className="flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-gray-900">
            Dashboard
          </a>

          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Projects
          </a>

          <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
            Tasks
          </a>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
            T
          </div>

          <span className="text-sm font-medium">
            Test
          </span>
        </div>
      </div>
    </nav>
  );
}