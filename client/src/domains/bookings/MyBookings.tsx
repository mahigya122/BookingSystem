import { useBookings, useUser } from "@shared/hooks";
import { useCabinsData } from "../cabins/hooks/useCabinsData";
import { useCabinFiltersContext } from "../cabins/contexts/CabinFiltersContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getBookingRealStatus } from "@shared/utils/bookingUtils";
import Pagination from "@shared/components/ui/Pagination";
import { Compass, ArrowRight, Clock, CheckCircle2, XCircle, ListFilter, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import CabinCard from "../cabins/components/CabinCard";

const MyBookings = () => {
  const { user } = useUser();
  const { setIsSearching } = useCabinFiltersContext();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 1. Get status filter from URL query param
  const urlStatus = searchParams.get("status");
  const currentStatus = (urlStatus && ["all", "upcoming", "completed", "cancelled"].includes(urlStatus))
    ? (urlStatus as "all" | "upcoming" | "completed" | "cancelled")
    : "all";

  // 2. Get current page from URL path or query params
  const currentPage = useMemo(() => {
    let page = 1;
    if (params.pageParam) {
      const match = params.pageParam.match(/^page(\d+)$/i) || params.pageParam.match(/^(\d+)$/);
      if (match) page = Number(match[1]);
    } else if ((params as any).pageSuffix) {
      const match = (params as any).pageSuffix.match(/^\.page(\d+)$/i) || (params as any).pageSuffix.match(/^page(\d+)$/i) || (params as any).pageSuffix.match(/^\.(\d+)$/);
      if (match) page = Number(match[1]);
    } else {
      const pageQuery = searchParams.get("page");
      if (pageQuery) page = Number(pageQuery);
    }
    return isNaN(page) || page < 1 ? 1 : page;
  }, [params, searchParams]);

  const { bookings, totalCount = 0, isLoading: loadingBookings } = useBookings(
    currentPage,
    8,
    currentStatus,
    "recent",
    "",
    "all",
    user?.email || ""
  );
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const { cabins, isLoading: loadingCabins } = useCabinsData();
  const safeCabins = Array.isArray(cabins) ? cabins : [];

  const isLoading = loadingBookings || loadingCabins;
  const totalPages = Math.ceil(totalCount / 8);

  const handlePageChange = (newPage: number) => {
    const qParams = new URLSearchParams(searchParams);
    const path = newPage > 1 ? `/bookings/page${newPage}` : `/bookings`;
    const queryStr = qParams.toString();
    navigate(queryStr ? `${path}?${queryStr}` : path);
  };

  const handleStatusClick = (newStatus: string) => {
    const qParams = new URLSearchParams(searchParams);
    if (newStatus !== "all") {
      qParams.set("status", newStatus);
    } else {
      qParams.delete("status");
    }
    navigate(qParams.toString() ? `/bookings?${qParams.toString()}` : `/bookings`);
  };

  const handleExploreCabins = () => {
    setIsSearching(true);
    navigate("/explorepage");
  };

  const statuses: { label: string; value: typeof currentStatus; icon: any }[] = [
    { label: "All Stays", value: "all", icon: ListFilter },
    { label: "Upcoming", value: "upcoming", icon: Clock },
    { label: "Completed", value: "completed", icon: CheckCircle2 },
    { label: "Cancelled", value: "cancelled", icon: XCircle },
  ];



  return (
    <div className="px-4 md:px-0 space-y-8 pb-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div className="space-y-0 pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">
            Itinerary Management
          </p>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            My Reservations
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-md pt-1">
            You have {totalCount} total stays booked under {user?.email}. Filter by status to manage your upcoming or past journeys.
          </p>
        </div>

        {/* DROPDOWN STATUS FILTER */}
        {(() => {
          const currentStatusObj = statuses.find(s => s.value === currentStatus) || statuses[0];
          const CurrentIcon = currentStatusObj.icon;
          return (
            <div className="relative shrink-0 w-full md:w-auto">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-widest text-slate-800 dark:text-sky-400 shadow-sm hover:border-sky-500/55 hover:text-sky-600 dark:hover:text-sky-300 transition duration-300 cursor-pointer min-w-[200px] w-full"
              >
                <div className="flex items-center gap-2">
                  <CurrentIcon size={14} className="text-sky-500" />
                  <span>{currentStatusObj.label}</span>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-full min-w-[200px] bg-white dark:bg-slate-700 border border-slate-200/60 dark:border-slate-600 rounded-2xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-1 duration-200">
                    {statuses.map((s) => {
                      const active = currentStatus === s.value;
                      const Icon = s.icon;
                      return (
                        <button
                          key={s.value}
                          onClick={() => {
                            handleStatusClick(s.value);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-black uppercase tracking-widest transition-colors cursor-pointer ${active
                            ? "bg-sky-50/50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-400"
                            : "text-slate-600 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                          <Icon size={14} className={active ? "text-sky-600 dark:text-sky-400" : "text-slate-400"} />
                          <span>{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })()}
      </header>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3 animate-pulse">
              {/* Card Image matching CabinCard aspect ratio and rounding */}
              <div className="aspect-[4/3] w-full rounded-2xl md:rounded-3xl bg-slate-200 dark:bg-slate-800" />
              {/* Replicated action buttons block placeholder */}
              <div className="flex gap-2">
                <div className="flex-1 h-[38px] rounded-xl bg-slate-200 dark:bg-slate-800" />
                <div className="flex-1 h-[38px] rounded-xl bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      ) : safeBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-16 text-center max-w-xl mx-auto">
          <Compass className="h-14 w-14 mx-auto text-slate-400 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">No stays found</h3>
          <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
            {currentStatus !== "all"
              ? `You don't have any bookings matching the "${currentStatus}" filter. Try adjusting your filter or explore new stays.`
              : "You haven't reserved any retreats yet. Explore our selection of cabins and find your perfect stay!"}
          </p>
          <button
            onClick={handleExploreCabins}
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-sky-600 px-6 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-sky-500 transition active:scale-95"
          >
            Explore Cabins <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {safeBookings.map((booking: any) => {
              // Find corresponding cabin to resolve thumbnail
              const cabinInfo = safeCabins.find((c) => c.id === booking.cabin_id);
              if (!cabinInfo) return null;
              const realStatus = getBookingRealStatus(booking);

              return (
                <CabinCard
                  key={booking.id}
                  cabin={cabinInfo}
                  variant="small"
                  booking={{
                    id: booking.id,
                    start_date: booking.start_date,
                    end_date: booking.end_date,
                    total_price: booking.total_price,
                    realStatus: realStatus
                  }}
                />
              );
            })}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default MyBookings;
