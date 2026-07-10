import { useActivities } from "@shared/hooks/useActivities";
import { useCabins, useUpdateCabin } from "@shared/hooks";
import { getOptimizedImageUrl } from "@shared/utils/imageUtils";
/* eslint-disable react-hooks/set-state-in-effect */
import type { Activity } from "@shared/types/activity";
import { useState, useMemo, useEffect } from "react";
import { Pencil, Plus, Trash2, Zap, Home, Search, Loader2, X, Save, ChevronLeft, ChevronRight, ChevronDown, Eye } from "lucide-react";
import toast from "react-hot-toast";
import type { Cabin } from "@shared/types/cabin";

const CABINS_PER_PAGE = 2;
const INCLUDED_CABINS_PER_PAGE = 3;

const Activities = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const {
    activities = [],
    totalCount = 0,
    isLoading: isActivitiesLoading,
    addActivity,
    removeActivity,
    editActivity,
    isCreating,
    isUpdating,
    isDeleting,
  } = useActivities(currentPage, 10, searchTerm);

  const { cabins = [], isLoading: isCabinsLoading } = useCabins();
  const { editCabin, isPending: isUpdatingCabin } = useUpdateCabin();

  const totalPages = Math.ceil(totalCount / 10);

  const [isAdding, setIsAdding] = useState(false);
  
  const [newActivity, setNewActivity] = useState({ 
    name: "", 
    description: "", 
    price: 0, 
    image_url: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1000&auto=format&fit=crop"
  });
  
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [viewingActivity, setViewingActivity] = useState<Activity | null>(null);
  const [editForm, setEditForm] = useState({ 
    name: "", 
    description: "", 
    price: 0, 
    image_url: ""
  });

  const [includedCabinsPage, setIncludedCabinsPage] = useState(0);
  const [showOtherCabins, setShowOtherCabins] = useState(false);
  const [otherCabinsPage, setOtherCabinsPage] = useState(0);

  useEffect(() => {
    setIncludedCabinsPage(0);
    setShowOtherCabins(false);
    setOtherCabinsPage(0);
  }, [viewingActivity]);

  // Calculate which cabins use which activity (aggregated by name to handle duplicated records)
  const activityStats = useMemo(() => {
    const stats: Record<string, number> = {};
    const normalize = (s?: string) => s?.toLowerCase().trim() || "";

    cabins.forEach(cabin => {
      cabin.activities?.forEach(activity => {
        const name = normalize(activity.name);
        stats[name] = (stats[name] || 0) + 1;
      });
    });
    return stats;
  }, [cabins]);

  const getActivityCount = (activity: Activity) => {
    const normalize = (s?: string) => s?.toLowerCase().trim() || "";
    return activityStats[normalize(activity.name)] || 0;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleAdd = () => {
    if (!newActivity.name.trim()) {
      toast.error("Activity name is required");
      return;
    }

    addActivity(newActivity, {
      onSuccess: () => {
        setNewActivity({ 
          name: "", 
          description: "", 
          price: 0, 
          image_url: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1000&auto=format&fit=crop"
        });
        setIsAdding(false);
      }
    });
  };

  const openEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setEditForm({
      name: activity.name,
      description: activity.description || "",
      price: activity.price ?? 0,
      image_url: activity.image_url || "",
    });
  };

  const handleUpdate = () => {
    if (!editingActivity || !editForm.name.trim()) {
      toast.error("Activity name is required");
      return;
    }

    editActivity({
      id: editingActivity.id,
      data: {
        ...editForm,
        price: Number(editForm.price) || 0,
      },
    }, {
      onSuccess: () => setEditingActivity(null)
    });
  };

  const toggleCabinActivity = (cabin: Cabin, activityId: string) => {
    const currentActivityIds = cabin.activities?.map(a => a.id) || [];
    const isLinked = currentActivityIds.includes(activityId);
    
    let nextActivityIds: string[];
    if (isLinked) {
      nextActivityIds = currentActivityIds.filter(id => id !== activityId);
    } else {
      nextActivityIds = [...currentActivityIds, activityId];
    }

    editCabin({
      id: cabin.id,
      data: { activity_ids: nextActivityIds }
    });
  };

  const handleDelete = (id: string, activity: Activity) => {
    const count = getActivityCount(activity);
    if (count > 0) {
        toast.error(`Cannot delete activity. It is linked to ${count} cabins (including duplicates).`);
        return;
    }
    if (confirm("Are you sure you want to delete this activity?")) {
      removeActivity(id);
    }
  };

  const isLoading = isActivitiesLoading || isCabinsLoading;

  const inputLabelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block";
  const modalInputBaseClass = "w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3 text-sm font-bold focus:border-sky-500 focus:ring-8 focus:ring-sky-500/5 outline-none transition-all dark:text-white";



  // Find cabins with current activity
  const cabinsWithActivity = viewingActivity 
    ? cabins.filter(c => c.activities?.some(a => a.id === viewingActivity.id)) 
    : [];
  const cabinsWithoutActivity = viewingActivity 
    ? cabins.filter(c => !c.activities?.some(a => a.id === viewingActivity.id)) 
    : [];

  const includedCabinsTotalPages = Math.max(1, Math.ceil(cabinsWithActivity.length / INCLUDED_CABINS_PER_PAGE));
  const paginatedIncludedCabins = cabinsWithActivity.slice(
    includedCabinsPage * INCLUDED_CABINS_PER_PAGE,
    includedCabinsPage * INCLUDED_CABINS_PER_PAGE + INCLUDED_CABINS_PER_PAGE
  );

  const otherCabinsTotalPages = Math.max(1, Math.ceil(cabinsWithoutActivity.length / CABINS_PER_PAGE));
  const paginatedOtherCabins = cabinsWithoutActivity.slice(
    otherCabinsPage * CABINS_PER_PAGE,
    otherCabinsPage * CABINS_PER_PAGE + CABINS_PER_PAGE
  );

  return (
    <div className="space-y-6 animate-slide-up pb-2 pt-2 px-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
            <p
        className="text-sky-500 text-sm font-bold block"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Activities Management
      </p>
          <h1 className=" text-2xl
          md:text-3xl
          font-black
          text-slate-900
          dark:text-white
          tracking-tighter

          mt-0">Resort Activities</h1>
          <p className="text-xs
          md:text-sm
          text-slate-500
          dark:text-slate-400
          max-w-lg
          leading-relaxed

          mt-0">Manage global pool of unique experiences, tours, and excursions.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
                <input 
                    type="text" 
                    placeholder="Search activities..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full sm:w-64 outline-none transition-all text-xs font-bold focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 placeholder-slate-500"
                    style={{
                      backgroundColor: "#F4F0FF",
                      color: "#374151",
                      borderColor: "#E4D9FF",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      height: "32px",
                      borderRadius: "9999px",
                      paddingTop: "0px",
                      paddingBottom: "0px",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.02)"
                    }}
                />
            </div>
            <button 
                onClick={() => setIsAdding(true)} 
                className="h-8 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 active:scale-95 shadow-sm flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-sky-600 dark:hover:bg-sky-400 dark:hover:text-white"
            >
                <Plus size={14} className="mr-1" /> Add Activity
            </button>
        </div>
      </div>



      <div className="mt-6 card overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-amber-50/50 dark:bg-amber-950/30 border-b border-amber-100/50 dark:border-amber-900/20">
            <tr>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 w-28">Image</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Activity</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Applied To</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
              <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 w-44">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-8 py-5 text-left w-28">
                      <div className="h-10 w-16 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    </td>
                    <td className="px-8 py-5 text-left">
                      <div className="space-y-2">
                        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        <div className="h-3 w-48 rounded bg-slate-100 dark:bg-slate-900/50 animate-pulse" />
                      </div>
                    </td>
                    <td className="px-8 py-5 text-left">
                      <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    </td>
                    <td className="px-8 py-5 text-left">
                      <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    </td>
                    <td className="px-8 py-5 text-right w-44">
                      <div className="flex justify-end gap-2">
                        <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                      </div>
                    </td>
                  </tr>
                ))
              : activities.map((activity) => (
              <tr key={activity.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-8 py-5 text-left w-28">
                    {activity.image_url ? (
                        <img src={getOptimizedImageUrl(activity.image_url, 'thumbnail')} className="h-10 w-16 object-cover rounded-lg shadow-sm" alt={activity.name} />
                    ) : (
                        <div className="h-10 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                    )}
                </td>
                <td className="px-8 py-5 text-left">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Zap size={14} className="text-sky-500" />
                        {activity.name}
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{activity.description || "No description provided."}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                      <Home size={12} />
                      <span className="text-[11px] font-black uppercase tracking-wider">{getActivityCount(activity) || 0} Cabins</span>
                    </div>
                </td>
                <td className="px-8 py-5 text-left">
                  <span className="font-black text-sky-600 dark:text-sky-400 text-sm">${activity.price}</span>
                </td>
                <td className="px-8 py-5 text-right w-44">
                  <div className="flex items-center justify-end gap-2 transition-all duration-300">
                    <button 
                        onClick={() => setViewingActivity(activity)} 
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-sky-500 hover:border-sky-200 dark:hover:border-sky-900 shadow-sm transition-all"
                        title="View Cabins"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                        onClick={() => openEdit(activity)} 
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-200 dark:hover:border-amber-900 shadow-sm transition-all"
                        title="Edit Activity"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                        onClick={() => handleDelete(activity.id, activity)} 
                        disabled={isDeleting} 
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900 shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete Activity"
                    >
                      {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {activities.length === 0 && (
            <div className="py-20 text-center">
                <Search size={40} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold tracking-tight">No activities found.</p>
            </div>
        )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="px-2 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
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

      {editingActivity && (
        <div className="modal-overlay">
          <div className="modal-content w-full max-w-2xl flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Edit Experience</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Updating: <span className="text-sky-500">{editingActivity.name}</span></p>
              </div>
              <button onClick={() => setEditingActivity(null)} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="p-8 bg-slate-50/30 dark:bg-slate-950/30 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className={inputLabelClass}>Experience Name</label>
                    <input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className={modalInputBaseClass}
                    />
                </div>
                <div className="space-y-2">
                    <label className={inputLabelClass}>Premium Price ($)</label>
                    <input
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                        type="number"
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
              <button onClick={() => setEditingActivity(null)} className="btn btn-secondary px-6">
                Discard
              </button>
              <button onClick={handleUpdate} disabled={isUpdating} className="btn btn-primary px-10 shadow-xl shadow-sky-500/20">
                {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Update Experience</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingActivity && (
        <div className="modal-overlay">
          <div className="modal-content w-full max-w-2xl p-8 space-y-6 animate-in zoom-in-95 duration-200 border-2 border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{viewingActivity.name}</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Manage cabins offering this activity</p>
              </div>
              <button onClick={() => setViewingActivity(null)} className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar font-bold">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Currently Included ({cabinsWithActivity.length})</h3>
                <div className="grid grid-cols-3 gap-4">
                  {paginatedIncludedCabins.length === 0 ? (
                    <div className="col-span-3">
                      <p className="text-sm text-slate-400 italic font-medium py-4 text-center bg-slate-50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">No cabins currently include this activity.</p>
                    </div>
                  ) : (
                    paginatedIncludedCabins.map(cabin => (
                      <div key={cabin.id} className="relative group overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 aspect-square">
                        <img 
                          src={getOptimizedImageUrl(cabin.image_url, 'thumbnail')} 
                          alt={cabin.name} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                        />
                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 text-white text-[9px] font-black uppercase tracking-widest rounded-lg backdrop-blur-sm">
                          {cabin.capacity} Guests Max
                        </div>
                        <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 text-center">
                          <p className="text-white text-xs font-black truncate w-full mb-1">{cabin.name}</p>
                          <button 
                            disabled={isUpdatingCabin}
                            onClick={() => toggleCabinActivity(cabin, viewingActivity.id)}
                            className="mt-2 h-8 w-8 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-lg"
                          >
                            <X size={14} />
                          </button>
                          <span className="text-[9px] font-black uppercase tracking-widest text-rose-400 mt-1.5">Unlink</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {cabinsWithActivity.length > INCLUDED_CABINS_PER_PAGE && (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setIncludedCabinsPage((p) => Math.max(0, p - 1))}
                      disabled={includedCabinsPage === 0}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Page {includedCabinsPage + 1} / {includedCabinsTotalPages}
                    </p>

                    <button
                      onClick={() => setIncludedCabinsPage((p) => Math.min(includedCabinsTotalPages - 1, p + 1))}
                      disabled={includedCabinsPage >= includedCabinsTotalPages - 1}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 font-bold">
                <button
                  onClick={() => setShowOtherCabins((prev) => !prev)}
                  className="w-full flex items-center justify-between group"
                >
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500">
                    Other Cabins ({cabinsWithoutActivity.length})
                  </h3>
                  <ChevronDown
                    size={16}
                    className={`text-sky-500 transition-transform duration-200 ${showOtherCabins ? "rotate-180" : ""}`}
                  />
                </button>

                {showOtherCabins && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      {paginatedOtherCabins.length === 0 ? (
                        <p className="text-sm text-slate-400 italic font-medium py-4 text-center bg-slate-50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">No other cabins available.</p>
                      ) : (
                        paginatedOtherCabins.map(cabin => (
                          <div key={cabin.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl group">
                            <div className="flex items-center gap-3">
                              <img src={getOptimizedImageUrl(cabin.image_url, 'thumbnail')} alt={cabin.name} className="w-10 h-10 rounded-xl object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                              <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">{cabin.name}</p>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{cabin.location?.name || "No Location"}</p>
                              </div>
                            </div>
                            <button 
                              disabled={isUpdatingCabin}
                              onClick={() => toggleCabinActivity(cabin, viewingActivity.id)}
                              className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-900/30 hover:bg-sky-500 hover:text-white transition-all"
                            >
                              Add to Activity
                            </button>
                          </div>
                        ))
                      )}
                    </div>

                    {cabinsWithoutActivity.length > CABINS_PER_PAGE && (
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => setOtherCabinsPage((p) => Math.max(0, p - 1))}
                          disabled={otherCabinsPage === 0}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-sky-500 hover:border-sky-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Page {otherCabinsPage + 1} / {otherCabinsTotalPages}
                        </p>

                        <button
                          onClick={() => setOtherCabinsPage((p) => Math.min(otherCabinsTotalPages - 1, p + 1))}
                          disabled={otherCabinsPage >= otherCabinsTotalPages - 1}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-sky-500 hover:border-sky-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button onClick={() => setViewingActivity(null)} className="btn btn-primary px-12 h-12 text-xs">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="modal-overlay">
          <div className="modal-content w-full max-w-xl p-8 space-y-8 animate-in zoom-in-95 duration-200 border-2 border-slate-100 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Catalog New Experience</h2>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Add a new guest experience to the pool</p>
              </div>
              <button onClick={() => setIsAdding(false)} className="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className={inputLabelClass}>Experience Name</label>
                    <input
                        placeholder="E.g. Guided Forest Hike"
                        value={newActivity.name}
                        onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                        className={modalInputBaseClass}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className={inputLabelClass}>Premium Price ($)</label>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={newActivity.price}
                        onChange={(e) => setNewActivity({ ...newActivity, price: Number(e.target.value) })}
                        className={modalInputBaseClass}
                    />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={inputLabelClass}>Visual Reference (URL)</label>
                <input
                    placeholder="https://..."
                    value={newActivity.image_url}
                    onChange={(e) => setNewActivity({ ...newActivity, image_url: e.target.value })}
                    className={modalInputBaseClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className={inputLabelClass}>Experience Description</label>
                <textarea
                    placeholder="Describe the experience..."
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    className={`${modalInputBaseClass} min-h-28 mt-1 outline-none resize-none leading-relaxed`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setIsAdding(false)} className="btn btn-secondary px-8 h-12">
                Cancel
              </button>
              <button onClick={handleAdd} disabled={isCreating} className="btn btn-primary px-12 h-12">
                {isCreating ? <Loader2 size={20} className="animate-spin" /> : <><Plus size={20} className="mr-2" /> Catalog Experience</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
