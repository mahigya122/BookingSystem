import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Cabin } from "@shared/types/cabin";
import type { Booking } from "@shared/types/booking";
import type { ReactNode } from "react";

export type CabinDetailSection = "overview" | "location" | "offers" | "activities" | "reviews";

interface Props {
    cabin: Cabin;
    onEdit: (cabin: Cabin) => void;
    onDelete: (id: string) => void;
    onView: (cabin: Cabin, section?: CabinDetailSection) => void;
    activeBooking: Booking | null;
}

const CabinRow = ({
    cabin,
    onEdit,
    onDelete,
    onView,
    activeBooking,
}: Props) => {
    const isBooked = Boolean(activeBooking);

    const renderCountButton = (
        count: number,
        label: string,
        className: string,
        section: CabinDetailSection
    ): ReactNode => {
        return (
            <button
                type="button"
                onClick={() => onView(cabin, section)}
                className={`badge ${className} cursor-pointer transition-transform hover:scale-105 ${count > 0 ? "opacity-100" : "opacity-60"}`}
                title={`View ${label.toLowerCase()} for this cabin`}
            >
                {count}
            </button>
        );
    };

    return (
        <tr className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <td className="px-6 py-4">
                <img
                    src={cabin.image_url}
                    alt= {cabin.name}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shadow-sm"
                />
            </td>

            <td className="px-6 py-4">
                <span className="font-bold text-slate-900 dark:text-slate-100">{cabin.name}</span>
            </td>

            <td className="px-6 py-4">
                <button
                    type="button"
                    onClick={() => onView(cabin, "location")}
                    className="text-left text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                    {cabin.location?.name || "—"}
                </button>
            </td>

            <td className= "px-6 py-4">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {cabin.capacity} Guest{cabin.capacity > 1 ? 's' : ''}
                </span>
            </td>

            <td className= "px-6 py-4 font-black text-slate-900 dark:text-white">
                ${cabin.price_per_night.toLocaleString()}
            </td>

            <td className="px-6 py-4">
                {cabin.discount > 0 ? (
                    <span className="badge badge-success">{cabin.discount}%</span>
                ) : (
                    <span className="text-xs font-bold text-slate-300">N/A</span>
                )}
            </td>

            <td className="px-6 py-4">
                {renderCountButton(cabin.offers?.length || 0, "offers", "badge-primary", "offers")}
            </td>

            <td className="px-6 py-4">
                {renderCountButton(cabin.activities?.length || 0, "activities", "badge-secondary", "activities")}
            </td>

            <td className="px-6 py-4">
                {renderCountButton(cabin.reviews?.length || 0, "reviews", "badge-warning", "reviews")}
            </td>


            <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2 transition-all duration-300">
                    <button
                        type="button"
                        onClick={() => onView(cabin, "overview")}
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-sky-500 hover:border-sky-200 dark:hover:border-sky-900 shadow-sm transition-all"
                        title="View Details"
                    >
                       <Eye size={18} />
                    </button>

                    <button
                        type="button"
                        onClick= {() => onEdit(cabin)}
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-200 dark:hover:border-amber-900 shadow-sm transition-all"
                        title="Edit Cabin"
                    >
                        <Pencil size={18} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(cabin.id)}
                        disabled={isBooked}
                        title={isBooked ? "Booked cabins cannot be deleted" : "Delete Cabin"}
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-900 shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </td>
        </tr>
    );
};
export default CabinRow;
