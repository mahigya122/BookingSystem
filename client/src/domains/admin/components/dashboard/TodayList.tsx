import { useState } from "react";
import { useUpdateBooking } from "@shared/hooks";
import { toLocalDateMs } from "@shared/utils/dates";
import type { Booking } from "@shared/types/booking";

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
			const startMs = toLocalDateMs(booking.start_date);
			const endMs = toLocalDateMs(booking.end_date);

			return (
				(startMs >= windowStart && startMs <= windowEnd) ||
				(endMs >= windowStart && endMs <= windowEnd)
			);
		})
		.sort(
			(a, b) => toLocalDateMs(b.start_date) - toLocalDateMs(a.start_date)
		);

	return (
		<div className="card card-accent">
			<div className="card-header">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Recent Activity Log
                </h2>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Live Feed
                </span>
			</div>

			<div className="divide-y divide-slate-100 dark:divide-slate-800">
				{items.length === 0 ? (
					<div className="p-12 text-center text-slate-400 font-bold text-sm">
                        No activity recorded in this window
                    </div>
				) : (
					items.map((booking) => {
						const startMs = toLocalDateMs(booking.start_date);
						const isArrival = startMs >= windowStart && startMs <= windowEnd;
						const mergedStatus = localStatus[booking.id] ?? booking.status;

						const badge = mergedStatus === "cancelled"
							? "Cancelled"
							: mergedStatus === "checked-out"
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
								className="flex items-center justify-between gap-4 px-8 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
							>
								<div className="flex items-center gap-6">
									<div style={{ minWidth: "100px" }}>
                                        <span
                                            className={`badge ${
                                                mergedStatus === "cancelled"
                                                    ? "badge-danger"
                                                    : badge === "Departed"
                                                        ? "badge-info"
                                                        : isArrival
                                                            ? "badge-success"
                                                            : "badge-warning"
                                            }`}
                                        >
                                            {badge}
                                        </span>
                                    </div>

									<div className="flex flex-col">
										<span className="font-bold text-slate-900 dark:text-slate-100">
											{booking.guests?.full_name ?? "Unknown guest"}
										</span>
										<div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                                                {new Date(booking.start_date).toLocaleDateString()} — {new Date(booking.end_date).toLocaleDateString()}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase">
                                                • {formatNights(booking.start_date, booking.end_date)}
                                            </span>
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
											className="btn-action btn-action-primary h-8 px-3"
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
											className="btn-action btn-action-primary h-8 px-3"
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
