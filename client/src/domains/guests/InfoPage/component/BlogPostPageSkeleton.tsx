import { layoutConfig, pageSpacing } from "@shared/utils/spacing";

const BlogPostPageSkeleton = () => (
  <div className="flex-grow bg-white dark:bg-slate-950">
    <div className="h-[55vh] bg-slate-800 animate-pulse" />

    <section className={`${pageSpacing.section} w-full`}>
      <div className="max-w-3xl mx-auto px-6 space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-4 w-11/12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="h-4 w-4/5 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
          </div>
        ))}
      </div>
    </section>

    <section className={`${pageSpacing.section} w-full`}>
      <div className={layoutConfig.container}>
        <div className="h-6 w-40 rounded bg-slate-200 dark:bg-slate-800 animate-pulse mb-8" />
        <div className="grid sm:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
            >
              <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="p-4">
                <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default BlogPostPageSkeleton;
