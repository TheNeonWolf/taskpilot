import Navbar from "@/components/Navbar";
export default function Home() {
  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome 👋
        </h2>

        <p className="mt-2 text-gray-600">
          Here's what's happening with your projects.
        </p>
      </main>
    </>
  );
}