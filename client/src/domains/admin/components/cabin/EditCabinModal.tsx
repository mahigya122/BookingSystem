import { useState } from "react";
import { useUpdateCabin } from "@shared/hooks";
import { useLocations } from "@shared/hooks/useLocations";
import { useOffers } from "@shared/hooks/useOffers";
import { useActivities } from "@shared/hooks/useActivities";
import type { CabinData } from "@shared/services/apiCabins";
import type { Cabin } from "@shared/types/cabin";
import {
    Save,
    Image as ImageIcon,
    MapPin,
    Users,
    DollarSign,
    Tag,
    Sparkles,
    Loader2,
    FileText,
    Percent,
    CheckCircle2,
    ArrowLeft,
    LayoutDashboard
} from "lucide-react";
import toast from "react-hot-toast";

interface Props {
    cabin: Cabin;
    onClose: () => void;
}

const EditCabinModal = ({
    cabin,
    onClose
}: Props) => {
    const { editCabin, isPending } = useUpdateCabin();
    const { locations } = useLocations();
    const safeLocations = Array.isArray(locations) ? locations : [];
    const { offers } = useOffers();
    const safeOffers = Array.isArray(offers) ? offers : [];
    const { activities } = useActivities();
    const safeActivities = Array.isArray(activities) ? activities : [];

    const [form, setForm] = useState<CabinData>({
        name: cabin.name,
        capacity: cabin.capacity,
        price_per_night: cabin.price_per_night,
        discount: cabin.discount,
        image_url: cabin.image_url,
        description: cabin.description,
        location_id: cabin.location_id || "",
        offer_ids: cabin.offers?.map(o => o.id) || [],
        activity_ids: cabin.activities?.map(a => a.id) || [],
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) {
            toast.error("Cabin name is required");
            return;
        }

        editCabin({
            id: cabin.id,
            data: form,
        }, {
            onSuccess: () => {
                toast.success("Cabin updated successfully!");
                onClose();
            }
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

    const inputLabelClass = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block";
    const inputBaseClass = "w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-3.5 text-sm font-bold focus:border-sky-500 focus:ring-8 focus:ring-sky-500/5 outline-none transition-all dark:text-white";

    return (
        <div className="modal-overlay">
            <div className="modal-content w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">

                {/* HEADER */}
                <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 flex-shrink-0">
                    <div className="flex items-center gap-6">
                        <button onClick={onClose} className="h-12 w-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-sky-500 transition-colors">
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Unit Management</h2>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Configuring: <span className="text-sky-500">{cabin.name}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="btn btn-secondary px-6">Discard</button>
                        <button
                            disabled={isPending}
                            onClick={handleSave}
                            className="btn btn-primary px-10 shadow-xl shadow-sky-500/20"
                        >
                            {isPending ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Update Unit</>}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 bg-slate-50/30 dark:bg-slate-950/30">

                    {/* MAIN FORM AREA */}
                    <form onSubmit={handleSave} className="lg:col-span-2 p-10 space-y-12 border-r border-slate-100 dark:border-slate-800">

                        {/* CORE SPECS */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                                    <LayoutDashboard size={20} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Core Specifications</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className={inputLabelClass}>Display Name</label>
                                    <input
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className={inputBaseClass}
                                        placeholder="e.g. Alpine Royal Suite"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className={inputLabelClass}>Property Location</label>
                                    <div className="relative">
                                        <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <select
                                            value={form.location_id}
                                            onChange={(e) => setForm({ ...form, location_id: e.target.value })}
                                            className={`${inputBaseClass} pl-12 appearance-none`}
                                        >
                                            <option value="">Select Geographic Area...</option>
                                            {safeLocations.map(loc => (
                                                <option key={loc.id} value={loc.id}>{loc.name} — {loc.city}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className={inputLabelClass}>Occupancy Limit</label>
                                    <div className="relative">
                                        <Users size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="number"
                                            min="1"
                                            value={form.capacity}
                                            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                                            className={`${inputBaseClass} pl-12`}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className={inputLabelClass}>Base Rate</label>
                                        <div className="relative">
                                            <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="number"
                                                value={form.price_per_night}
                                                onChange={(e) => setForm({ ...form, price_per_night: Number(e.target.value) })}
                                                className={`${inputBaseClass} pl-12`}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className={inputLabelClass}>Discount</label>
                                        <div className="relative">
                                            <Percent size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={form.discount}
                                                onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                                                className={`${inputBaseClass} pl-12`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* MEDIA & CONTENT */}
                        <section className="space-y-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500">
                                    <ImageIcon size={20} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Media & Narrative</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className={inputLabelClass}>Primary Visual URL</label>
                                    <div className="relative">
                                        <ImageIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            value={form.image_url}
                                            onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                            className={`${inputBaseClass} pl-12`}
                                            placeholder="https://images.unsplash.com/..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className={inputLabelClass}>Unit Description</label>
                                    <div className="relative">
                                        <FileText size={18} className="absolute left-4 top-5 text-slate-400" />
                                        <textarea
                                            value={form.description || ""}
                                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            className={`${inputBaseClass} min-h-[160px] pl-12 resize-none leading-relaxed`}
                                            placeholder="Craft a compelling story about this luxury stay..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </form>

                    {/* SIDEBAR AREA: AMENITIES & OFFERS */}
                    <div className="p-10 space-y-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">

                        {/* OFFERS SELECTION */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Tag size={18} className="text-emerald-500" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Active Offers</h3>
                                </div>
                                <span className="badge badge-success text-[9px]">{form.offer_ids?.length || 0} Select</span>
                            </div>

                            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar-hide">
                                {safeOffers.map(offer => (
                                    <button
                                        key={offer.id}
                                        type="button"
                                        onClick={() => handleOfferToggle(offer.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${form.offer_ids?.includes(offer.id)
                                            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                                            : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-200/50"
                                            }`}
                                    >
                                        <div className="flex flex-col items-start text-left">
                                            <span className={`text-xs font-black transition-colors ${form.offer_ids?.includes(offer.id) ? "text-emerald-700 dark:text-emerald-400" : "text-slate-600 dark:text-slate-300"
                                                }`}>
                                                {offer.title || offer.name}
                                            </span>
                                            <span className="text-[10px] font-bold text-emerald-500/80">{(offer.discount_percent ?? offer.discount_pct ?? 0)}% Reduction</span>
                                        </div>
                                        <CheckCircle2 size={18} className={`transition-all ${form.offer_ids?.includes(offer.id) ? "text-emerald-500 opacity-100 scale-110" : "text-slate-200 dark:text-slate-800 opacity-0 scale-90"
                                            }`} />
                                    </button>
                                ))}
                                {safeOffers.length === 0 && (
                                    <div className="py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No available offers</p>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ACTIVITIES SELECTION */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Sparkles size={18} className="text-cyan-500" />
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Experiences</h3>
                                </div>
                                <span className="badge badge-secondary text-[9px]">{form.activity_ids?.length || 0} Select</span>
                            </div>

                            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar-hide">
                                {safeActivities.map(activity => (
                                    <button
                                        key={activity.id}
                                        type="button"
                                        onClick={() => handleActivityToggle(activity.id)}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group ${form.activity_ids?.includes(activity.id)
                                            ? "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-800"
                                            : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-cyan-200/50"
                                            }`}
                                    >
                                        <div className="flex flex-col items-start text-left">
                                            <span className={`text-xs font-black transition-colors ${form.activity_ids?.includes(activity.id) ? "text-cyan-700 dark:text-cyan-400" : "text-slate-600 dark:text-slate-300"
                                                }`}>
                                                {activity.name}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">${activity.price} Premium</span>
                                        </div>
                                        <CheckCircle2 size={18} className={`transition-all ${form.activity_ids?.includes(activity.id) ? "text-cyan-500 opacity-100 scale-110" : "text-slate-200 dark:text-slate-800 opacity-0 scale-90"
                                            }`} />
                                    </button>
                                ))}
                                {safeActivities.length === 0 && (
                                    <div className="py-10 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No available activities</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default EditCabinModal;
