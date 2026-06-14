import { useFilterActions } from "../../../hooks/useFilterActions";
import type { CabinFilters } from "../../../store/useCabinFilters";
import { CheckCircle2, Clock, XCircle, ListFilter, RotateCcw } from "lucide-react";

const BookingFilters = () => {
    const { filters, handleStatusChange, clearFilters } = useFilterActions();
    const statuses: CabinFilters["bookingStatus"][] = ["all", "upcoming", "completed", "cancelled"];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "upcoming": return <Clock size={16} />;
            case "completed": return <CheckCircle2 size={16} />;
            case "cancelled": return <XCircle size={16} />;
            default: return <ListFilter size={16} />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col px-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-1">Manage</span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Your Trips</h2>
            </div>

            <div className="group rounded-[2.5rem] border border-emerald-50 dark:border-emerald-900/20 bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-xl shadow-emerald-900/5 hover:shadow-2xl transition-all duration-500">
                <h3 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    Filter Status
                </h3>

                <div className="space-y-3">
                    {statuses.map((status) => {
                        const active = filters.bookingStatus === status;
                        return (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                className={`
                                    w-full rounded-2xl border p-4 text-left text-sm font-black transition-all duration-300
                                    flex items-center justify-between group/btn
                                    ${active
                                        ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]"
                                        : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-800 text-slate-400 hover:border-emerald-200 hover:text-emerald-600"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl transition-colors ${active ? "bg-white/20" : "bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover/btn:text-emerald-500"}`}>
                                        {getStatusIcon(status)}
                                    </div>
                                    <span className="tracking-tight">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                </div>
                                {active && <div className="h-2 w-2 rounded-full bg-white animate-pulse" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* CLEAR BUTTON */}
            <button
                onClick={clearFilters}
                className="
                    w-full rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 py-4 
                    text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-rose-500 hover:border-rose-100 
                    dark:hover:border-rose-900/30 transition-all duration-500 flex items-center justify-center gap-2 group
                "
            >
                <RotateCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500" />
                Clear All Filters
            </button>
        </div>
    );
};

export default BookingFilters;
