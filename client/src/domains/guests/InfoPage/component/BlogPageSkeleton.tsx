import { layoutConfig, pageSpacing } from "@shared/utils/spacing";

const BlogPageSkeleton = () => (
  <div className="flex-grow bg-white dark:bg-slate-950">
    <section className={`bg-slate-950 ${pageSpacing.section}`}>
      <div
        className={`${layoutConfig.container} flex flex-col items-center gap-3`}
      >
        <div className="h-3 w-28 rounded-full bg-slate-800 animate-pulse" />
        <div className="h-9 w-72 md:w-96 rounded-xl bg-slate-800 animate-pulse" />
        <div className="h-4 w-64 rounded-lg bg-slate-800 animate-pulse mt-1" />
      </div>
    </section>

    <section className={`${pageSpacing.section} w-full`}>
      <div className={layoutConfig.container}>
        {/* Featured story */}
        <div className="grid md:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 mb-10">
          <div className="aspect-[16/11] md:aspect-auto bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="p-8 md:p-12 space-y-4 bg-slate-50 dark:bg-slate-900">
            <div className="h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-7 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-3 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 w-20 rounded-full bg-slate-100 dark:bg-slate-900 animate-pulse"
            />
          ))}
        </div>

        {/* Card grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="p-6 space-y-2">
                <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default BlogPageSkeleton;
