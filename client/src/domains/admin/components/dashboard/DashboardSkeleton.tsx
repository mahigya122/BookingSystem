const SkeletonCard = () => (
    <div className="h-32 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
);

const DashboardSkeleton = () => {
    return (
        <div className="w-full space-y-12 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div className="space-y-4">
                    <div className="h-8 w-48 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                    <div className="h-14 w-80 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                    <div className="h-5 w-96 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                </div>

                <div className="h-16 w-72 animate-pulse rounded-[2rem] bg-slate-100 dark:bg-slate-800" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </div>

            {/* Today Activity */}
            <div className="h-40 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />

            {/* Charts */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="h-[400px] animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
                <div className="h-[400px] animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="h-[350px] animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
                <div className="h-[350px] animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800" />
            </div>
        </div>
    );
};
export default DashboardSkeleton;