import { useMemo, useState } from "react";
import { Banknote, BedDouble, CalendarCheck2, ChartColumn } from "lucide-react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCard from "../components/dashboard/StatsCard";
import SalesChart from "../components/dashboard/SalesChart";
import StayDurationChart from "../components/dashboard/StayDurationChart";
import TodayList from "../components/dashboard/TodayList";

import { useBookings } from "../authentication/useBookings";
import type { Booking } from "../types/booking";

const Dashboard = () => {
  const { bookings = [], isLoading, error } = useBookings();
  const [range, setRange] = useState(7);
  const dashboardDate = useMemo(() => new Date(), []);
  // normalize window to include entire days (start at 00:00, end at 23:59:59)
  const rangeEnd = useMemo(() => {
    const d = new Date(dashboardDate);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [dashboardDate]);

  const rangeStart = useMemo(() => {
    const d = new Date(dashboardDate);
    d.setDate(d.getDate() - (range - 1));
    d.setHours(0, 0, 0, 0);
    return d;
  }, [dashboardDate, range]);

  const startMs = rangeStart.getTime();
  const endMs = rangeEnd.getTime();

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking: Booking) => {
      const bookingDateMs = new Date(booking.start_date).getTime();
      return bookingDateMs >= startMs && bookingDateMs <= endMs;
    });
  }, [bookings, startMs, endMs]);

  const totalBookings = filteredBookings.length;

  const totalSales = filteredBookings.reduce(
    (acc: number, booking: Booking) => acc + booking.total_price,
    0
  );

  const checkedIn = filteredBookings.filter(
    (booking: Booking) => booking.status === "checked-in"
  ).length;

  const occupancyRate =
    totalBookings > 0 ? Math.round((checkedIn / totalBookings) * 100) : 0;

  // compute activity counts for the selected window (last N days)
  // filteredBookings are bookings whose start_date is within the window

  const departuresInWindow = bookings.filter((b) => {
    const end = new Date(b.end_date);
    return end.getTime() >= startMs && end.getTime() <= endMs;
  }).length;

  const checkInsInWindow = filteredBookings.filter((b) => b.status === "checked-in").length;

  const salesChartsData = useMemo(() => {
    const grouped: Record<string, number> = {};

    filteredBookings.forEach((booking: Booking) => {
      const date = new Date(booking.start_date).toLocaleDateString();

      if (!grouped[date]) {
        grouped[date] = 0;
      }

      grouped[date] += booking.total_price;
    });

    return Object.entries(grouped).map(([date, sales]) => ({
      date,
      sales,
    }));
  }, [filteredBookings]);

  const stayDurationData = useMemo(() => {
    const durations = {
      "2 Nights": 0,
      "3 Nights": 0,
      "4-5 Nights": 0,
      "8-14 Nights": 0,
    };

    filteredBookings.forEach((booking: Booking) => {
      const nights = Math.ceil(
        (new Date(booking.end_date).getTime() -
          new Date(booking.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      if (nights === 2) {
        durations["2 Nights"] += 1;
      } else if (nights === 3) {
        durations["3 Nights"] += 1;
      } else if (nights >= 4 && nights <= 5) {
        durations["4-5 Nights"] += 1;
      } else if (nights >= 8 && nights <= 14) {
        durations["8-14 Nights"] += 1;
      }
    });

    return Object.entries(durations).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredBookings]);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatShortDate = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const formatShortTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  // bookings that either start or end in the current window
  const windowActivity = bookings
    .filter((b) => {
      const s = new Date(b.start_date).getTime();
      const e = new Date(b.end_date).getTime();
      return (s >= startMs && s <= endMs) || (e >= startMs && e <= endMs);
    })
    .sort((a, z) => new Date(a.start_date).getTime() - new Date(z.start_date).getTime());

  return (
    <div className="min-h-screen space-y-6 rounded-4xl bg-linear-to-br from-slate-50 via-white to-indigo-50/60 p-4 md:p-6 lg:p-8">
      {(isLoading || error) && (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          {isLoading ? "Loading dashboard data..." : "Dashboard data could not be loaded from Supabase."}
        </div>
      )}

      <DashboardHeader range={range} onChangeRange={setRange} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Bookings"
          value={totalBookings}
          icon={<BedDouble size={26} strokeWidth={2.25} />}
          color="bg-sky-100"
        />
        <StatsCard
          title="Sales"
          value={`$${totalSales}`}
          icon={<Banknote size={26} strokeWidth={2.25} />}
          color="bg-emerald-100"
        />
        <StatsCard
          title="Check Ins"
          value={checkedIn}
          icon={<CalendarCheck2 size={26} strokeWidth={2.25} />}
          color="bg-indigo-100"
        />
        <StatsCard
          title="Occupancy Rate"
          value={`${occupancyRate}%`}
          icon={<ChartColumn size={26} strokeWidth={2.25} />}
          color="bg-amber-100"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TodayList bookings={bookings} windowStart={startMs} windowEnd={endMs} />
        <StayDurationChart data={stayDurationData} />
      </div>

      {/* Active window summary */}
      <div className="mt-4 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Active window</div>
            <div className="text-base font-semibold text-slate-900">
              {formatShortDate(rangeStart)} — {formatShortDate(rangeEnd)} <span className="text-sm text-slate-500">· Last {range} days</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm">
              <span className="font-semibold">{filteredBookings.length}</span>
              <span className="text-slate-500">Bookings</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm">
              <span className="font-semibold">{departuresInWindow}</span>
              <span className="text-slate-500">Departures</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm">
              <span className="font-semibold">{checkInsInWindow}</span>
              <span className="text-slate-500">Check-ins</span>
            </div>
          </div>
        </div>

        <div className="mt-3 border-t pt-3">
          {windowActivity.length === 0 ? (
            <div className="text-sm text-slate-500">No activity in this window.</div>
          ) : (
            <div className="space-y-2">
              {windowActivity.slice(0, 6).map((b) => (
                <div key={b.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-600">{formatShortDate(new Date(b.start_date))} {formatShortTime(new Date(b.start_date))} → {formatShortDate(new Date(b.end_date))} {formatShortTime(new Date(b.end_date))}</div>
                    <div className="font-medium text-slate-900">{b.guests?.full_name ?? '—'}</div>
                  </div>

                  <div className="text-sm text-slate-500">{Math.ceil((new Date(b.end_date).getTime() - new Date(b.start_date).getTime())/(1000*60*60*24))} nights</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <SalesChart
          title={`Sales from ${formatDate(rangeStart)} — ${formatDate(rangeEnd)}`}
          data={salesChartsData}
        />
      </div>
    </div>
  );
};

export default Dashboard;