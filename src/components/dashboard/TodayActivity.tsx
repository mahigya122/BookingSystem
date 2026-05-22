interface Props {
  label?: string;
  arrivals: number;
  departures: number;
  checkIns: number;
}

const TodayActivity = ({
  label = "Today",
  arrivals,
    departures,
    checkIns,
}: Props) => {
    return(
        <div className="space-y-5 rounded-[1.75rem] border border-white/70 bg-white/85 p-6 shadow-[0_16px_45px_-26px_rgba(15,23,42,0.45)] backdrop-blur">
            <div>
              <h2 className="text-xl font-black tracking-tight text-slate-900">{label}</h2>
              <p className="mt-1 text-sm text-slate-500">Live snapshot of arrivals, departures, and check-ins.</p>
            </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <span className="text-sm font-medium text-slate-600">Arrivals</span>
          <span className= "text-lg font-black text-slate-900">{arrivals}</span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
        <span className="text-sm font-medium text-slate-600">Departures</span>
        <span className="text-lg font-black text-slate-900">
          {departures}
        </span>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
        <span className="text-sm font-medium text-slate-600">Checked In</span>
        <span className="text-lg font-black text-slate-900">
          {checkIns}
        </span>
      </div>
    </div>
  );
};
export default TodayActivity;