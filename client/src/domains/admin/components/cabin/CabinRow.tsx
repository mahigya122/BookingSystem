import type { Cabin } from "@shared/types/cabin";
import type { Booking } from "@shared/types/booking";

interface Props {
    cabin: Cabin;
    onEdit: (cabin: Cabin) => void;
    onDelete: (id: string) => void;
    onView: (cabin: Cabin) => void;
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

    return (
        <tr className="group">
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
                <div className="flex justify-start gap-2 opacity-100 transition-opacity">
                    <button
                        onClick={() => onView(cabin)}
                        className="btn-action btn-action-secondary whitespace-nowrap"
                    >
                       View
                    </button>

                    <button
                        onClick= {() => onEdit(cabin)}
                        disabled={isBooked}
                        title={isBooked ? "Booked cabins cannot be edited" : undefined}
                        className="btn-action btn-action-primary whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => onDelete(cabin.id)}
                        disabled={isBooked}
                        title={isBooked ? "Booked cabins cannot be deleted" : undefined}
                        className="btn-action btn-action-danger whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};
export default CabinRow;