import { useMemo, useState } from "react";
import { useCabins, useUser } from "../../shared/auth_hooks";
import { useCabins } from "@shared/auth_hooks/cabin/useCabins";
import Navbar from "@shared/components/layout/Navbar";

const ClientDashboard = () => {
  const { cabins = [], isLoading } = useCabins();
  const { user } = useUser();

  const [filters, setFilters] = useState({ guests: 2, breakfast: false });

  const filtered = useMemo(() => {
    // simple placeholder filter
    return cabins;
  }, [cabins, filters]);

  if (isLoading) return <p>Loading cabins...</p>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome{user?.email ? `, ${user.email}` : ''}</h1>
        <p className="text-sm text-slate-500">Guest dashboard</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((cabin: any) => (
              <div key={cabin.id} className="card p-4">
                <div className="h-40 bg-slate-200 rounded mb-3" />
                <h3 className="font-semibold">{cabin.name}</h3>
                <p className="text-sm text-slate-500">{cabin.description}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="lg:col-span-4">
          <div className="card p-4">
            <h4 className="font-semibold mb-2">Filters</h4>
            <div className="space-y-2 text-sm">
              <div>Guests: {filters.guests}</div>
              <div>Breakfast: {filters.breakfast ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ClientDashboard;
