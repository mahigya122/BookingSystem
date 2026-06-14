import { useActivities } from "@shared/hooks/useActivities";
import { useCabins } from "@shared/hooks/cabin/useCabins";
import type { Activity } from "@shared/types/activity";
import { useState, useMemo } from "react";
import { Pencil, Plus, Trash2, Zap, Home, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Activities = () => {
  const { activities = [], isLoading: isActivitiesLoading, addActivity, removeActivity, editActivity, isCreating, isUpdating, isDeleting } = useActivities();
  const { cabins = [], isLoading: isCabinsLoading } = useCabins();

  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchSearchTerm] = useState("");
  
  const [newActivity, setNewActivity] = useState({ 
    name: "", 
    description: "", 
    price: 0, 
    image_url: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1000&auto=format&fit=crop"
  });
  
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [editForm, setEditForm] = useState({ 
    name: "", 
    description: "", 
    price: 0, 
    image_url: ""
  });

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

  const filteredActivities = useMemo(() => {
    return activities.filter(a => 
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activities, searchTerm]);

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
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Resort Activities</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage global pool of unique experiences, tours, and excursions.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all w-64"
                />
            </div>
            <button onClick={() => setIsAdding(!isAdding)} className={`btn ${isAdding ? "btn-secondary" : "btn-primary"} h-10 px-4`}>
                {isAdding ? "Cancel" : <><Plus size={18} /> Add Activity</>}
            </button>
        </div>
      </div>

      {isAdding && (
        <div className="card p-6 space-y-6 bg-sky-50/30 dark:bg-sky-900/10 border-sky-100 dark:border-sky-900/20 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activity Name</label>
                <input
                    placeholder="E.g. Guided Forest Hike"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price ($)</label>
                <input
                    type="number"
                    placeholder="0.00"
                    value={newActivity.price}
                    onChange={(e) => setNewActivity({ ...newActivity, price: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image URL</label>
                <input
                    placeholder="https://..."
                    value={newActivity.image_url}
                    onChange={(e) => setNewActivity({ ...newActivity, image_url: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
            </div>
          </div>
          <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                <textarea
                    placeholder="Describe the experience..."
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm min-h-20"
                />
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={handleAdd} disabled={isCreating} className="btn btn-primary px-8">
                {isCreating ? <Loader2 size={18} className="animate-spin" /> : "Save Activity"}
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden shadow-premium">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Image</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Activity</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Applied To</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredActivities.map((activity) => (
              <tr key={activity.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                    {activity.image_url ? (
                        <img src={activity.image_url} className="h-10 w-16 object-cover rounded-lg shadow-sm" alt={activity.name} />
                    ) : (
                        <div className="h-10 w-16 bg-slate-100 dark:bg-slate-800 rounded-lg" />
                    )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Zap size={14} className="text-sky-500" />
                        {activity.name}
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{activity.description || "No description provided."}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                      <Home size={12} />
                      <span className="text-[11px] font-black uppercase tracking-wider">{getActivityCount(activity) || 0} Cabins</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-black text-sky-600 dark:text-sky-400 text-sm">${activity.price}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2 transition-all duration-300">
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
        {filteredActivities.length === 0 && (
            <div className="py-20 text-center">
                <Search size={40} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold tracking-tight">No activities found.</p>
            </div>
        )}
      </div>

      {editingActivity && (
        <div className="modal-overlay">
          <div className="modal-content w-full max-w-xl p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Edit Activity</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Update global activity details</p>
              </div>
              <button onClick={() => setEditingActivity(null)} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Plus size={24} className="rotate-45 text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activity Name</label>
                    <input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price ($)</label>
                    <input
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                        type="number"
                        className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image URL</label>
                <input
                    value={editForm.image_url}
                    onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm min-h-28 mt-1 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setEditingActivity(null)} className="btn btn-secondary px-6">
                Cancel
              </button>
              <button onClick={handleUpdate} disabled={isUpdating} className="btn btn-primary px-10">
                {isUpdating ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
