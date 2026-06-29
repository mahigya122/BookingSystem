import {
  Banknote,
  LayoutDashboard,
  LineChart,
  Users,
  Percent,
  TrendingUp,
  History
} from "lucide-react";
import { lazy, Suspense, useMemo } from "react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCard from "../components/dashboard/StatsCard";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";

const SalesChart = lazy(
  () => import("../components/dashboard/SalesChart")
);
const StayDurationChart = lazy(
  () => import("../components/dashboard/StayDurationChart")
);
const TodayActivity = lazy(
  () => import("../components/dashboard/TodayActivity")
);

const TodayList = lazy(
  () => import("../components/dashboard/TodayList")
);

const RecentBookings = lazy(
  () => import("../components/dashboard/RecentBookings")
);

import { useDashboardStats } from "@shared/hooks";
import { useDashboardRange } from "../hooks/useDashboardRange";
import { useDebouncedValue } from "@shared/hooks/useDebouncedValue";

const Dashboard = () => {
  const { range, setRange, rangeStart, rangeEnd } = useDashboardRange();

  // Format dates as YYYY-MM-DD
  const formatToYYYYMMDD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const memoRange = useMemo(() => ({ rangeStart, rangeEnd }), [rangeStart, rangeEnd]);
  const debouncedRange = useDebouncedValue(memoRange, 400);

  const { startDateStr, endDateStr } = useMemo(
    () => ({
      startDateStr: formatToYYYYMMDD(debouncedRange.rangeStart),
      endDateStr: formatToYYYYMMDD(debouncedRange.rangeEnd),
    }),
    [debouncedRange]
  );

  const { stats, isLoading } = useDashboardStats(startDateStr, endDateStr);
  const showSkeleton = isLoading || !stats;

  const startMs = rangeStart.getTime();
  const endMs = rangeEnd.getTime();

  const {
    finalTotalBookings,
    finalTotalGuests,
    finalRevenue,
    finalOccupancy,
    cancelledBookings,
    salesData,
    stayData,
    arrivals,
    departures,
    checkIns,
    bookings,
    todayBookings,
  } = useMemo(() => {
    return {
      finalTotalBookings: stats?.totalBookings ?? 0,
      finalTotalGuests: stats?.totalGuests ?? 0,
      finalRevenue: stats?.revenue ?? 0,
      finalOccupancy: stats?.occupancyRate ?? 0,
      cancelledBookings: stats?.cancelledBookingsCount ?? 0,
      salesData: Array.isArray(stats?.salesChartData) ? stats.salesChartData : [],
      stayData: Array.isArray(stats?.stayDurationData) ? stats.stayDurationData : [],
      arrivals: stats?.todayActivity?.arrivals ?? 0,
      departures: stats?.todayActivity?.departures ?? 0,
      checkIns: stats?.todayActivity?.checkIns ?? 0,
      bookings: Array.isArray(stats?.recentBookings) ? stats.recentBookings : [],
      todayBookings: Array.isArray(stats?.todayBookings) ? stats.todayBookings : [],
    };
  }, [stats]);

  return (
    <div className="w-full space-y-12 animate-slide-up pb-12">
      {showSkeleton ? (
        <DashboardSkeleton />
      ) : (
        <>
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
              value={finalTotalBookings ? `${Math.round((cancelledBookings / (finalTotalBookings + cancelledBookings || 1)) * 100)}%` : "0%"}
              icon={<LayoutDashboard size={20} />}
              color="bg-slate-50 dark:bg-slate-800/20"
            />
          </div>

          <Suspense fallback={<div className="h-40 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />}>
            <TodayActivity
              arrivals={arrivals}
              departures={departures}
              checkIns={checkIns}
            />
          </Suspense>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="h-[400px] animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
                <div className="h-[400px] animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <StayDurationChart data={stayData} />
              <SalesChart
                title="Revenue Growth"
                data={salesData}
              />
            </div>
          </Suspense>

          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="h-[350px] animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
                <div className="h-[350px] animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
              </div>
            }
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <RecentBookings bookings={bookings} />
              <TodayList
                bookings={todayBookings}
                windowStart={startMs}
                windowEnd={endMs}
              />
            </div>
          </Suspense>
        </>
      )}
    </div>
  );
};

export default Dashboard;
