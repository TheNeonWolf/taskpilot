"use client";

import { CircleAlert, RotateCcw } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this content. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/40 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950/20">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
        <CircleAlert size={24} />
      </div>

      <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 flex cursor-pointer items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
        >
          <RotateCcw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
}