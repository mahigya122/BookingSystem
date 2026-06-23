import { supabase } from "../lib/supabase.js";

export async function getDashboardStats({ startDate, endDate } = {}) {
    let start = startDate;
    let end = endDate;

    if (!start || !end) {
        const today = new Date();
        const dEnd = new Date(today);
        dEnd.setHours(23, 59, 59, 999);
        const dStart = new Date(today);
        dStart.setDate(dStart.getDate() - 6);
        dStart.setHours(0, 0, 0, 0);

        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };
        start = formatDate(dStart);
        end = formatDate(dEnd);
    }

    // 1. Total guests (all time)
    const { count: totalGuests } = await supabase
        .from("guests")
        .select("*", { count: "exact", head: true });

    // 2. Fetch cabins
    const { data: cabins } = await supabase
        .from("cabins")
        .select("id");

    // 3. Fetch bookings in range
    let bookingsQuery = supabase
        .from("bookings")
        .select(`
            id,
            created_at,
            cabin_id,
            start_date,
            end_date,
            status,
            total_price,
            has_breakfast,
            payment_status,
            payment_method,
            guest_id,
            guests (full_name, email),
            cabins (name)
        `);

    bookingsQuery = bookingsQuery
        .lte("start_date", end)
        .gte("end_date", start);

    const { data: bookingsInRange, error: bookingsError } = await bookingsQuery;
    if (bookingsError) {
        throw new Error(bookingsError.message || "Failed to fetch bookings in range");
    }

    // 4. Fetch top 5 recent bookings (all time)
    const { data: recentBookings, error: recentError } = await supabase
        .from("bookings")
        .select(`
            id,
            created_at,
            cabin_id,
            start_date,
            end_date,
            status,
            total_price,
            has_breakfast,
            payment_status,
            payment_method,
            guest_id,
            guests (full_name, email),
            cabins (name)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

    if (recentError) {
        throw new Error(recentError.message || "Failed to fetch recent bookings");
    }

    // Calculations based on range
    const activeBookings = bookingsInRange.filter(b => b.status !== "cancelled");
    const totalBookings = activeBookings.length;
    const revenue = activeBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    const checkedInCount = activeBookings.filter(b => b.status === "checked-in").length;

    // Occupancy (matching backend logic but within range / cabin capacity)
    const occupancyRate =
        cabins?.length && totalBookings
            ? Math.round((checkedInCount / totalBookings) * 100)
            : 0;

    // salesChartData
    const salesGrouped = {};
    bookingsInRange.forEach(booking => {
        if (booking.status === "cancelled") return;
        const dateKey = booking.start_date; // YYYY-MM-DD
        if (!salesGrouped[dateKey]) {
            salesGrouped[dateKey] = 0;
        }
        salesGrouped[dateKey] += booking.total_price || 0;
    });

    const salesChartData = Object.entries(salesGrouped)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([dateKey, sales]) => {
            const parts = dateKey.split("-").map(Number);
            const date = new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString();
            return { date, sales };
        });

    // stayDurationData
    const durations = {
        "2 Nights": 0,
        "3 Nights": 0,
        "4-5 Nights": 0,
        "8-14 Nights": 0,
    };
    bookingsInRange.forEach((booking) => {
        if (booking.status === "cancelled") return;
        const startD = new Date(booking.start_date);
        const endD = new Date(booking.end_date);
        const nights = Math.ceil((endD - startD) / (1000 * 60 * 60 * 24));

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

    const stayDurationData = Object.entries(durations).map(([name, value]) => ({
        name,
        value,
    }));

    // todayActivity counts
    const startMs = new Date(start).getTime();
    const endMs = new Date(end).getTime();

    const arrivals = bookingsInRange.filter((booking) => {
        if (booking.status === "cancelled") return false;
        const bStart = new Date(booking.start_date).getTime();
        return bStart >= startMs && bStart <= endMs;
    }).length;

    const departures = bookingsInRange.filter((booking) => {
        if (booking.status === "cancelled") return false;
        const bEnd = new Date(booking.end_date).getTime();
        return bEnd >= startMs && bEnd <= endMs;
    }).length;

    const checkIns = bookingsInRange.filter((booking) => {
        const bStart = new Date(booking.start_date).getTime();
        const bEnd = new Date(booking.end_date).getTime();
        return booking.status === "checked-in" && bStart <= endMs && bEnd >= startMs;
    }).length;

    const todayActivity = { arrivals, departures, checkIns };

    const cancelledBookingsCount = bookingsInRange.filter(b => b.status === "cancelled").length;

    // todayBookings (activity feed)
    const todayBookings = bookingsInRange
        .filter((booking) => {
            const bStart = new Date(booking.start_date).getTime();
            const bEnd = new Date(booking.end_date).getTime();
            return (bStart >= startMs && bStart <= endMs) || (bEnd >= startMs && bEnd <= endMs);
        })
        .sort((a, b) => b.start_date.localeCompare(a.start_date));

    return {
        totalBookings,
        totalGuests: totalGuests || 0,
        revenue,
        occupancyRate,
        salesChartData,
        stayDurationData,
        todayActivity,
        recentBookings,
        todayBookings,
        cancelledBookingsCount,
    };
}
