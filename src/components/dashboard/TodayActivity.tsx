interface Props {
  label?: string;
  arrivals: number;
  departures: number;
  checkIns: number;
}

const TodayActivity = ({
  label = "Today's Occupancy",
  arrivals,
    departures,
    checkIns,
}: Props) => {
    return(
        <div className="card card-accent">
            <div className="card-header">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{label}</h2>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(229,9,20,0.45)]" style={{ backgroundColor: "var(--app-primary)" }} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Updates</span>
                </div>
            </div>

            <div className="card-body">
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
                    <div className="py-4 sm:py-0 sm:px-6 flex flex-col items-center first:pl-0">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Incoming Arrivals</span>
                        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{arrivals}</span>
                    </div>

                    <div className="py-4 sm:py-0 sm:px-6 flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Scheduled Departures</span>
                        <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{departures}</span>
                    </div>

                    <div className="py-4 sm:py-0 sm:px-6 flex flex-col items-center last:pr-0">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Total Checked-In</span>
                        <span className="text-3xl font-black text-primary-600 dark:text-primary-400 tracking-tight">{checkIns}</span>
                    </div>
                </div>
            </div>
    </div>
  );
};
export default TodayActivity;