import { useLocations } from "@shared/hooks/useLocations";
import { useCabins, useUpdateCabin } from "@shared/hooks";
import type { Location } from "@shared/types/location";
import { useState, useMemo, useEffect } from "react";
import { Pencil, MapPin, Plus, Trash2, Home, Search, Loader2, Globe, X, Save, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import toast from "react-hot-toast";
import type { Cabin } from "@shared/types/cabin";

const Locations = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    locations = [],
    totalCount = 0,
    isLoading: isLocationsLoading,
    addLocation,
    removeLocation,
    editLocation,
    isCreating,
    isUpdating,
    isDeleting
  } = useLocations(currentPage, 10, searchTerm);

  const { cabins = [], isLoading: isCabinsLoading } = useCabins();
  const { editCabin, isPending: isUpdatingCabin } = useUpdateCabin();

  const totalPages = Math.ceil(totalCount / 10);

  const [isAdding, setIsAdding] = useState(false);

  const [newLocation, setNewLocation] = useState({ 
    name: "", 
    city: "", 
    country: "", 
    description: "", 
    image_url: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000&auto=format&fit=crop" 
  });
  
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [viewingLocation, setViewingLocation] = useState<Location | null>(null);
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

    cabins.forEach((cabin: Cabin) => {
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

  const toggleCabinLocation = (cabin: Cabin, locationId: string | null) => {
    editCabin({
      id: cabin.id,
      data: { location_id: locationId || undefined }
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

  // Find cabins with current location
  const cabinsWithLocation = viewingLocation ? cabins.filter((c: Cabin) => c.location_id === viewingLocation.id) : [];
  const cabinsWithoutLocation = viewingLocation ? cabins.filter((c: Cabin) => c.location_id !== viewingLocation.id) : [];

  return (
      <div className="px-6 md:px-0 space-y-8 animate-slide-up pb-12">
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
        <div className="card p-8 space-y-8 bg-sky-50/20 dark:bg-sky-900/10 border-sky-100/50 dark:border-sky-900/20 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600">
                <MapPin size={20} />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">New Global Destination</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <label className={inputLabelClass}>Destination Name</label>
                <input
                    placeholder="E.g. Emerald Bay"
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                    className={inputBaseClass}
                />
            </div>
            <div className="space-y-2">
                <label className={inputLabelClass}>City / Region</label>
                <input
                    placeholder="E.g. South Lake Tahoe"
                    value={newLocation.city}
                    onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                    className={inputBaseClass}
                />
            </div>
            <div className="space-y-2">
                <label className={inputLabelClass}>Country</label>
                <input
                    placeholder="E.g. United States"
                    value={newLocation.country}
                    onChange={(e) => setNewLocation({ ...newLocation, country: e.target.value })}
                    className={inputBaseClass}
                />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className={inputLabelClass}>Cover Image URL</label>
                <input
                    placeholder="https://..."
                    value={newLocation.image_url}
                    onChange={(e) => setNewLocation({ ...newLocation, image_url: e.target.value })}
                    className={inputBaseClass}
                />
            </div>
            <div className="space-y-2">
                <label className={inputLabelClass}>Brief Narrative</label>
                <textarea
                    placeholder="Describe the area's allure..."
                    value={newLocation.description}
                    onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                    className={`${inputBaseClass} min-h-[46px] resize-none pt-2`}
                />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-sky-100/50 dark:border-sky-900/20">
            <button onClick={handleAdd} disabled={isCreating} className="btn btn-primary px-10 shadow-lg shadow-sky-500/10">
                {isCreating ? <Loader2 size={18} className="animate-spin" /> : <><Globe size={18} /> Establish Destination</>}
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden shadow-premium">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Destination</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Geography</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory</th>
              <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {locations.map((location) => (
              <tr key={location.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <MapPin size={14} className="text-sky-500" />
                        {location.name}
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{location.description || "No description provided."}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{location.city}</span>
                    <span className="text-[11px] text-slate-400 uppercase tracking-widest font-black">{location.country}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      <Home size={12} />
                      <span className="text-[11px] font-black uppercase tracking-wider">{getLocationCount(location)} Cabins</span>
                    </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-2 transition-all duration-300">
                    <button 
                        onClick={() => setViewingLocation(location)} 
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-sky-500 hover:border-sky-200 dark:hover:border-sky-900 shadow-sm transition-all"
                        title="View Cabins"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                        onClick={() => openEdit(location)} 
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-200 dark:hover:border-amber-900 shadow-sm transition-all"
                        title="Edit Location"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                        onClick={() => handleDelete(location.id, location)} 
                        disabled={isDeleting} 
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-250 border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900 shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
        
        {locations.length === 0 && (
            <div className="py-20 text-center">
                <Search size={40} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold tracking-tight">No locations found.</p>
            </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Showing Page {currentPage} <span className="mx-1 text-slate-300 dark:text-slate-700">/</span> {totalPages}
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn btn-secondary py-1.5 px-3 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeft size={14} />
                Prev
              </button>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn btn-secondary py-1.5 px-3 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {editingLocation && (
        <div className="modal-overlay">
          <div className="modal-content w-full max-w-xl p-8 space-y-8 animate-in zoom-in-95 duration-200 border-2 border-slate-100 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Edit Destination</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Updating global destination parameters</p>
              </div>
              <button onClick={() => setEditingLocation(null)} className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className={inputLabelClass}>Destination Name</label>
                    <input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className={modalInputBaseClass}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className={inputLabelClass}>City / Region</label>
                    <input
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className={modalInputBaseClass}
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className={inputLabelClass}>Country</label>
                    <input
                        value={editForm.country}
                        onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                        className={modalInputBaseClass}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className={inputLabelClass}>Cover Image URL</label>
                    <input
                        value={editForm.image_url}
                        onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                        className={modalInputBaseClass}
                    />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={inputLabelClass}>Narrative Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className={`${modalInputBaseClass} min-h-28 mt-1 outline-none resize-none leading-relaxed`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setEditingLocation(null)} className="btn btn-secondary px-8 h-12">
                Cancel
              </button>
              <button onClick={handleUpdate} disabled={isUpdating} className="btn btn-primary px-12 h-12">
                {isUpdating ? <Loader2 size={20} className="animate-spin" /> : <><Save size={20} className="mr-2" /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingLocation && (
        <div className="modal-overlay">
          <div className="modal-content w-full max-w-2xl p-8 space-y-6 animate-in zoom-in-95 duration-200 border-2 border-slate-100 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{viewingLocation.name}</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Manage cabins situated in this location</p>
              </div>
              <button onClick={() => setViewingLocation(null)} className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar font-bold">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Currently Assigned ({cabinsWithLocation.length})</h3>
                <div className="grid grid-cols-1 gap-2">
                  {cabinsWithLocation.length === 0 ? (
                    <p className="text-sm text-slate-400 italic font-medium py-6 text-center bg-slate-50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">No cabins are currently mapped to this location.</p>
                  ) : (
                    cabinsWithLocation.map(cabin => (
                      <div key={cabin.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl group">
                        <div className="flex items-center gap-3">
                          <img src={cabin.image_url} alt={cabin.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{cabin.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{cabin.capacity} Guests Max</p>
                          </div>
                        </div>
                        <button 
                          disabled={isUpdatingCabin}
                          onClick={() => toggleCabinLocation(cabin, null)}
                          className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-500 hover:text-white transition-all"
                        >
                          Unlink
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500">Other Cabins ({cabinsWithoutLocation.length})</h3>
                <div className="grid grid-cols-1 gap-2">
                  {cabinsWithoutLocation.map(cabin => (
                    <div key={cabin.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl group">
                      <div className="flex items-center gap-3">
                        <img src={cabin.image_url} alt={cabin.name} className="w-10 h-10 rounded-xl object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{cabin.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Currently: <span className="text-slate-600 dark:text-slate-300">{cabin.location?.name || "Unassigned"}</span></p>
                        </div>
                      </div>
                      <button 
                        disabled={isUpdatingCabin}
                        onClick={() => toggleCabinLocation(cabin, viewingLocation.id)}
                        className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-900/30 hover:bg-sky-500 hover:text-white transition-all"
                      >
                        Set Location
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setViewingLocation(null)} className="btn btn-primary px-12 h-12 text-xs">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;
