interface Props {
  range: number;
  onChangeRange: (days: number) => void;
}

const DashboardHeader = ({
  range,
  onChangeRange,
}: Props) => {
  return (
    <div className="flex flex-col gap-4 rounded-[1.75rem] border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.45)] backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-indigo-500">
          Overview
        </p>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 max-w-xl text-sm text-slate-500">
          Track bookings, occupancy, and stay trends across the selected past window.
        </p>
      </div>

      <div className="inline-flex rounded-full bg-slate-100 p-1.5 shadow-inner">
        {[7, 30, 90].map((days) => (
          <button
            key={days}
            onClick={() => onChangeRange(days)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
              range === days
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                : "text-slate-600 hover:bg-white hover:text-slate-900"
            }`}
          >
            Last {days} Days
          </button>
        ))}
      </div>
    </div>
  );
}

export default DashboardHeader;