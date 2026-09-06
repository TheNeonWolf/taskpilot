"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <h1 className="text-xl font-bold">
            TaskPilot
          </h1>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
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

          {/* Desktop profile */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
              T
            </div>

            <span className="text-sm font-medium">
              Test
            </span>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-gray-100 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive("/")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>

              <Link
                href="/projects"
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive("/projects")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Projects
              </Link>

              <Link
                href="/tasks"
                onClick={() => setIsMenuOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive("/tasks")
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                Tasks
              </Link>
            </div>

            {/* Mobile profile */}
            <div className="mt-3 flex items-center gap-3 border-t border-gray-200 px-3 pt-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
                T
              </div>

              <span className="text-sm font-medium">
                Test
              </span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}