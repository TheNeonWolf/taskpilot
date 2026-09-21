"use client";

import Link from "next/link";
import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          typeof result.error === "string"
            ? result.error
            : "Failed to log in"
        );

        return;
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 py-12">
      {/* Dark mode toggle */}
      <div className="absolute right-6 top-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            TaskPilot
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Log in to manage your projects and tasks.
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Login
          </h2>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-6 space-y-5"
          >
            {/* Email */}
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Email"
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />

            {/* Password */}
            <div className="relative">
              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-11 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (show) => !show
                  )
                }
                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center text-gray-500 transition hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 transition hover:text-blue-700"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}