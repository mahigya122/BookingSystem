import { ChevronLeft, ChevronRight } from "lucide-react";

// Format date to YYYY-MM-DD string in local timezone
const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

interface CabinCalendarProps {
    startDate: Date | null;
    endDate: Date | null;
    currentMonth: Date;
    bookedDatesSet: Set<string>;
    userBookingsByDate: Map<string, string>; // date string -> status
    onDayClick: (date: Date) => void;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onResetDates: () => void;
}

const CabinCalendar = ({
    startDate,
    endDate,
    currentMonth,
    bookedDatesSet,
    userBookingsByDate,
    onDayClick,
    onPrevMonth,
    onNextMonth,
    onResetDates,
}: CabinCalendarProps) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalMonthDays = new Date(year, month + 1, 0).getDate();

    const daysArray: (Date | null)[] = [];
    for (let i = 0; i < firstDayIndex; i++) daysArray.push(null);
    for (let d = 1; d <= totalMonthDays; d++) daysArray.push(new Date(year, month, d));

    const todayStr = formatDateString(new Date());
    const startStr = startDate ? formatDateString(startDate) : "";
    const endStr = endDate ? formatDateString(endDate) : "";

    return (
        <div className="space-y-10 border-t border-slate-100 dark:border-slate-800/80 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                        Selection Theatre
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Select your stay dates like choosing seats in a premium cinema.
                    </p>
                </div>

                {(startDate || endDate) && (
                    <button
                        onClick={onResetDates}
                        className="text-xs font-extrabold uppercase tracking-wider text-sky-600 hover:text-sky-700 bg-sky-50 dark:bg-sky-950/30 px-3.5 py-2 rounded-xl transition cursor-pointer"
                    >
                        Clear Selection
                    </button>
                )}
            </div>

            <div className="relative rounded-[3rem] border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 p-8 shadow-2xl overflow-hidden backdrop-blur-sm">
                {/* Cinema Screen Representation */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-full max-w-md h-1.5 bg-gradient-to-r from-transparent via-sky-500 to-transparent rounded-full shadow-[0_8px_25px_rgba(14,165,233,0.6)]" />
                    <span className="mt-3 text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Cabin Horizon / Front</span>
                </div>

                {/* Month Header */}
                <div className="flex items-center justify-between mb-8 px-4">
                    <span className="font-black text-xl text-slate-900 dark:text-white tracking-tight">
                        {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onPrevMonth}
                            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all shadow-sm active:scale-95"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={onNextMonth}
                            className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-all shadow-sm active:scale-95"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Day Names */}
                <div className="grid grid-cols-7 gap-3 text-center mb-4">
                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName) => (
                        <span key={dayName} className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                            {dayName}
                        </span>
                    ))}
                </div>

                {/* Days Grid - The "Seats" */}
                <div className="grid grid-cols-7 gap-3">
                    {daysArray.map((date, idx) => {
                        if (!date) return <div key={`empty-${idx}`} className="aspect-square" />;

                        const dateStr = formatDateString(date);
                        const isBooked = bookedDatesSet.has(dateStr);
                        const userBookingStatus = userBookingsByDate.get(dateStr);
                        const isMine = !!userBookingStatus;
                        const isPast = dateStr < todayStr;
                        const isToday = dateStr === todayStr;
                        const isStart = startStr && dateStr === startStr;
                        const isEnd = endStr && dateStr === endStr;
                        const isWithinRange =
                            startDate && endDate && dateStr > startStr && dateStr < endStr;

                        let cellClass =
                            "aspect-square flex flex-col items-center justify-center rounded-[0.75rem] text-sm font-black transition-all duration-300 relative group ";

                        if (isStart || isEnd) {
                            // YOUR SELECTION - Vibrant Blue
                            cellClass += "bg-sky-500 text-white border-sky-600 shadow-[0_0_35px_rgba(14,165,233,0.9)] scale-[1.08] z-20 ";
                        } else if (isWithinRange) {
                            // SELECTION RANGE - Transparent Blue
                            cellClass += "bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-300/30 ";
                        } else if (isMine && (userBookingStatus === "booked" || userBookingStatus === "checked-in") && !isPast) {
                            // YOUR ACTIVE/UPCOMING STAY - Green
                            cellClass += "bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,1)] ring-2 ring-emerald-300 animate-pulse-slow scale-[1.02] z-10 ";
                        } else if (isMine && userBookingStatus === "checked-out") {
                            // YOUR COMPLETED STAY - Blue
                            cellClass += "bg-sky-600 text-white shadow-[0_0_20px_rgba(14,165,233,0.6)] ring-1 ring-sky-300 scale-[1.02] z-10 ";
                        } else if (isMine && userBookingStatus === "cancelled") {
                            // YOUR CANCELLED STAY - Yellow
                            cellClass += "bg-amber-400 text-amber-950 shadow-[0_0_15px_rgba(251,191,36,0.4)] ring-1 ring-amber-300 scale-[0.98] cursor-pointer ";
                        } else if (isMine && isPast) {
                            // YOUR PAST STAY (not completed/cancelled) - Red
                            cellClass += "bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] ring-1 ring-rose-300 scale-[0.95] cursor-not-allowed ";
                        } else if (isBooked) {
                            // RESERVED BY OTHERS - Red
                            cellClass += "bg-rose-500/80 dark:bg-rose-900/60 text-white scale-[0.9] cursor-not-allowed ";
                        } else {
                            cellClass += "cursor-pointer border-b-[3px] ";
                            if (isPast) {
                                cellClass += "bg-slate-100/50 dark:bg-slate-800/20 text-slate-300 dark:text-slate-700 cursor-not-allowed ";
                            } else {
                                cellClass += "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-100 dark:border-slate-800 hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:border-sky-300 hover:scale-[1.1] hover:shadow-lg ";
                            }
                        }

                        return (
                            <button
                                key={`day-${dateStr}`}
                                disabled={isPast && !isMine || (isBooked && !isMine) || (isMine && userBookingStatus !== "cancelled" && userBookingStatus !== "checked-out")}
                                onClick={() => onDayClick(date)}
                                className={cellClass}
                                title={isMine ? `Your Stay (${userBookingStatus})` : isBooked ? "Reserved Seat" : isPast ? "Expired Session" : date.toLocaleDateString()}
                            >
                                <span className="z-10">{date.getDate()}</span>
                                
                                {/* "My Cabin" Indicator - A small dot for user's own bookings */}
                                {isMine && (
                                    <div className={`absolute top-1 right-1 h-1.5 w-1.5 rounded-full shadow-sm animate-bounce ${userBookingStatus === 'cancelled' ? 'bg-amber-800' : 'bg-white'}`} />
                                )}

                                {/* "Seat Headrest" detail for visual flair */}
                                {!isPast && (
                                    <div className={`absolute top-1 w-1/2 h-1 rounded-full opacity-30 ${isStart || isEnd || isMine || isBooked ? "bg-white" : "bg-slate-400"}`} />
                                )}

                                {isToday && !isStart && !isEnd && (
                                    <span className={`absolute bottom-1.5 h-1 w-1 rounded-full ${isMine ? 'bg-white' : 'bg-sky-500 dark:bg-sky-400'}`} />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Cinema Style Legend */}
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                        <div className="h-5 w-5 rounded-lg bg-sky-500 border-b-[3px] border-sky-600 shadow-[0_0_15px_rgba(14,165,233,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Selected</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="h-5 w-5 rounded-lg bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] relative">
                             <div className="absolute top-0.5 right-0.5 h-1 w-1 rounded-full bg-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Upcoming</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="h-5 w-5 rounded-lg bg-sky-600 shadow-[0_0_15px_rgba(14,165,233,0.6)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Completed</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="h-5 w-5 rounded-lg bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cancelled</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="h-5 w-5 rounded-lg bg-rose-500 border border-rose-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Reserved / Past</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CabinCalendar;