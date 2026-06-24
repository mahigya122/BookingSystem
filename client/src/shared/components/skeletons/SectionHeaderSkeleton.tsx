const SectionHeaderSkeleton = () => {
    return (
        <div className="space-y-4 text-center mb-12">
            <div className="flex flex-col items-center space-y-2">
                {/* Sub heading (Label) */}
                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                {/* Main Title */}
                <div className="h-8 w-64 md:w-80 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
            <div className="flex flex-col items-center space-y-2">
                {/* Underline */}
                <div className="h-1 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                {/* Subtitle */}
                <div className="h-3 w-72 md:w-96 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
            </div>
        </div>
    );
};

export default SectionHeaderSkeleton;
