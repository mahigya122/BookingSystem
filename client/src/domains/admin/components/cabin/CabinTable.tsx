import CabinRow from "./CabinRow";
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

return(
    <div className="overflow-x-auto">
        <table>
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
);
};

export default CabinTable;
