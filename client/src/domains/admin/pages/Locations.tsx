import { useLocations } from "@shared/hooks/useLocations";
import { useCabins } from "@shared/hooks";
import type { Location } from "@shared/types/location";
import { useState, useMemo } from "react";
import { Pencil, MapPin, Plus, Trash2, Home, Search, Loader2, Globe, X, Save } from "lucide-react";
import toast from "react-hot-toast";

const Locations = () => {
  const { locations = [], isLoading: isLocationsLoading, addLocation, removeLocation, editLocation, isCreating, isUpdating, isDeleting } = useLocations();
  const { cabins = [], isLoading: isCabinsLoading } = useCabins();

  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [newLocation, setNewLocation] = useState({ 
    name: "", 
    city: "", 
    country: "", 
    description: "", 
    image_url: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000&auto=format&fit=crop" 
  });
  
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [editForm, setEditForm] = useState({ 
    name: "", 
    city: "", 
    country: "", 
    description: "", 
    image_url: "" 
  });

  const locationStats = useMemo(() => {
    const stats: Record<string, number> = {};
    const normalize = (s?: string) => s?.toLowerCase().trim() || "";

    cabins.forEach(cabin => {
      const locationName = normalize(cabin.location?.name);
      if (locationName) {
        stats[locationName] = (stats[locationName] || 0) + 1;
      }
    });
    return stats;
  }, [cabins]);

  const getLocationCount = (location: Location) => {
    const normalize = (s?: string) => s?.toLowerCase().trim() || "";
    return locationStats[normalize(location.name)] || 0;
  };

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => 
      (loc.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loc.city || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (loc.country || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [locations, searchTerm]);

  const handleAdd = () => {
    if (!newLocation.name.trim() || !newLocation.city.trim() || !newLocation.country.trim()) {
      toast.error("Name, City, and Country are required");
      return;
    }

    addLocation(newLocation, {
      onSuccess: () => {
        setNewLocation({ 
          name: "", 
          city: "", 
          country: "", 
          description: "", 
          image_url: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000&auto=format&fit=crop" 
        });
        setIsAdding(false);
      }
    });
  };

  const openEdit = (location: Location) => {
    setEditingLocation(location);
    setEditForm({
      name: location.name ?? "",
      city: location.city ?? "",
      country: location.country ?? "",
      description: location.description ?? "",
      image_url: location.image_url ?? "",
    });
  };

  const handleUpdate = () => {
    if (!editingLocation || !editForm.name.trim() || !editForm.city.trim() || !editForm.country.trim()) {
      toast.error("Name, City, and Country are required");
      return;
    }

    editLocation({
      id: editingLocation.id,
      data: {
        ...editForm,
      },
    }, {
      onSuccess: () => setEditingLocation(null)
    });
  };

  const handleDelete = (id: string, location: Location) => {
    const count = getLocationCount(location);
    if (count > 0) {
        toast.error(`Cannot delete location. It has ${count} cabins assigned (including duplicates).`);
        return;
    }
    if (confirm("Are you sure you want to delete this location?")) {
      removeLocation(id);
    }
  };

  const isLoading = isLocationsLoading || isCabinsLoading;

  const inputLabelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block";
  const inputBaseClass = "w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm font-bold focus:border-sky-500 focus:ring-8 focus:ring-sky-500/5 outline-none transition-all dark:text-white";
  const modalInputBaseClass = "w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm font-bold focus:border-sky-500 focus:ring-8 focus:ring-sky-500/5 outline-none transition-all dark:text-white";

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Geographic Locations</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage global pool of resort areas, regional zones, and cabin destinations.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all w-64"
                />
            </div>
            <button onClick={() => setIsAdding(!isAdding)} className={`btn ${isAdding ? "btn-secondary" : "btn-primary"} h-10 px-4`}>
                {isAdding ? "Cancel" : <><Plus size={18} /> Add Location</>}
            </button>
        </div>
      </div>

      {isAdding && (
        <div className="card p-8 space-y-8 bg-amber-50/20 dark:bg-amber-900/10 border-amber-100/50 dark:border-amber-900/20 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                <MapPin size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Initialize New Area</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <label className={inputLabelClass}>Area Name</label>
                <input
                    placeholder="E.g. Alpine Heights"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                    className={inputBaseClass}
                />
            </div>
            <div className="space-y-2">
                <label className={inputLabelClass}>City</label>
                <input
                    placeholder="E.g. Aspen"
                    value={newLocation.city}
                    onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                    className={inputBaseClass}
                />
            </div>
            <div className="space-y-2">
                <label className={inputLabelClass}>Country</label>
                <input
                    placeholder="E.g. USA"
                    value={newLocation.country}
                    onChange={(e) => setNewLocation({ ...newLocation, country: e.target.value })}
                    className={inputBaseClass}
                />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className={inputLabelClass}>Image URL</label>
                <div className="relative">
                    <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        placeholder="https://..."
                        value={newLocation.image_url}
                        onChange={(e) => setNewLocation({ ...newLocation, image_url: e.target.value })}
                        className={`${inputBaseClass} pl-12`}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className={inputLabelClass}>Narrative Description</label>
                <input
                    placeholder="Short description of the area..."
                    value={newLocation.description}
                    onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                    className={inputBaseClass}
                />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-amber-100/50 dark:border-amber-900/20">
            <button onClick={handleAdd} disabled={isCreating} className="btn btn-primary px-10 shadow-lg shadow-amber-500/10">
                {isCreating ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> Initialize Area</>}
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden shadow-premium">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Image</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Cabins</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Region</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLocations.map((loc) => (
              <tr key={loc.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-8 py-5">
                  {loc.image_url ? (
                    <img
                      src={loc.image_url}
                      alt={loc.name}
                      className="h-10 w-16 object-cover rounded-lg shadow-sm border border-slate-100 dark:border-slate-800"
                    />
                  ) : (
                    <div className="h-10 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-[10px] text-slate-400 uppercase font-black">
                      No Img
                    </div>
                  )}
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <MapPin size={14} className="text-sky-500 flex-shrink-0" />
                        {loc.name}
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{loc.description || "No description provided."}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30">
                      <Home size={12} />
                      <span className="text-[11px] font-black uppercase tracking-wider">{getLocationCount(loc) || 0}</span>
                    </div>
                </td>
                <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-350">
                        <Globe size={14} className="text-slate-400" />
                        <span className="text-sm font-semibold">{loc.city}, {loc.country}</span>
                    </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-2 transition-all duration-300">
                    <button 
                        onClick={() => openEdit(loc)} 
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-200 dark:hover:border-amber-900 shadow-sm transition-all"
                        title="Edit Location"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                        onClick={() => handleDelete(loc.id, loc)} 
                        disabled={isDeleting} 
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900 shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete Location"
                    >
                      {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLocations.length === 0 && (
            <div className="py-20 text-center">
                <Search size={40} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold tracking-tight">No locations found.</p>
            </div>
        )}
      </div>

      {editingLocation && (
        <div className="modal-overlay">
          <div className="modal-content w-full max-w-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Edit Location</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Update geographic region: <span className="text-sky-500">{editingLocation.name}</span></p>
              </div>
              <button onClick={() => setEditingLocation(null)} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-8 bg-slate-50/30 dark:bg-slate-950/30 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className={inputLabelClass}>Area Name</label>
                    <input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className={modalInputBaseClass}
                    />
                </div>
                <div className="space-y-2">
                    <label className={inputLabelClass}>City</label>
                    <input
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className={modalInputBaseClass}
                    />
                </div>
                <div className="space-y-2">
                    <label className={inputLabelClass}>Country</label>
                    <input
                        value={editForm.country}
                        onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                        className={modalInputBaseClass}
                    />
                </div>
              </div>

              <div className="space-y-2">
                <label className={inputLabelClass}>Visual Reference (URL)</label>
                <input
                  value={editForm.image_url}
                  onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                  className={modalInputBaseClass}
                />
              </div>

              <div className="space-y-2">
                <label className={inputLabelClass}>Narrative Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className={`${modalInputBaseClass} min-h-[120px] resize-none leading-relaxed`}
                />
              </div>
            </div>

            <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3">
              <button onClick={() => setEditingLocation(null)} className="btn btn-secondary px-6">
                Discard
              </button>
              <button onClick={handleUpdate} disabled={isUpdating} className="btn btn-primary px-10 shadow-xl shadow-sky-500/20">
                {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Update Location</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;
