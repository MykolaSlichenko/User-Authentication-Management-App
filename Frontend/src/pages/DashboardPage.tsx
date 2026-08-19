import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, loading, error } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section id="home" className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Dashboard
          </p>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Welcome{user?.firstName}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            A clean, responsive experience with quick access to your main sections.
          </p>
        </section>

        {loading && <p className="text-lg text-slate-600">Loading user...</p>}
        {error && <p className="text-lg text-red-600">{error}</p>}

      </main>
    </div>
  );
}
