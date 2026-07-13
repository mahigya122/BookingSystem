import CabinRow from "./CabinRow";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { CabinDetailSection } from "./CabinRow";
import type { Cabin } from "@shared/types/cabin";
import type { Booking } from "@shared/types/booking";

interface Props{
    cabins: Cabin[];
    onEdit: (cabin: Cabin) => void;
    onDelete: (id: string) => void;
    onView: (cabin: Cabin, section?: CabinDetailSection) => void;
    activeBookingByCabinId: Record<string, Booking>;
    isLoading?: boolean;
}

const CabinTable = ({
    cabins,
    onEdit,
    onDelete,
    onView,
    activeBookingByCabinId,
    isLoading,
}: Props) => {

return (
    <div>
        {/* MOBILE CARD VIEW */}
        <div className="block sm:hidden space-y-3 p-3">
            {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="card p-3 animate-pulse space-y-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
                        <div className="h-12 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="h-3 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                ))
            ) : cabins.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500 font-bold">No cabins found.</div>
            ) : (
                cabins.map((cabin) => {
                    const activeBooking = activeBookingByCabinId[cabin.id] ?? null;
                    return (
                        <div key={cabin.id} className="group card p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-xl shadow-sm space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Unit ID: {cabin.id.substring(0, 8)}</span>
                                <div className="flex gap-2">
                                    <button onClick={() => onView(cabin)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-sky-500 transition-colors">
                                        <Eye size={12} />
                                    </button>
                                    <button onClick={() => onEdit(cabin)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 transition-colors">
                                        <Pencil size={12} />
                                    </button>
                                    <button onClick={() => onDelete(cabin.id)} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 transition-colors">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                            <div className="border-t border-slate-50 dark:border-slate-800/60 my-1" />
                            <div className="flex gap-3">
                                {cabin.image_url && (
                                    <img src={cabin.image_url} alt={cabin.name} className="h-14 w-20 object-cover rounded-lg shrink-0 border border-slate-100 dark:border-slate-800/60" />
                                )}
                                <div className="flex flex-col min-w-0 justify-center">
                                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{cabin.name}</span>
                                    <span className="text-[9px] text-slate-400 font-bold mt-0.5">{cabin.location?.name || "No location"}</span>
                                    <div className="mt-1">
                                        {activeBooking ? (
                                            <span className="badge badge-danger text-[8px] px-1.5 py-0.5 leading-none">Occupied</span>
                                        ) : (
                                            <span className="badge badge-success text-[8px] px-1.5 py-0.5 leading-none">Available</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-[10px] pt-1">
                                <div>
                                    <span className="text-slate-400 font-semibold block uppercase">Cap.</span>
                                    <span className="text-slate-600 dark:text-slate-300 font-bold block">{cabin.capacity} Guests</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-semibold block uppercase">Base Price</span>
                                    <span className="text-slate-600 dark:text-slate-300 font-bold block">${cabin.price_per_night}/nt</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-semibold block uppercase">Discount</span>
                                    <span className="text-emerald-600 font-bold block">{cabin.discount || 0}%</span>
                                </div>
                            </div>
                            <div className="border-t border-slate-50 dark:border-slate-800/60 my-1" />
                            <div className="flex justify-between items-center gap-1">
                                <button onClick={() => onView(cabin, 'offers')} className="text-[9px] font-black uppercase text-sky-500 hover:underline">Offers ({cabin.offers?.length || 0})</button>
                                <button onClick={() => onView(cabin, 'activities')} className="text-[9px] font-black uppercase text-indigo-500 hover:underline">Activities ({cabin.activities?.length || 0})</button>
                                <button onClick={() => onView(cabin, 'reviews')} className="text-[9px] font-black uppercase text-emerald-500 hover:underline">Reviews ({cabin.reviews?.length || 0})</button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>

        {/* DESKTOP TABLE VIEW */}
        <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-slate-100/60 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-700/60">
                        <th className="px-8 py-5 w-20 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Media</th>
                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Unit Name</th>
                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Max Cap.</th>
                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Base Price</th>
                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Discount</th>
                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Offers</th>
                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Activities</th>
                        <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Reviews</th>
                        <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 w-60">Manage</th>
                    </tr>
                </thead>

                <tbody>    
                    {isLoading
                        ? Array.from({ length: 10 }).map((_, i) => (
                            <tr key={i}>
                                <td className="px-8 py-5 w-20 text-left"><div className="h-12 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                                <td className="px-8 py-5 text-left"><div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                                <td className="px-8 py-5 text-left"><div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                                <td className="px-8 py-5 text-left"><div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                                <td className="px-8 py-5 text-left"><div className="h-4 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                                <td className="px-8 py-5 text-left"><div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                                <td className="px-8 py-5 text-left"><div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                                <td className="px-8 py-5 text-left"><div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                                <td className="px-8 py-5 text-left"><div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                                <td className="px-8 py-5 text-right w-60"><div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse ml-auto" /></td>
                            </tr>
                        ))
                        : cabins.map((cabin) => (
                            <CabinRow
                            key= {cabin.id}
                            cabin= {cabin}
                            onEdit= {onEdit}
                            onDelete= {onDelete}
                            onView= {onView}
                            activeBooking={activeBookingByCabinId[cabin.id] ?? null}
                            />
                        ))
                    }
                </tbody>
            </table>
        </div>
    </div>
);
};

export default CabinTable;
