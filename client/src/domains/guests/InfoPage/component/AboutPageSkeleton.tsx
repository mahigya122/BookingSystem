import { layoutConfig, pageSpacing } from "@shared/utils/spacing";

const AboutPageSkeleton = () => (
  <div className="flex-grow bg-white dark:bg-slate-950">
    {/* Hero */}
    <section className={`bg-slate-950 ${pageSpacing.section}`}>
      <div
        className={`${layoutConfig.container} flex flex-col items-center gap-3`}
      >
        <div className="h-3 w-24 rounded-full bg-slate-800 animate-pulse" />
        <div className="h-9 w-72 md:w-[28rem] rounded-xl bg-slate-800 animate-pulse" />
        <div className="h-4 w-64 rounded-lg bg-slate-800 animate-pulse mt-1" />
      </div>
    </section>

    {/* Story: image + text + stats */}
    <section className={`${pageSpacing.section} w-full`}>
      <div
        className={`${layoutConfig.container} grid md:grid-cols-2 gap-16 items-center`}
      >
        <div className="aspect-[4/3] rounded-[2rem] bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="space-y-4">
          <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-4 w-11/12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-11 w-40 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse mt-4" />
        </div>
      </div>

      <div
        className={`${layoutConfig.container} flex flex-wrap justify-center gap-x-12 gap-y-6 mt-16 pt-10 border-t border-slate-100 dark:border-slate-800`}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div className="h-8 w-16 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
        ))}
      </div>
    </section>

    {/* Values grid */}
    <section
      className={`${pageSpacing.section} bg-slate-50/50 dark:bg-slate-900/30 w-full`}
    >
      <div className={layoutConfig.container}>
        <div className="flex flex-col items-center gap-3 mb-12">
          <div className="h-3 w-24 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-8 w-72 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
        <div className="grid sm:grid-cols-3 gap-4 md:gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default AboutPageSkeleton;
