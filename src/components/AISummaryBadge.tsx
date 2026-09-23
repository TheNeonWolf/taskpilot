"use client";

import { useState } from "react";
import { Sparkles, Loader2, RotateCw } from "lucide-react";

interface AISummaryBadgeProps {
  projectId: number;
}

export function AISummaryBadge({ projectId }: AISummaryBadgeProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/summary`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to generate summary");
      }

      setSummary(result.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50/60 p-3 text-xs dark:border-gray-800 dark:bg-gray-800/40">
      {/* Header line: Title on left, button on right */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-300">
          <Sparkles size={14} className="text-amber-500 shrink-0" />
          <span>AI Project Summary</span>
        </div>

        <button
          type="button"
          onClick={fetchSummary}
          disabled={loading}
          className="flex cursor-pointer items-center gap-1.5 font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50 dark:text-gray-300 dark:hover:text-white transition-colors"
        >
          {loading ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : summary ? (
            <>
              <RotateCw size={12} />
              <span>Regenerate</span>
            </>
          ) : (
            <span>Generate</span>
          )}
        </button>
      </div>

      {/* Summary Content */}
      {summary && (
        <p className="mt-2 text-gray-600 leading-relaxed dark:text-gray-300">
          {summary}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}