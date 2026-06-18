import { useBookings, useUser } from "@shared/hooks";
import { useCabinsData } from "../../cabins/hooks/useCabinsData";
import { useCabinFiltersContext } from "../../cabins/contexts/CabinFiltersContext";
import { useNavigate } from "react-router-dom";
import { getBookingRealStatus } from "@shared/utils/bookingUtils";
import { usePagination } from "@shared/hooks/usePagination";
import Pagination from "@shared/components/ui/Pagination";
import { Compass, ArrowRight, Loader2, Clock, CheckCircle2, XCircle, ListFilter } from "lucide-react";
import { useEffect } from "react";
import CabinCard from "../../cabins/components/CabinCard";
import { useFilterActions } from "../../../hooks/useFilterActions";

const MyBookings = () => {
  const { bookings = [], isLoading: loadingBookings } = useBookings();
  const { cabins = [], isLoading: loadingCabins } = useCabinsData();
  const { user } = useUser();
  const { filters, setIsSearching } = useCabinFiltersContext();
  const { handleStatusChange } = useFilterActions();
  const navigate = useNavigate();

  const isLoading = loadingBookings || loadingCabins;

  // Filter bookings belonging to the logged-in user
  const userBookings = bookings.filter((b) => b.guests?.email === user?.email);

  // Apply booking status filters
  const filteredBookings = userBookings.filter((b) => {
    const realStatus = getBookingRealStatus(b);
    if (filters.bookingStatus === "all") return true;
    if (filters.bookingStatus === "upcoming") {
      return realStatus === "booked" || realStatus === "checked-in";
    }
    if (filters.bookingStatus === "completed") {
      return realStatus === "checked-out";
    }
    if (filters.bookingStatus === "cancelled") {
      return realStatus === "cancelled";
    }
    return true;
  });

  // Sort bookings so that the newest or most upcoming stays are at the top
  const sortedBookings = [...filteredBookings].sort(
    (a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(sortedBookings, 8);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.bookingStatus, setCurrentPage]);

  const handleExploreCabins = () => {
    setIsSearching(true);
    navigate("/");
  };

  const statuses: { label: string; value: typeof filters.bookingStatus; icon: any }[] = [
    { label: "All Stays", value: "all", icon: ListFilter },
    { label: "Upcoming", value: "upcoming", icon: Clock },
    { label: "Completed", value: "completed", icon: CheckCircle2 },
    { label: "Cancelled", value: "cancelled", icon: XCircle },
  ];

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center bg-slate-50/10 dark:bg-slate-950/10">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="px-4 md:px-0 space-y-12 pb-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-12">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">
            Itinerary Management
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            My Reservations
          </h1>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-md">
            You have {userBookings.length} total stays booked under {user?.email}. Filter by status to manage your upcoming or past journeys.
          </p>
        </div>

        {/* INLINE STATUS FILTERS */}
        <div className="flex flex-wrap items-center bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
          {statuses.map((s) => {
            const active = filters.bookingStatus === s.value;
            const Icon = s.icon;
            return (
              <button
                key={s.value}
                onClick={() => handleStatusChange(s.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  active 
                    ? "bg-white dark:bg-slate-700 text-sky-600 shadow-sm border border-slate-100 dark:border-slate-600" 
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                }`}
              >
                <Icon size={14} className={active ? "text-sky-600" : "text-slate-400"} />
                {s.label}
              </button>
            );
          })}
        </div>
      </header>

      {sortedBookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-16 text-center max-w-xl mx-auto">
          <Compass className="h-14 w-14 mx-auto text-slate-400 dark:text-slate-600 mb-4" />
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">No stays found</h3>
          <p className="mt-2 text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
            {filters.bookingStatus !== "all"
              ? `You don't have any bookings matching the "${filters.bookingStatus}" filter. Try adjusting your filter or explore new stays.`
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedData.map((booking: any) => {
              // Find corresponding cabin to resolve thumbnail
              const cabinInfo = cabins.find((c) => c.id === booking.cabin_id);
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
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default MyBookings;
