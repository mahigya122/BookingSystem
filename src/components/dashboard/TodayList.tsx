import { useState } from "react";
import { useUpdateBooking } from "../../authentication/useUpdateBooking";
import type { Booking } from "../../types/booking";

interface Props {
	bookings: Booking[];
	windowStart: number;
	windowEnd: number;
}

const formatNights = (start: string, end: string) => {
	const nights = Math.ceil(
		(new Date(end).getTime() - new Date(start).getTime()) /
			(1000 * 60 * 60 * 24)
	);

	return `${nights} night${nights === 1 ? "" : "s"}`;
};

const TodayList = ({ bookings, windowStart, windowEnd }: Props) => {
	const { editBooking } = useUpdateBooking();
	const [localStatus, setLocalStatus] = useState<Record<string, Booking["status"]>>({});

	const items = bookings
		.filter((booking) => {
			const startMs = new Date(booking.start_date).getTime();
			const endMs = new Date(booking.end_date).getTime();

			return (
				(startMs >= windowStart && startMs <= windowEnd) ||
				(endMs >= windowStart && endMs <= windowEnd)
			);
		})
		.sort(
			(a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
		);

	return (
		<div className="rounded-[1.75rem] border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.45)] backdrop-blur">
			<div className="flex items-center justify-between">
				<div>
					<p className="text-sm font-medium uppercase tracking-[0.28em] text-indigo-500">
						Overview
					</p>
					<h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900">
						Today
					</h2>
					<p className="mt-1 text-sm text-slate-500">
						Arrivals and departures within the selected window.
					</p>
				</div>
			</div>

			<div className="mt-5 space-y-3">
				{items.length === 0 ? (
					<p className="text-sm text-slate-500">No activity in this window.</p>
				) : (
					items.map((booking) => {
						const startMs = new Date(booking.start_date).getTime();
						const isArrival = startMs >= windowStart && startMs <= windowEnd;
						const mergedStatus = localStatus[booking.id] ?? booking.status;

						const badge = mergedStatus === "checked-out"
							? "Departed"
							: mergedStatus === "checked-in"
								? isArrival
									? "Arrived"
									: "Departing"
								: isArrival
									? "Arriving"
									: "Departing";

						const showCheckIn = isArrival && mergedStatus === "booked";
						const showCheckOut = !isArrival && mergedStatus === "checked-in";

						return (
							<div
								key={booking.id}
								className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4"
							>
								<div className="flex items-start gap-3">
									<span
										className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
											badge === "Departed"
												? "bg-slate-100 text-slate-700"
												: isArrival
													? "bg-emerald-100 text-emerald-800"
													: "bg-sky-100 text-sky-800"
										}`}
									>
										{badge}
									</span>

									<div>
										<div className="font-semibold text-slate-900">
											{booking.guests?.full_name ?? "Unknown guest"}
										</div>
										<div className="text-sm text-slate-500">
											{new Date(booking.start_date).toLocaleString()} → {new Date(booking.end_date).toLocaleString()}
										</div>
										<div className="text-xs text-slate-400">
											{formatNights(booking.start_date, booking.end_date)}
										</div>
									</div>
								</div>

								<div className="flex items-center gap-3">
									{showCheckIn && (
										<button
											onClick={() => {
												setLocalStatus((prev) => ({ ...prev, [booking.id]: "checked-in" }));
												editBooking({
													id: booking.id,
													start_date: booking.start_date,
													end_date: booking.end_date,
													total_price: booking.total_price,
													status: "checked-in",
													has_breakfast: booking.has_breakfast,
												});
											}}
											className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white shadow-sm transition hover:bg-indigo-700"
										>
											Check in
										</button>
									)}

									{showCheckOut && (
										<button
											onClick={() => {
												setLocalStatus((prev) => ({ ...prev, [booking.id]: "checked-out" }));
												editBooking({
													id: booking.id,
													start_date: booking.start_date,
													end_date: booking.end_date,
													total_price: booking.total_price,
													status: "checked-out",
													has_breakfast: booking.has_breakfast,
												});
											}}
											className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white shadow-sm transition hover:bg-indigo-700"
										>
											Check out
										</button>
									)}
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export default TodayList;
