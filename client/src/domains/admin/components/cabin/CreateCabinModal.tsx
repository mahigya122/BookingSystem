import { useState } from "react";
import { useCreateCabin } from "@shared/auth_hooks";
import { useLocations } from "@shared/hooks/useLocations";
import { useOffers } from "@shared/hooks/useOffers";
import { useActivities } from "@shared/hooks/useActivities";
import type { CabinData } from "@shared/services/apiCabins";
import { X, Plus, Image as ImageIcon, MapPin, Users, DollarSign, Tag, Sparkles, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
    onClose: () => void;
}

const CreateCabinModal = ({ onClose } : Props) => {
    const { addCabin, isPending } = useCreateCabin();
    const { locations = [] } = useLocations();
    const { offers = [] } = useOffers();
    const { activities = [] } = useActivities();

    const [form, setForm] = useState<CabinData>({
        name: "",
        capacity: 2,
        price_per_night: 150,
        discount: 0,
        image_url: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000&auto=format&fit=crop",
        description: "",
        location_id: "",
        offer_ids: [],
        activity_ids: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error("Cabin name is required");
            return;
        }
        if (!form.location_id) {
            toast.error("Please select a location");
            return;
        }

        addCabin(form, {
            onSuccess: () => {
                toast.success("Cabin created successfully!");
                onClose();
            },
        });
    };

    const handleOfferToggle = (id: string) => {
        setForm(prev => ({
            ...prev,
            offer_ids: prev.offer_ids?.includes(id) 
                ? prev.offer_ids.filter(oid => oid !== id)
                : [...(prev.offer_ids || []), id]
        }));
    };

    const handleActivityToggle = (id: string) => {
        setForm(prev => ({
            ...prev,
            activity_ids: prev.activity_ids?.includes(id) 
                ? prev.activity_ids.filter(aid => aid !== id)
                : [...(prev.activity_ids || []), id]
        }));
    };

    const inputLabelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block";
    const inputBaseClass = "w-full bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-sky-500/20 outline-none transition-all";

return (
    <div className="modal-overlay">
        <div className="modal-content w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Create New Cabin</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Add a new unit to your resort inventory</p>
                </div>
                <button onClick={onClose} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <X size={24} className="text-slate-400" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Basic Info Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-500">
                            <Plus size={18} />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Basic Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={inputLabelClass}>Cabin Name</label>
                            <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="E.g. Hidden Valley Lodge"
                                className={inputBaseClass}
                            />
                        </div>

                        <div>
                            <label className={inputLabelClass}>Location</label>
                            <div className="relative">
                                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select
                                    value={form.location_id}
                                    onChange={(e) => setForm({ ...form, location_id: e.target.value })}
                                    className={`${inputBaseClass} pl-10 appearance-none`}
                                >
                                    <option value="">Select geographic area...</option>
                                    {locations.map(loc => (
                                        <option key={loc.id} value={loc.id}>{loc.name} ({loc.city})</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className={inputLabelClass}>Capacity (Guests)</label>
                            <div className="relative">
                                <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="number"
                                    min="1"
                                    value={form.capacity}
                                    onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                                    className={`${inputBaseClass} pl-10`}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={inputLabelClass}>Price / Night</label>
                                <div className="relative">
                                    <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="number"
                                        value={form.price_per_night}
                                        onChange={(e) => setForm({ ...form, price_per_night: Number(e.target.value) })}
                                        className={`${inputBaseClass} pl-10`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={inputLabelClass}>Discount (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={form.discount}
                                    onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                                    className={inputBaseClass}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className={inputLabelClass}>Hero Image URL</label>
                            <div className="relative">
                                <ImageIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={form.image_url}
                                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                    className={`${inputBaseClass} pl-10`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={inputLabelClass}>Description</label>
                            <textarea
                                value={form.description || ""}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Tell a story about this retreat..."
                                className={`${inputBaseClass} min-h-[100px] resize-none`}
                            />
                        </div>
                    </div>
                </section>

                {/* Amenities & Offers Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Tag size={16} className="text-emerald-500" />
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Assign Offers</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800">
                            {offers.map(offer => (
                                <label key={offer.id} className="flex items-center gap-3 p-2 hover:bg-white dark:hover:bg-slate-900 rounded-xl cursor-pointer transition-colors group">
                                    <input 
                                        type="checkbox" 
                                        className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500/20"
                                        checked={form.offer_ids?.includes(offer.id)}
                                        onChange={() => handleOfferToggle(offer.id)}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{offer.title || offer.name}</span>
                                        <span className="text-[10px] text-emerald-500 font-black">{(offer.discount_percent ?? offer.discount_pct ?? 0)}% OFF</span>
                                    </div>
                                </label>
                            ))}
                            {offers.length === 0 && <p className="text-[10px] text-slate-400 italic py-4 text-center">No offers available to link.</p>}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} className="text-cyan-500" />
                            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Assign Activities</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800">
                            {activities.map(activity => (
                                <label key={activity.id} className="flex items-center gap-3 p-2 hover:bg-white dark:hover:bg-slate-900 rounded-xl cursor-pointer transition-colors group">
                                    <input 
                                        type="checkbox" 
                                        className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500/20"
                                        checked={form.activity_ids?.includes(activity.id)}
                                        onChange={() => handleActivityToggle(activity.id)}
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{activity.name}</span>
                                        <span className="text-[10px] text-slate-400 font-bold">${activity.price}</span>
                                    </div>
                                </label>
                            ))}
                            {activities.length === 0 && <p className="text-[10px] text-slate-400 italic py-4 text-center">No activities available to link.</p>}
                        </div>
                    </div>
                </section>
            </form>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
                <button onClick={onClose} type="button" className="btn btn-secondary px-6">
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="btn btn-primary px-10 shadow-lg shadow-sky-500/20"
                >
                    {isPending ? <Loader2 size={18} className="animate-spin" /> : "Create Cabin"}
                </button>
            </div>
        </div>
    </div>    
);  
};
export default CreateCabinModal;