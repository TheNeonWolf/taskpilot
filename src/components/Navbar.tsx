"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">
          TaskPilot
        </h1>

        <div className="flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm ${
              isActive("/")
                ? "border-b-2 border-gray-900 pb-1 font-semibold text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/projects"
            className={`text-sm ${
              isActive("/projects")
                ? "border-b-2 border-gray-900 pb-1 font-semibold text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Projects
          </Link>

          <Link
            href="/tasks"
            className={`text-sm ${
              isActive("/tasks")
                ? "border-b-2 border-gray-900 pb-1 font-semibold text-gray-900"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Tasks
          </Link>
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