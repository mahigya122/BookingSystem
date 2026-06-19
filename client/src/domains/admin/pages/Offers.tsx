import type { Offer } from "@shared/types/offer";
import { useCabins, useOffers, useUpdateCabin } from "@shared/hooks";
import { useState, useMemo, useEffect } from "react";
import { Pencil, Plus, Tag, Trash2, Home, Search, Loader2, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";
import toast from "react-hot-toast";
import type { Cabin } from "@shared/types/cabin";

const Offers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    offers = [],
    totalCount = 0,
    isLoading: isOffersLoading,
    addOffer,
    removeOffer,
    editOffer,
    isCreating,
    isUpdating,
    isDeleting,
  } = useOffers(currentPage, 10, searchTerm);

  const { cabins = [], isLoading: isCabinsLoading } = useCabins();
  const { editCabin, isPending: isUpdatingCabin } = useUpdateCabin();
  
  const totalPages = Math.ceil(totalCount / 10);

  const [isAdding, setIsAdding] = useState(false);

  const [newOffer, setNewOffer] = useState({ 
    title: "", 
    description: "", 
    discount_percent: 0, 
    image_url: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1000&auto=format&fit=crop",
    badge: "Limited"
  });
  
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [viewingOffer, setViewingOffer] = useState<Offer | null>(null);
  const [editForm, setEditForm] = useState({ 
    title: "", 
    description: "", 
    discount_percent: 0, 
    image_url: "",
    badge: ""
  });

  // Calculate which cabins use which offer (aggregated by title to handle duplicated records)
  const offerStats = useMemo(() => {
    const stats: Record<string, number> = {};
    const normalize = (s?: string) => s?.toLowerCase().trim() || "";

    cabins.forEach(cabin => {
      cabin.offers?.forEach(offer => {
        const title = normalize(offer.title || (offer as any).name);
        stats[title] = (stats[title] || 0) + 1;
      });
    });
    return stats;
  }, [cabins]);

  const getOfferCount = (offer: Offer) => {
    const normalize = (s?: string) => s?.toLowerCase().trim() || "";
    return offerStats[normalize(offer.title || (offer as any).name)] || 0;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleAdd = () => {
    if (!newOffer.title.trim()) {
      toast.error("Offer title is required");
      return;
    }

    addOffer(newOffer, {
      onSuccess: () => {
        setNewOffer({ 
          title: "", 
          description: "", 
          discount_percent: 0, 
          image_url: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1000&auto=format&fit=crop",
          badge: "Limited"
        });
        setIsAdding(false);
      }
    });
  };

  const openEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setEditForm({
      title: offer.title || offer.name || "",
      description: offer.description || "",
      discount_percent: offer.discount_percent ?? (offer as any).discount_pct ?? 0,
      image_url: offer.image_url || "",
      badge: offer.badge || "Limited",
    });
  };

  const handleUpdate = () => {
    if (!editingOffer || !editForm.title.trim()) {
      toast.error("Offer title is required");
      return;
    }

    editOffer({
      id: editingOffer.id,
      data: {
        ...editForm,
        discount_percent: Number(editForm.discount_percent) || 0,
      },
    }, {
      onSuccess: () => setEditingOffer(null)
    });
  };

  const toggleCabinOffer = (cabin: Cabin, offerId: string) => {
    const currentOfferIds = cabin.offers?.map(o => o.id) || [];
    const isLinked = currentOfferIds.includes(offerId);
    
    let nextOfferIds: string[];
    if (isLinked) {
      nextOfferIds = currentOfferIds.filter(id => id !== offerId);
    } else {
      nextOfferIds = [...currentOfferIds, offerId];
    }

    editCabin({
      id: cabin.id,
      data: { offer_ids: nextOfferIds }
    });
  };

  const handleDelete = (id: string, offer: Offer) => {
    const count = getOfferCount(offer);
    if (count > 0) {
      toast.error(`Cannot delete offer. It is applied to ${count} cabins (including duplicates).`);
      return;
    }
    if (confirm("Are you sure you want to delete this offer?")) {
      removeOffer(id);
    }
  };

  const isLoading = isOffersLoading || isCabinsLoading;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
      </div>
    );
  }

  // Find cabins with current offer
  const cabinsWithOffer = viewingOffer ? cabins.filter(c => c.offers?.some(o => o.id === viewingOffer.id)) : [];
  const cabinsWithoutOffer = viewingOffer ? cabins.filter(c => !c.offers?.some(o => o.id === viewingOffer.id)) : [];

  return (
      <div className="px-6 md:px-0 space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Special Offers</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage global pool of unique seasonal discounts and promotions.</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search offers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all w-64"
                />
            </div>
            <button onClick={() => setIsAdding(!isAdding)} className={`btn ${isAdding ? "btn-secondary" : "btn-primary"} h-10 px-4`}>
                {isAdding ? "Cancel" : <><Plus size={18} /> Add Offer</>}
            </button>
        </div>
      </div>

      {isAdding && (
        <div className="card p-6 space-y-6 bg-emerald-50/30 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Offer Title</label>
                <input
                    placeholder="E.g. Summer Special"
                    value={newOffer.title}
                    onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Discount (%)</label>
                <input
                    type="number"
                    placeholder="0"
                    value={newOffer.discount_percent}
                    onChange={(e) => setNewOffer({ ...newOffer, discount_percent: Number(e.target.value) })}
                    className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Badge Text</label>
                <input
                    placeholder="E.g. Hot Deal"
                    value={newOffer.badge}
                    onChange={(e) => setNewOffer({ ...newOffer, badge: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image URL</label>
                <input
                    placeholder="https://..."
                    value={newOffer.image_url}
                    onChange={(e) => setNewOffer({ ...newOffer, image_url: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                />
            </div>
          </div>
          <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                <textarea
                    placeholder="Describe the promotion..."
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm min-h-20"
                />
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={handleAdd} disabled={isCreating} className="btn btn-primary px-8">
                {isCreating ? <Loader2 size={18} className="animate-spin" /> : "Save Offer"}
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden shadow-premium">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Promotion</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Applied To</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Discount</th>
              <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Badge</th>
              <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {offers.map((offer) => (
              <tr key={offer.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Tag size={14} className="text-emerald-500" />
                        {offer.title || offer.name || "Untitled offer"}
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{offer.description || "No description provided."}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                      <Home size={12} />
                      <span className="text-[11px] font-black uppercase tracking-wider">{getOfferCount(offer) || 0} Cabins</span>
                    </div>
                </td>
                <td className="px-8 py-5">
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{(offer.discount_percent ?? (offer as any).discount_pct ?? 0)}% OFF</span>
                </td>
                <td className="px-8 py-5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        {offer.badge || "Default"}
                    </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-2 transition-all duration-300">
                    <button 
                        onClick={() => setViewingOffer(offer)} 
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-sky-500 hover:border-sky-200 dark:hover:border-sky-900 shadow-sm transition-all"
                        title="View Cabins"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                        onClick={() => openEdit(offer)} 
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-200 dark:hover:border-amber-900 shadow-sm transition-all"
                        title="Edit Offer"
                    >
                      <Pencil size={18} />
                    </button>
                    <button 
                        onClick={() => handleDelete(offer.id, offer)} 
                        disabled={isDeleting} 
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900 shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete Offer"
                    >
                      {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {offers.length === 0 && (
            <div className="py-20 text-center">
                <Search size={40} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold tracking-tight">No offers found.</p>
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

      {editingOffer && (
        <div className="modal-overlay">
          <div className="modal-content w-full max-w-xl p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Edit Offer</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Update promotional details</p>
              </div>
              <button onClick={() => setEditingOffer(null)} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Offer Title</label>
                    <input
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Discount (%)</label>
                    <input
                        value={editForm.discount_percent}
                        onChange={(e) => setEditForm({ ...editForm, discount_percent: Number(e.target.value) })}
                        type="number"
                        className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Badge Text</label>
                    <input
                        value={editForm.badge}
                        onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image URL</label>
                    <input
                        value={editForm.image_url}
                        onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    />
                </div>
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
              <button onClick={() => setEditingOffer(null)} className="btn btn-secondary px-6">
                Cancel
              </button>
              <button onClick={handleUpdate} disabled={isUpdating} className="btn btn-primary px-10">
                {isUpdating ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingOffer && (
        <div className="modal-overlay">
          <div className="modal-content w-full max-w-2xl p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{viewingOffer.title || viewingOffer.name}</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Manage cabins assigned to this offer</p>
              </div>
              <button onClick={() => setViewingOffer(null)} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500">Currently Applied ({cabinsWithOffer.length})</h3>
                <div className="grid grid-cols-1 gap-2">
                  {cabinsWithOffer.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No cabins currently assigned.</p>
                  ) : (
                    cabinsWithOffer.map(cabin => (
                      <div key={cabin.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl group">
                        <div className="flex items-center gap-3">
                          <img src={cabin.image_url} alt={cabin.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{cabin.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{cabin.location?.name || "No Location"}</p>
                          </div>
                        </div>
                        <button 
                          disabled={isUpdatingCabin}
                          onClick={() => toggleCabinOffer(cabin, viewingOffer.id)}
                          className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-500 hover:text-white transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-widest text-sky-500">Available Cabins ({cabinsWithoutOffer.length})</h3>
                <div className="grid grid-cols-1 gap-2">
                  {cabinsWithoutOffer.map(cabin => (
                    <div key={cabin.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <img src={cabin.image_url} alt={cabin.name} className="w-10 h-10 rounded-xl object-cover opacity-60" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{cabin.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">{cabin.location?.name || "No Location"}</p>
                        </div>
                      </div>
                      <button 
                        disabled={isUpdatingCabin}
                        onClick={() => toggleCabinOffer(cabin, viewingOffer.id)}
                        className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-900/30 hover:bg-sky-500 hover:text-white transition-all"
                      >
                        Add to Offer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button onClick={() => setViewingOffer(null)} className="btn btn-primary px-10">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offers;
