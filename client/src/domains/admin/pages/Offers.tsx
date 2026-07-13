/* eslint-disable react-hooks/set-state-in-effect */
import type { Offer } from "@shared/types/offer";
import { useCabins, useOffers, useUpdateCabin } from "@shared/hooks";
import { getOptimizedImageUrl } from "@shared/utils/imageUtils";
import { useState, useMemo, useEffect } from "react";
import { Pencil, Plus, Tag, Trash2, Home, Search, Loader2, ChevronLeft, ChevronRight, ChevronDown, Eye, X } from "lucide-react";
import toast from "react-hot-toast";
import { uploadAssetImage } from "@shared/services/profileStorage";
import type { Cabin } from "@shared/types/cabin";

const CABINS_PER_PAGE = 2;
const APPLIED_CABINS_PER_PAGE = 3;

const Offers = () => {
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

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, onUploaded: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const url = await uploadAssetImage(file);
      onUploaded(url);
      toast.success("Image uploaded successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const [appliedCabinsPage, setAppliedCabinsPage] = useState(0);
  const [showAvailableCabins, setShowAvailableCabins] = useState(false);
  const [availableCabinsPage, setAvailableCabinsPage] = useState(0);

  useEffect(() => {
    setAppliedCabinsPage(0);
    setShowAvailableCabins(false);
    setAvailableCabinsPage(0);
  }, [viewingOffer]);

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

  // Find cabins with current offer
  const cabinsWithOffer = viewingOffer ? cabins.filter(c => c.offers?.some(o => o.id === viewingOffer.id)) : [];
  const cabinsWithoutOffer = viewingOffer ? cabins.filter(c => !c.offers?.some(o => o.id === viewingOffer.id)) : [];

  const appliedCabinsTotalPages = Math.max(1, Math.ceil(cabinsWithOffer.length / APPLIED_CABINS_PER_PAGE));
  const paginatedAppliedCabins = cabinsWithOffer.slice(
    appliedCabinsPage * APPLIED_CABINS_PER_PAGE,
    appliedCabinsPage * APPLIED_CABINS_PER_PAGE + APPLIED_CABINS_PER_PAGE
  );

  const availableCabinsTotalPages = Math.max(1, Math.ceil(cabinsWithoutOffer.length / CABINS_PER_PAGE));
  const paginatedAvailableCabins = cabinsWithoutOffer.slice(
    availableCabinsPage * CABINS_PER_PAGE,
    availableCabinsPage * CABINS_PER_PAGE + CABINS_PER_PAGE
  );

  return (
    <div className="space-y-6 animate-slide-up pb-2 px-2 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
           <p
        className="text-sky-500 text-sm font-bold block"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Offers Management
      </p>
          <h1 className="text-2xl
          md:text-3xl
          font-black
          text-slate-900
          dark:text-white
          tracking-tighter

          mt-0">Special Offers</h1>
          <p className="text-xs
          md:text-sm
          text-slate-500
          dark:text-slate-400
          max-w-lg
          leading-relaxed

          mt-0">Manage global pool of unique seasonal discounts and promotions.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
                <input 
                    type="text" 
                    placeholder="Search offers..."
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
                <Plus size={14} className="mr-1" /> Add Offer
            </button>
        </div>
      </div>



      <div className="mt-6 card overflow-hidden">
        {/* MOBILE CARD VIEW */}
        <div className="block sm:hidden space-y-3 p-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="card p-3 animate-pulse space-y-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
              </div>
            ))
          ) : offers.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-500 font-bold">No offers found.</div>
          ) : (
            offers.map((offer) => (
              <div key={offer.id} className="group card p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-xl shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Offer ID: {offer.id.substring(0, 8)}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setViewingOffer(offer)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-sky-500 transition-colors">
                      <Eye size={12} />
                    </button>
                    <button onClick={() => openEdit(offer)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 transition-colors">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => handleDelete(offer.id, offer)} disabled={isDeleting} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 transition-colors disabled:opacity-30">
                      {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    </button>
                  </div>
                </div>
                <div className="border-t border-slate-50 dark:border-slate-800/60 my-1" />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Tag size={12} className="text-emerald-500 shrink-0" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{offer.title || offer.name || "Untitled offer"}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">{offer.badge || "Default"}</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{offer.description || "No description provided."}</p>
                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase">Discount</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-black block">{(offer.discount_percent ?? (offer as any).discount_pct ?? 0)}% OFF</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block uppercase">Cabins</span>
                    <span className="text-slate-600 dark:text-slate-300 font-bold block">{getOfferCount(offer) || 0} Associated</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-purple-50/50 dark:bg-purple-950/30 border-b border-purple-100/50 dark:border-purple-900/20">
              <tr>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Promotion</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Applied To</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Discount</th>
                <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Badge</th>
                <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 w-44">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
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
                        <div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                      </td>
                      <td className="px-8 py-5 text-left">
                        <div className="h-5 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
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
                : offers.map((offer) => (
                    <tr key={offer.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-8 py-5 text-left">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <Tag size={14} className="text-emerald-500" />
                              {offer.title || offer.name || "Untitled offer"}
                          </span>
                          <span className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{offer.description || "No description provided."}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-left">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                            <Home size={12} />
                            <span className="text-[11px] font-black uppercase tracking-wider">{getOfferCount(offer) || 0} Cabins</span>
                          </div>
                      </td>
                      <td className="px-8 py-5 text-left">
                        <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">{(offer.discount_percent ?? (offer as any).discount_pct ?? 0)}% OFF</span>
                      </td>
                      <td className="px-8 py-5 text-left">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                              {offer.badge || "Default"}
                          </span>
                      </td>
                      <td className="px-8 py-5 text-right w-44">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Badge Text</label>
                    <input
                        value={editForm.badge}
                        onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image URL / File</label>
                    <div className="flex gap-2">
                        <input
                            value={editForm.image_url}
                            onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm flex-1"
                            placeholder="https://... or upload"
                        />
                        <label className="flex items-center justify-center px-4 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border-2 border-slate-200/50 dark:border-slate-800 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 cursor-pointer active:scale-95 transition-all shrink-0">
                            {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload"}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, (url) => setEditForm({ ...editForm, image_url: url }))}
                                disabled={isUploadingImage}
                            />
                        </label>
                    </div>
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
              <div className="space-y-4 font-bold">
                <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500">Currently Applied ({cabinsWithOffer.length})</h3>
                <div className="grid grid-cols-3 gap-4">
                  {paginatedAppliedCabins.length === 0 ? (
                    <div className="col-span-3">
                      <p className="text-sm text-slate-400 italic font-medium py-6 text-center bg-slate-50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">No cabins currently assigned.</p>
                    </div>
                  ) : (
                    paginatedAppliedCabins.map(cabin => (
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
                            onClick={() => toggleCabinOffer(cabin, viewingOffer.id)}
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

                {cabinsWithOffer.length > APPLIED_CABINS_PER_PAGE && (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setAppliedCabinsPage((p) => Math.max(0, p - 1))}
                      disabled={appliedCabinsPage === 0}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Page {appliedCabinsPage + 1} / {appliedCabinsTotalPages}
                    </p>

                    <button
                      onClick={() => setAppliedCabinsPage((p) => Math.min(appliedCabinsTotalPages - 1, p + 1))}
                      disabled={appliedCabinsPage >= appliedCabinsTotalPages - 1}
                      className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-emerald-500 hover:border-emerald-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => setShowAvailableCabins((prev) => !prev)}
                  className="w-full flex items-center justify-between group"
                >
                  <h3 className="text-xs font-black uppercase tracking-widest text-sky-500">
                    Available Cabins ({cabinsWithoutOffer.length})
                  </h3>
                  <ChevronDown
                    size={16}
                    className={`text-sky-500 transition-transform duration-200 ${showAvailableCabins ? "rotate-180" : ""}`}
                  />
                </button>

                {showAvailableCabins && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      {paginatedAvailableCabins.length === 0 ? (
                        <p className="text-sm text-slate-400 italic">No other cabins available.</p>
                      ) : (
                        paginatedAvailableCabins.map(cabin => (
                          <div key={cabin.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                            <div className="flex items-center gap-3">
                              <img src={getOptimizedImageUrl(cabin.image_url, 'thumbnail')} alt={cabin.name} className="w-10 h-10 rounded-xl object-cover opacity-60" />
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
                        ))
                      )}
                    </div>

                    {cabinsWithoutOffer.length > CABINS_PER_PAGE && (
                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={() => setAvailableCabinsPage((p) => Math.max(0, p - 1))}
                          disabled={availableCabinsPage === 0}
                          className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-sky-500 hover:border-sky-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronLeft size={16} />
                        </button>

                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          Page {availableCabinsPage + 1} / {availableCabinsTotalPages}
                        </p>

                        <button
                          onClick={() => setAvailableCabinsPage((p) => Math.min(availableCabinsTotalPages - 1, p + 1))}
                          disabled={availableCabinsPage >= availableCabinsTotalPages - 1}
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
              <button onClick={() => setViewingOffer(null)} className="btn btn-primary px-10">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <div className="modal-overlay">
          <div className="modal-content w-full max-w-xl p-8 space-y-6 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">New Promo Offer</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Create a new special discount or promo</p>
              </div>
              <button onClick={() => setIsAdding(false)} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Offer Title</label>
                    <input
                        placeholder="E.g. Summer Special"
                        value={newOffer.title}
                        onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Discount (%)</label>
                    <input
                        type="number"
                        placeholder="0"
                        value={newOffer.discount_percent}
                        onChange={(e) => setNewOffer({ ...newOffer, discount_percent: Number(e.target.value) })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Badge Text</label>
                    <input
                        placeholder="E.g. Hot Deal"
                        value={newOffer.badge}
                        onChange={(e) => setNewOffer({ ...newOffer, badge: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image URL / File</label>
                    <div className="flex gap-2">
                        <input
                            placeholder="https://... or upload"
                            value={newOffer.image_url}
                            onChange={(e) => setNewOffer({ ...newOffer, image_url: e.target.value })}
                            className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm flex-1"
                        />
                        <label className="flex items-center justify-center px-4 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border-2 border-slate-200/50 dark:border-slate-800 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 cursor-pointer active:scale-95 transition-all shrink-0">
                            {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload"}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, (url) => setNewOffer({ ...newOffer, image_url: url }))}
                                disabled={isUploadingImage}
                            />
                        </label>
                    </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                <textarea
                    placeholder="Describe the promotion..."
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm min-h-28 mt-1 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setIsAdding(false)} className="btn btn-secondary px-6">
                Cancel
              </button>
              <button onClick={handleAdd} disabled={isCreating} className="btn btn-primary px-10">
                {isCreating ? <Loader2 size={18} className="animate-spin" /> : "Save Offer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offers;
