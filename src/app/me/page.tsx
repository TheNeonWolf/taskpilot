"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, CalendarDays } from "lucide-react";

import Navbar from "@/components/Navbar";

type CurrentUser = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<CurrentUser | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");

        const result = await response.json();

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || "Failed to load profile"
          );
        }

        setUser(result.data);
      } catch (error) {
        console.error(
          "Failed to fetch profile:",
          error
        );

        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);

      setError(
        "Failed to log out. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="mx-auto max-w-4xl px-6 py-8">
          <p className="text-gray-600 dark:text-gray-400">
            Loading profile...
          </p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />

        <main className="mx-auto max-w-4xl px-6 py-8">
          <p className="text-red-600">
            {error}
          </p>
        </main>
      </>
    );
  }

  if (!user) {
    return null;
  }

  const initial =
    user.name.trim().charAt(0).toUpperCase() || "U";

  const joinedDate = new Date(
    user.createdAt
  ).toLocaleDateString();

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View your TaskPilot account information.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {/* Profile header */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-2xl font-bold text-gray-900 dark:bg-gray-700 dark:text-white">
              {initial}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                TaskPilot User
              </p>
            </div>
          </div>

          {/* User details */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <User
                size={20}
                className="text-gray-500 dark:text-gray-400"
              />

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Name
                </p>

                <p className="font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <Mail
                size={20}
                className="text-gray-500 dark:text-gray-400"
              />

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email
                </p>

                <p className="font-medium text-gray-900 dark:text-white">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <CalendarDays
                size={20}
                className="text-gray-500 dark:text-gray-400"
              />

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Joined
                </p>

                <p className="font-medium text-gray-900 dark:text-white">
                  {joinedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </main>
    </>
  );
}