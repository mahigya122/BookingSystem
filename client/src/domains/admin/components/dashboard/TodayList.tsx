import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useUpdateBooking } from "@shared/hooks";
import { toLocalDateMs } from "@shared/utils/dates";
import type { Booking } from "@shared/types/booking";
import { X, UserCheck, LogOut } from "lucide-react";

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
	const [confirmBooking, setConfirmBooking] = useState<{
		booking: Booking;
		type: "check-in" | "check-out";
	} | null>(null);

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
								className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group ${
									mergedStatus === "cancelling" 
										? "cursor-pointer border-l-4 border-rose-500/80 bg-rose-500/[0.02]" 
										: "border-l-4 border-transparent"
								}`}
							>
								<div className="flex flex-col xs:flex-row xs:items-center gap-3 w-full sm:w-auto">
									<div className="shrink-0" style={{ minWidth: "90px" }}>
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
										<div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                {new Date(booking.start_date).toLocaleDateString()} — {new Date(booking.end_date).toLocaleDateString()}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase">
                                                • {formatNights(booking.start_date, booking.end_date)}
                                            </span>
                                        </div>
									</div>
								</div>

								<div className="flex items-center gap-3 w-full sm:w-auto justify-end sm:justify-start">
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
												setConfirmBooking({ booking, type: "check-in" });
											}}
											className="btn-action btn-action-primary h-8 px-3"
										>
											Check in
										</button>
									)}

									{showCheckOut && (
										<button
											onClick={() => {
												setConfirmBooking({ booking, type: "check-out" });
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

			{confirmBooking && createPortal(
				<div className="modal-overlay select-none animate-in fade-in duration-200">
					<div className="modal-content w-full max-w-md p-8 space-y-6 animate-in zoom-in-95 duration-200">
						{/* Close button in corner */}
						<button 
							onClick={() => setConfirmBooking(null)}
							className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
						>
							<X size={18} />
						</button>

						{/* Modal Header/Icon */}
						<div className="flex flex-col items-center text-center space-y-4">
							<div className={`h-16 w-16 rounded-2xl flex items-center justify-center border ${
								confirmBooking.type === "check-in" 
									? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
									: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
							}`}>
								{confirmBooking.type === "check-in" ? (
									<UserCheck size={28} />
								) : (
									<LogOut size={28} />
								)}
							</div>
							
							<div className="space-y-1">
								<h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
									{confirmBooking.type === "check-in" ? "Confirm Guest Arrival" : "Confirm Guest Departure"}
								</h3>
								<p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
									Cabin: {confirmBooking.booking.cabins?.name}
								</p>
							</div>
						</div>

						{/* Modal Body */}
						<div className="bg-slate-50 dark:bg-slate-950/40 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/40 text-center">
							<p className="text-sm font-semibold text-slate-600 dark:text-slate-350 leading-relaxed">
								{confirmBooking.type === "check-in" 
									? `Did the guest ${confirmBooking.booking.guests?.full_name ?? "Unknown guest"} arrive?`
									: `Did the guest ${confirmBooking.booking.guests?.full_name ?? "Unknown guest"} check out?`
								}
							</p>
						</div>

						{/* Modal Footer Buttons */}
						<div className="grid grid-cols-2 gap-3 pt-2">
							<button
								onClick={() => setConfirmBooking(null)}
								className="btn btn-secondary py-3 text-xs font-black uppercase tracking-wider rounded-2xl"
							>
								Cancel
							</button>
							<button
								onClick={() => {
									const { booking, type } = confirmBooking;
									const nextStatus = type === "check-in" ? "checked-in" : "checked-out";
									
									setLocalStatus((prev) => ({ ...prev, [booking.id]: nextStatus }));
									editBooking({
										id: booking.id,
										start_date: booking.start_date,
										end_date: booking.end_date,
										total_price: booking.total_price,
										status: nextStatus,
										has_breakfast: booking.has_breakfast,
									});
									setConfirmBooking(null);
								}}
								className={`btn py-3 text-xs font-black uppercase tracking-wider rounded-2xl ${
									confirmBooking.type === "check-in"
										? "btn-primary shadow-lg shadow-sky-500/20"
										: "bg-rose-500 hover:bg-rose-600 text-white font-extrabold shadow-lg shadow-rose-500/20 border-none hover:-translate-y-1"
								}`}
							>
								{confirmBooking.type === "check-in" ? "Confirm arrival" : "Confirm checkout"}
							</button>
						</div>
					</div>
				</div>,
				document.body
			)}
		</div>
	);
};

export default TodayList;
