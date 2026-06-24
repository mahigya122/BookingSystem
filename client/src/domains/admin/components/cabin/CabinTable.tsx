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
                <tr>
                    <th className="px-8 py-5 w-20 text-left">Media</th>
                    <th className="px-8 py-5 text-left">Unit Name</th>
                    <th className="px-8 py-5 text-left">Location</th>
                    <th className="px-8 py-5 text-left">Max Cap.</th>
                    <th className="px-8 py-5 text-left">Base Price</th>
                    <th className="px-8 py-5 text-left">Discount</th>
                    <th className="px-8 py-5 text-left">Offers</th>
                    <th className="px-8 py-5 text-left">Activities</th>
                    <th className="px-8 py-5 text-left">Reviews</th>
                    <th className="px-8 py-5 text-right w-60">Manage</th>
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
