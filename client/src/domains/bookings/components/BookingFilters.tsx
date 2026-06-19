import { useFilterActions } from "../../../hooks/useFilterActions";
import type { CabinFilters } from "../../../store/useCabinFilters";
import { CheckCircle2, Clock, XCircle, ListFilter } from "lucide-react";

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

            <div className="group transition-all duration-500">
                <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Filter Status
                </h3>

                <div className="space-y-1">
                    {statuses.map((status) => {
                        const active = filters.bookingStatus === status;
                        return (
                            <button
                                key={status}
                                onClick={() => handleStatusChange(status)}
                                className={`
                                    w-full rounded-xl py-3 px-3 text-left text-sm font-black transition-all duration-300
                                    flex items-center justify-between group/btn border
                                    ${active
                                        ? "border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                                        : "border-transparent text-slate-400 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`transition-colors ${active ? "text-emerald-500" : "text-slate-400 group-hover/btn:text-emerald-500"}`}>
                                        {getStatusIcon(status)}
                                    </div>
                                    <span className="tracking-tight">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                                </div>
                                {active && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={() => clearFilters()}
                className="
                    w-full rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 py-4 
                    text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-rose-500 hover:border-rose-100 
                    dark:hover:border-rose-900/30 transition-all duration-500 flex items-center justify-center gap-2 group
                "
            >
            </button>
        </div>

    );
};

export default BookingFilters;
