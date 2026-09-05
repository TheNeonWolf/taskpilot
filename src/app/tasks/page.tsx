import Navbar from "@/components/Navbar";

export default function TasksPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Tasks
        </h1>

        <p className="mt-2 text-gray-600">
          View and manage all your tasks.
        </p>
      </main>
    </>
  );
}