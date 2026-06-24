import { useRef, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import ExploreFilters from "../domains/cabins/components/ExploreFilters";
import { useCabinFiltersContext } from "../domains/cabins/contexts/CabinFiltersContext";

const UserSidebar = () => {
    const {
        sidebarOpen,
        setSidebarOpen,
        activeFilterCount
    } = useCabinFiltersContext();

    const sidebarRef = useRef<HTMLDivElement>(null);

    // Close sidebar when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!sidebarOpen) return;

            // If click is inside sidebar, do nothing
            if (sidebarRef.current && sidebarRef.current.contains(event.target as Node)) {
                return;
            }

            // If click is on a sidebar toggle button or its children, do nothing
            const target = event.target as HTMLElement;
            if (target.closest("[data-sidebar-toggle]") || target.closest(".sidebar-toggle-btn")) {
                return;
            }

            setSidebarOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [sidebarOpen, setSidebarOpen]);

    // COLLAPSED STATE
    if (!sidebarOpen) {
        return (
            <div className="h-full flex flex-col items-center pt-10 space-y-8 relative bg-slate-50/50 dark:bg-slate-900/50">
                <button
                    data-sidebar-toggle="true"
                    title="Open Preferences"
                    onClick={() => setSidebarOpen(true)}
                    className="
                        sidebar-toggle-btn
                        relative
                        flex
                        items-center
                        justify-center
                        w-12
                        h-12
                        rounded-xl
                        bg-white
                        dark:bg-slate-850
                        border
                        border-slate-100
                        dark:border-slate-800
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

    return (
        <div
            ref={sidebarRef}
            className="flex flex-col animate-in slide-in-from-left-4 duration-500 relative"
        >
            <div className="p-5 relative z-12">
                {/* DYNAMIC FILTERS */}
                <ExploreFilters />
            </div>
        </div>
    );
};

export default UserSidebar;
