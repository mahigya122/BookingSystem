import { useLocation } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import ExploreFilters from "../domains/cabins/components/ExploreFilters";
import { useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";

const UserSidebar = () => {
    const {
        sidebarOpen,
        setSidebarOpen,
        activeFilterCount,
        isSearching
    } = useCabinFiltersContext();

    // COLLAPSED STATE
    if (!sidebarOpen) {
        return (
            <div className="h-full flex flex-col items-center pt-10 space-y-8 relative bg-slate-50/50 dark:bg-slate-900/50 border-r border-slate-100 dark:border-slate-800">
                <button
                    title="Open Preferences"
                    onClick={() => setSidebarOpen(true)}
                    className="
                        relative
                        flex
                        items-center
                        justify-center
                        w-12
                        h-12
                        rounded-xl
                        bg-white
                        dark:bg-slate-800
                        border
                        border-slate-100
                        dark:border-slate-700
                        hover:border-sky-500
                        hover:text-sky-600
                        transition-all
                        duration-300
                        z-10
                        group
                    "
                >
                    <SlidersHorizontal size={20} className="text-slate-400 group-hover:text-sky-600 transition-colors" />

                    {activeFilterCount > 0 && (
                        <span
                            className="
                                absolute
                                -top-1.5
                                -right-1.5
                                min-w-[18px]
                                h-[18px]
                                px-1
                                rounded-md
                                text-[9px]
                                font-black
                                flex
                                items-center
                                justify-center
                                bg-sky-600
                                text-white
                                shadow-sm
                            "
                        >
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>
        );
    }

    // EXPANDED STATE
    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 animate-in slide-in-from-left-4 duration-500 relative">
            {/* HEADER */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50 dark:border-slate-800 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                        <SlidersHorizontal size={16} className="text-sky-600 dark:text-sky-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">
                            {isSearching ? "Refine" : "Search"}
                        </span>
                        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                            Preferences
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar-hide space-y-10 relative z-10">
                {/* DYNAMIC FILTERS */}
                <div className="space-y-10">
                    <ExploreFilters />
                </div>
            </div>
        </div>
    );
};

export default UserSidebar;
