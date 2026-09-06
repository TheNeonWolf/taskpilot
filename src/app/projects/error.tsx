"use client";

import Navbar from "@/components/Navbar";
import ErrorState from "@/components/ErrorState";

type ErrorProps = {
  reset: () => void;
};

export default function Error({ reset }: ErrorProps) {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <ErrorState
          title="Unable to load projects"
          message="We couldn't load your projects. Please try again."
          onRetry={reset}
        />
      </main>
    </>
  );
}