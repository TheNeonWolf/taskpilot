"use client";

import Link from "next/link";
import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters"
      );
      return;
    }

    setLoading(true);

    try {
      // 1. Register the new user
      const registerResponse = await fetch(
        "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            username,
            email,
            password,
          }),
        }
      );

      const registerResult =
        await registerResponse.json();

      if (
        !registerResponse.ok ||
        !registerResult.success
      ) {
        if (
          typeof registerResult.error === "string"
        ) {
          setError(registerResult.error);
        } else if (
          Array.isArray(registerResult.error) &&
          registerResult.error.length > 0
        ) {
          setError(
            registerResult.error[0].message
          );
        } else {
          setError("Failed to create account");
        }

        return;
      }

      // 2. Automatically log the user in
      const loginResponse = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const loginResult =
        await loginResponse.json();

      if (
        !loginResponse.ok ||
        !loginResult.success
      ) {
        setError(
          "Account created, but automatic login failed. Please log in."
        );

        return;
      }

      // 3. Go directly to dashboard
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(
        "Registration failed:",
        error
      );

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
            Create an account to get started.
          </p>
        </div>

        {/* Register card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Register
          </h2>

          <form
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            className="mt-6 space-y-5"
          >
            {/* Name */}
            <input
              id="name"
              name="taskpilot-register-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Name"
              autoComplete="off"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />

            {/* Usename */}
            <input
              id="username"
              name="taskpilot-register-username"
              type="text"
              value={username}
              onChange={(event) =>
                  setUsername(event.target.value)
              }
              placeholder="Username"
              autoComplete="off"
              maxLength={20}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />

            {/* Email */}
            <input
              id="email"
              name="taskpilot-register-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Email"
              autoComplete="off"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />

            {/* Password */}
            <div className="relative">
              <input
                id="password"
                name="taskpilot-register-password"
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
                autoComplete="new-password"
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

            {/* Confirm password */}
            <div className="relative">
              <input
                id="confirmPassword"
                name="taskpilot-register-confirm-password"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                placeholder="Confirm Password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 pr-11 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (show) => !show
                  )
                }
                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center text-gray-500 transition hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
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

            {/* Register button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : "Register"}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 transition hover:text-blue-700"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}