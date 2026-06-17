import { useBookings, useUser, useCancelBooking } from "@shared/hooks";
import { useCabinsData } from "../../cabins/hooks/useCabinsData";
import { useCabinFiltersContext } from "../../cabins/contexts/CabinFiltersContext";
import { Link, useNavigate } from "react-router-dom";
import { getBookingRealStatus } from "@shared/utils/bookingUtils";
import { usePagination } from "@shared/hooks/usePagination";
import Pagination from "@shared/components/ui/Pagination";
import { Calendar, Utensils, CheckCircle2, Clock, Compass, ArrowRight, ShieldCheck, Loader2, XCircle } from "lucide-react";
import { useEffect } from "react";

// Format YYYY-MM-DD to a more readable date (e.g., "Jun 2, 2026")
const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const getDaysDiff = (startStr: string, endStr: string) => {
  try {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

const MyBookings = () => {
  const { bookings = [], isLoading: loadingBookings } = useBookings();
  const { cabins = [], isLoading: loadingCabins } = useCabinsData();
  const { user } = useUser();
  const { filters, setIsSearching } = useCabinFiltersContext();
  const { cancel, isCancelling } = useCancelBooking();
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
  } = usePagination(sortedBookings, 5);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.bookingStatus, setCurrentPage]);

  const handleExploreCabins = () => {
    setIsSearching(true);
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center bg-slate-50/10 dark:bg-slate-950/10">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      <header className="space-y-4">
        <div>
          <p className="text-sky-400 text-xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
            Your Departures & Journeys
          </p>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            My Reservations
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            Welcome back. You have {userBookings.length} total stays booked under {user?.email}.
          </p>
        </div>
      </header>

      {sortedBookings.length === 0 ? (
        <div className="rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 p-16 text-center max-w-xl mx-auto shadow-sm">
          <Compass className="h-14 w-14 mx-auto text-slate-400 dark:text-slate-600 mb-4 animate-pulse" />
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">No stays found</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {filters.bookingStatus !== "all"
              ? `You don't have any bookings matching the "${filters.bookingStatus}" filter.`
              : "You haven't reserved any retreats yet. Explore our selection of cabins and find your perfect stay!"}
          </p>
          {filters.bookingStatus === "all" && (
            <button
              onClick={handleExploreCabins}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 font-bold text-white hover:bg-sky-650 transition shadow-lg shadow-sky-200/50 dark:shadow-none hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
            >
              Explore Cabins <ArrowRight className="h-4.5 w-4.5" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {paginatedData.map((booking) => {
            // Find corresponding cabin to resolve thumbnail
            const cabinInfo = cabins.find((c) => c.id === booking.cabin_id);
            const duration = getDaysDiff(booking.start_date, booking.end_date);
            const realStatus = getBookingRealStatus(booking);

            // Set up status badge colors
            let statusLabel = "Reserved";
            let statusColorClass = "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50";
            let StatusIcon = Clock;

            if (realStatus === "checked-in") {
              statusLabel = "Checked In";
              statusColorClass = "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50";
              StatusIcon = ShieldCheck;
            } else if (realStatus === "checked-out") {
              statusLabel = "Completed";
              statusColorClass = "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-900/50";
              StatusIcon = CheckCircle2;
              statusColorClass = "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50";
            } else if (realStatus === "cancelled") {
              statusLabel = "Cancelled";
              statusColorClass = "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50";
              StatusIcon = Compass;
            }

            return (
              <div
                key={booking.id}
                className="group flex flex-col md:flex-row overflow-hidden rounded-[2rem] border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Cabin Image Column */}
                <div className="relative w-full md:w-80 h-48 md:h-auto overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={cabinInfo?.image_url || "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1000&auto=format&fit=crop"}
                    alt={booking.cabins?.name || "Cabin Retrat"}
                    className="h-full w-full object-cover group-hover:scale-103 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-60" />
                </div>

                {/* Details Column */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between gap-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-sky-650 dark:group-hover:text-sky-400 transition">
                        {booking.cabins?.name || "Premium Cabin"}
                      </h3>

                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${statusColorClass}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusLabel}
                      </span>
                    </div>

                    {/* Stay Dates & Duration */}
                    <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-650 dark:text-slate-400">
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <Calendar className="h-4 w-4 text-sky-500" />
                        <span>
                          {formatDate(booking.start_date)} — {formatDate(booking.end_date)}
                        </span>
                      </div>
                      <span className="font-extrabold text-slate-950 dark:text-white">
                        ({duration} night{duration > 1 ? "s" : ""})
                      </span>
                    </div>

                    {/* Inclusions */}
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                      {booking.has_breakfast ? (
                        <div className="flex items-center gap-1.5 text-sky-650 bg-sky-50 dark:bg-sky-950/20 px-2.5 py-1 rounded-lg border border-sky-100 dark:border-sky-900/30">
                          <Utensils className="h-3.5 w-3.5" />
                          <span>Includes Premium Breakfast</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 dark:bg-slate-800/30 px-2.5 py-1 rounded-lg">
                          <Utensils className="h-3.5 w-3.5" />
                          <span>No Breakfast Included</span>
                        </div>
                      )}

                      <span className="text-slate-350 dark:text-slate-700">|</span>
                      <span>Reservation ID: {booking.id.slice(0, 8)}...</span>
                    </div>
                  </div>

                  {/* Booking Pricing Summary & CTAs */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800/60 pt-6">
                    <div>
                      <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">Total Paid</span>
                      <span className="text-2xl font-black text-slate-950 dark:text-sky-400">
                        ${booking.total_price}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {realStatus === "booked" && (
                        <button
                          onClick={() => cancel(booking.id)}
                          disabled={isCancelling}
                          className="inline-flex items-center gap-2 rounded-full bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white dark:bg-rose-950/30 dark:hover:bg-rose-600 dark:text-rose-400 px-4.5 py-2.5 text-sm font-black transition duration-300 active:scale-95 border border-rose-100 dark:border-rose-900/50 hover:border-rose-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Cancel Booking</span>
                        </button>
                      )}

                      <Link
                        to={`/cabin/${booking.cabin_id}?bookingId=${booking.id}`}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-50 hover:bg-sky-500 text-slate-700 hover:text-white dark:bg-slate-800 dark:hover:bg-sky-500 dark:text-slate-200 px-4.5 py-2.5 text-sm font-black transition duration-300 active:scale-95 border border-slate-150 dark:border-slate-700/60 hover:border-sky-500 dark:hover:border-sky-500 cursor-pointer"
                      >
                        <span>View Cabin Details</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
