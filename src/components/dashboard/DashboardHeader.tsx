interface Props {
  range: number;
  onChangeRange: (days: number) => void;
}

const DashboardHeader = ({
  range,
  onChangeRange,
}: Props) => {
  return (
    <div className="inline-flex items-center gap-1 p-1 surface-panel-strong rounded-2xl shadow-sm">
      {[7, 30, 90].map((days) => (
        <button
          key={days}
          onClick={() => onChangeRange(days)}
          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${
            range === days
              ? "text-white shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white/10 dark:hover:bg-white/5"
          }`}
          style={range === days ? { background: "linear-gradient(135deg, var(--app-primary), var(--app-secondary))" } : undefined}
        >
          {days === 7 ? "1 Week" : days === 30 ? "1 Month" : "3 Months"}
        </button>
      ))}
    </div>
  );
}

export default DashboardHeader;
