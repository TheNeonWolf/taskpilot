"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface AIPromptInputProps {
  type: "task" | "project";
  onGenerated: (data: any) => void;
  placeholder?: string;
}

export function AIPromptInput({
  type,
  onGenerated,
  placeholder,
}: AIPromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, prompt }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to generate AI response");
      }

      onGenerated(result.data);
      setPrompt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-3.5 dark:border-gray-800 dark:bg-gray-800/40">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
        <Sparkles size={14} className="text-amber-500" />
        <span>Generate with TaskPilot AI</span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            placeholder ||
            (type === "task"
              ? "e.g., Finish CS2030S assignment by Friday, 4 hours"
              : "e.g., Redesign landing page with modern hero section")
          }
          className="w-full flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-gray-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleGenerate();
            }
          }}
        />

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <span>Fill Form</span>
          )}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}