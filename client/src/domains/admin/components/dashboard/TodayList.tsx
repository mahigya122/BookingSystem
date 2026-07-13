import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
	const navigate = useNavigate();
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
		<div className="card bg-white dark:bg-slate-900 border-rose-200/80 dark:border-rose-900/40">
			<div className="card-header">
                <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Recent Activity Log
                </h2>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    Live Feed
                </span>
			</div>

			<div className="divide-y divide-slate-100 dark:divide-slate-800">
				{items.length === 0 ? (
					<div className="p-8 text-center text-slate-400 font-bold text-xs">
                        No activity recorded in this window
                    </div>
				) : (
					items.map((booking) => {
						const startMs = toLocalDateMs(booking.start_date);
						const isArrival = startMs >= windowStart && startMs <= windowEnd;
						const mergedStatus = localStatus[booking.id] ?? booking.status;

						const badge = mergedStatus === "cancelled"
							? "Cancelled"
							: mergedStatus === "cancelling"
								? "Cancelling"
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
								onClick={() => {
									if (mergedStatus === "cancelling") {
										navigate(`/payments?highlight=${booking.id}`);
									}
								}}
								className={`flex items-center justify-between gap-3 px-5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group ${
									mergedStatus === "cancelling" 
										? "cursor-pointer border-l-4 border-rose-500/80 bg-rose-500/[0.02]" 
										: "border-l-4 border-transparent"
								}`}
							>
								<div className="flex items-center gap-4">
									<div style={{ minWidth: "90px" }}>
                                        <span
                                            className={`badge text-[10px] ${
                                                mergedStatus === "cancelled"
                                                    ? "badge-danger"
                                                    : mergedStatus === "cancelling"
                                                        ? "bg-rose-500/20 text-rose-500 dark:bg-rose-500/30 dark:text-rose-400 border border-rose-500/30 animate-pulse font-black"
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
										<span className="text-xs font-bold text-slate-900 dark:text-slate-100">
											{booking.guests?.full_name ?? "Unknown guest"}
										</span>
										<div className="flex items-center gap-1.5 mt-0.5">
                                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                {new Date(booking.start_date).toLocaleDateString()} — {new Date(booking.end_date).toLocaleDateString()}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase">
                                                • {formatNights(booking.start_date, booking.end_date)}
                                            </span>
                                        </div>
									</div>
								</div>

								<div className="flex items-center gap-3">
									{mergedStatus === "cancelling" && (
										<button
											onClick={(e) => {
												e.stopPropagation();
												navigate(`/payments?highlight=${booking.id}`);
											}}
											className="btn-action bg-rose-500 hover:bg-rose-600 text-white h-8 px-3 cursor-pointer select-none font-bold text-xs"
										>
											Review Cancel
										</button>
									)}

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
