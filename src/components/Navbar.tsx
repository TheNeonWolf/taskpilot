"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  const linkClass = (href: string) =>
    `text-sm transition ${
      isActive(href)
        ? "border-b-2 border-gray-900 pb-1 font-semibold text-gray-900 dark:border-white dark:text-white"
        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
    }`;

  return (
    <nav className="border-b border-gray-200 bg-white transition-colors dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between py-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            TaskPilot
          </h1>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className={linkClass("/")}>
              Dashboard
            </Link>

            <Link href="/projects" className={linkClass("/projects")}>
              Projects
            </Link>

            <Link href="/tasks" className={linkClass("/tasks")}>
              Tasks
            </Link>
          </div>

          {/* Desktop profile */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100">
              T
            </div>

            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Test
            </span>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-200 py-4 dark:border-gray-800 md:hidden">
            <div className="flex flex-col gap-1">
              {[
                { href: "/", label: "Dashboard" },
                { href: "/projects", label: "Projects" },
                { href: "/tasks", label: "Tasks" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive(link.href)
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-gray-200 px-3 pt-4 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100">
                  T
                </div>

                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Test
                </span>
              </div>

              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}