import {
  Banknote,
  BedDouble,
  CalendarCheck2,
} from "lucide-react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCard from "../components/dashboard/StatsCard";
import SalesChart from "../components/dashboard/SalesChart";
import StayDurationChart from "../components/dashboard/StayDurationChart";
import TodayActivity from "../components/dashboard/TodayActivity";
import TodayList from "../components/dashboard/TodayList";

import { useBookings } from "../authentication/useBookings";

import { useDashboardRange } from "../authentication/useDashboardRange";
import { useDashboardStats } from "../authentication/useDashboardStats";
import { useSalesChart } from "../authentication/useSalesChart";
import { useStayDuration } from "../authentication/useStayDuration";
import { useTodayActivity } from "../authentication/useTodayActivity";

const Dashboard = () => {
  const { bookings = [] } = useBookings();

  const { range, setRange, rangeStart, rangeEnd } = useDashboardRange();

  const startMs = rangeStart.getTime();
  const endMs = rangeEnd.getTime();

  const {
    filteredBookings,
    totalBookings,
    totalSales,
    checkedIn,
    occupancyRate,
  } = useDashboardStats({
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

  return (
    <div className="space-y-8 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Monitor your hotel performance and daily activities.</p>
        </div>
        <DashboardHeader 
          range={range}
          onChangeRange={setRange}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Bookings"
          value={totalBookings}
          icon={<BedDouble size={20} />}
          color="bg-blue-50 dark:bg-blue-900/20"
        />

        <StatsCard
          title="Total Sales"
          value={`$${totalSales}`}
          icon={<Banknote size={20} />}
          color="bg-emerald-50 dark:bg-emerald-900/20"
        />

        <StatsCard
          title="Check-ins"
          value={checkedIn}
          icon={<CalendarCheck2 size={20} />}
          color="bg-indigo-50 dark:bg-indigo-900/20"
        />
        <StatsCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          icon={<div className="font-bold text-xs">%</div>}
          color="bg-amber-50 dark:bg-amber-900/20"
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

      <TodayList
        bookings={bookings}
        windowStart={startMs}
        windowEnd={endMs}
      />
    </div>
  );
};

export default Dashboard;    