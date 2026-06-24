import { layoutConfig, pageSpacing } from "@shared/utils/spacing";
import SectionHeader from "@shared/components/ui/SectionHeader";

const ExploreLocationsSkeleton = () => {
    return (
        <section id="explore-locations" className={`${pageSpacing.section} bg-slate-50/50 dark:bg-slate-900/30 relative w-full`}>
            <div className={layoutConfig.container}>
                <SectionHeader
                    label="Explore Destinations"
                    title="Browse by Location"
                    subtitle="From snowy peaks to forest hideaways, find the landscape that calls to you."
                    highlightIndex={2}
                    className={`relative z-10 ${layoutConfig.headerMargin}`}
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:h-[400px]">
                    <div className="row-span-2 rounded-2xl md:rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse aspect-[4/5] md:aspect-auto" />
                    {[0, 1, 2, 3].map((_, idx) => (
                        <div
                            key={idx}
                            className={`rounded-2xl md:rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse ${idx >= 2 ? "hidden md:block" : ""}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExploreLocationsSkeleton;
