import { layoutConfig, pageSpacing } from "@shared/utils/spacing";
import SectionHeader from "@shared/components/ui/SectionHeader";

const ActivitiesSkeleton = () => {
    return (
        <section id="activities-section" className={`${pageSpacing.section} relative w-full`}>
            <div className={layoutConfig.container}>
                <SectionHeader
                    label="Things To Do"
                    title="Activities for Every Traveller"
                    subtitle="Filter cabins by the activities you love and make every moment an adventure."
                    highlightIndex={2}
                    className={layoutConfig.headerMargin}
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

export default ActivitiesSkeleton;
