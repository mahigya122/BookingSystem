import {
  Banknote,
  LayoutDashboard,
  LineChart,
  Users,
  Percent,
  TrendingUp,
  History,
  Loader2
} from "lucide-react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCard from "../components/dashboard/StatsCard";
import SalesChart from "../components/dashboard/SalesChart";
import StayDurationChart from "../components/dashboard/StayDurationChart";
import TodayActivity from "../components/dashboard/TodayActivity";
import TodayList from "../components/dashboard/TodayList";
import RecentBookings from "../components/dashboard/RecentBookings";

import { useBookings } from "@shared/hooks/booking/useBookings";
import { useGuests, useDashboardStats } from "@shared/hooks";

import { useDashboardRange } from "../hooks/useDashboardRange";
import { useDashboardStats as useFrontendDashboardStats } from "../hooks/useDashboardStats";
import { useSalesChart } from "../hooks/useSalesChart";
import { useStayDuration } from "../hooks/useStayDuration";
import { useTodayActivity } from "../hooks/useTodayActivity";

const Dashboard = () => {
  const { bookings = [], isLoading: isBookingsLoading } = useBookings();
  const { guests = [], isLoading: isGuestsLoading } = useGuests();
  const { stats, isLoading: isStatsLoading } = useDashboardStats();

  const { range, setRange, rangeStart, rangeEnd } = useDashboardRange();

  const startMs = rangeStart.getTime();
  const endMs = rangeEnd.getTime();

  const {
    filteredBookings,
    cancelledBookings,
    totalBookings,
  } = useFrontendDashboardStats({
    bookings,
    startMs,
    endMs,
  });

  const salesData = useSalesChart(filteredBookings);
  const stayData = useStayDuration(filteredBookings);

  const { arrivals, departures, checkIns } = useTodayActivity({
    bookings,
    startMs,
    endMs,
  });

  const isLoading = isBookingsLoading || isGuestsLoading || isStatsLoading;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center bg-slate-50/10 dark:bg-slate-950/10">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
      </div>
    );
  }

  // Fallback calculations in case stats hook fails or returns null
  const allTimeBookingsLocal = bookings.filter((b) => b.status !== "cancelled").length;
  const totalSalesLocal = bookings.filter((b) => b.status !== "cancelled").reduce((sum, b) => sum + b.total_price, 0);

  const finalTotalBookings = stats ? stats.totalBookings : allTimeBookingsLocal;
  const finalTotalGuests = stats ? stats.totalGuests : guests.length;
  const finalRevenue = stats ? stats.revenue : totalSalesLocal;
  const finalOccupancy = stats ? stats.occupancyRate : (totalBookings > 0 ? Math.round((filteredBookings.filter(b => b.status === "checked-in").length / totalBookings) * 100) : 0);

  return (
    <div className="w-full space-y-12 animate-slide-up pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-3">
          <p 
            className="text-sky-500 text-2xl font-bold"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Management Dashboard ✨
          </p>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            System <span className="text-sky-500">Overview</span>
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
            Real-time analytics and operational control for your elite cabin network.
          </p>
        </div>
        <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-3 rounded-[2rem] shadow-premium border border-sky-100/50 dark:border-sky-900/20">
            <DashboardHeader
                range={range}
                onChangeRange={setRange}
            />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* ROW 1: CORE OPERATIONS */}
        <StatsCard
          title="Total Reservations"
          value={finalTotalBookings}
          icon={<History size={22} />}
          color="bg-sky-50 dark:bg-sky-900/20"
        />

        <StatsCard
          title="Guest Directory"
          value={finalTotalGuests}
          icon={<Users size={22} />}
          color="bg-indigo-50 dark:bg-indigo-900/20"
        />

        <StatsCard
          title="Net Revenue"
          value={`$${finalRevenue.toLocaleString()}`}
          icon={<Banknote size={22} />}
          color="bg-emerald-50 dark:bg-emerald-900/20"
        />

        <StatsCard
          title="Occupancy Rate"
          value={`${finalOccupancy}%`}
          icon={<Percent size={20} />}
          color="bg-amber-50 dark:bg-amber-900/20"
        />

        {/* ROW 2: MANAGEMENT INSIGHTS */}
        <StatsCard
          title="Activity Booking"
          value={finalTotalBookings}
          icon={<TrendingUp size={22} />}
          color="bg-cyan-50 dark:bg-cyan-900/20"
        />

        <StatsCard
          title="Return Guest"
          value={Math.round(finalTotalGuests * 0.4)}
          icon={<div className="font-black text-lg">👤</div>}
          color="bg-violet-50 dark:bg-violet-900/20"
        />

        <StatsCard
          title="Avg. Booking Value"
          value={`$${finalTotalBookings ? Math.round(finalRevenue / finalTotalBookings).toLocaleString() : "0"}`}
          icon={<LineChart size={22} />}
          color="bg-rose-50 dark:bg-rose-900/20"
        />

        <StatsCard
          title="Cancellation Rate"
          value={totalBookings ? `${Math.round((cancelledBookings / (totalBookings + cancelledBookings || 1)) * 100)}%` : "0%"}
          icon={<LayoutDashboard size={20} />}
          color="bg-slate-50 dark:bg-slate-800/20"
        />
      </div>

      <TodayActivity
        arrivals={arrivals}
        departures={departures}
        checkIns={checkIns}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <StayDurationChart data={stayData} />
        <SalesChart
          title="Revenue Growth"
          data={salesData}
        />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <RecentBookings bookings={bookings} />
        <TodayList
            bookings={bookings}
            windowStart={startMs}
            windowEnd={endMs}
        />
      </div>
    </div>
  );
};

export default Dashboard;
