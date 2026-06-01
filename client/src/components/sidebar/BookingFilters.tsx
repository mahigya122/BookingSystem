import { useFilterActions } from "../../hooks/useFilterActions";
import type { CabinFilters } from "../../store/useCabinFilters";

const BookingFilters = () => {
    const { filters, handleStatusChange, clearFilters } = useFilterActions();
    const statuses: CabinFilters["bookingStatus"][] = ["all", "upcoming", "completed", "cancelled"];

    return (
        <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-5 shadow-lg">
                <h3 className="mb-4 text-sm font-bold">
                    Booking Status
                </h3>

                <div className="space-y-2">
                    {statuses.map((status) => (
                        <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className={`w-full rounded-xl border p-3 text-left text-sm font-semibold transition
                                ${filters.bookingStatus === status
                                    ? "bg-emerald-600 text-white border-emerald-600"
                                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* CLEAR BUTTON */}
            <button
                onClick={clearFilters}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 py-3 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
                Clear Filter
            </button>
        </div>
    );
};

export default BookingFilters;
