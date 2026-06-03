import { useUser } from "@shared/auth_hooks";
import CabinCard from "../components/CabinCard";
import { useExplore } from "../hooks/useExplore";

const ClientDashboard = () => {
  const { cabins, isLoading, filteredCount } = useExplore();
  const { user } = useUser();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Discover Your Perfect Stay
            </h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
              {user ? `Welcome back, ${user.email?.split('@')[0]}. ` : "Discover and book your next getaway. "}
              Showing {filteredCount} available cabins.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-500">Sort by:</span>
            <select className="rounded-xl border-slate-200 bg-white px-4 py-2 text-sm font-bold dark:border-slate-800 dark:bg-slate-900">
              <option>Default</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Capacity: Large to Small</option>
            </select>
          </div>
        </div>
      </header>

      <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {cabins.map((cabin) => (
          <CabinCard 
            key={cabin.id} 
            cabin={cabin}
          />
        ))}
      </section>

      {cabins.length === 0 && (
        <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 p-12 text-center">
          <p className="text-slate-500">No cabins match your current filters. Try adjusting your price or guest count.</p>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
