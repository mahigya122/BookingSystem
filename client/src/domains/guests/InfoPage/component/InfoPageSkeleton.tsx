import { layoutConfig, pageSpacing } from "@shared/utils/spacing";

const InfoPageSkeleton = () => (
  <div className="flex-grow bg-white dark:bg-slate-950">
    <section className={`bg-slate-950 ${pageSpacing.section}`}>
      <div
        className={`${layoutConfig.container} flex flex-col items-center gap-3`}
      >
        <div className="h-3 w-28 rounded-full bg-slate-800 animate-pulse" />
        <div className="h-9 w-72 md:w-96 rounded-xl bg-slate-800 animate-pulse" />
        <div className="h-4 w-56 rounded-lg bg-slate-800 animate-pulse mt-1" />
      </div>
    </section>

    <section className={`${pageSpacing.section} w-full`}>
      <div className={`${layoutConfig.container} max-w-2xl mx-auto space-y-6`}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-4 w-11/12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default InfoPageSkeleton;
