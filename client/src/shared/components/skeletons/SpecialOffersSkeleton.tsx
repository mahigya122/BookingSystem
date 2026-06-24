import { layoutConfig, pageSpacing } from "@shared/utils/spacing";
import SectionHeader from "@shared/components/ui/SectionHeader";

const SpecialOffersSkeleton = () => {
    return (
        <section id="special-offers" className={`${pageSpacing.section} relative w-full`}>
            <div className={layoutConfig.container}>
                <SectionHeader
                    label="Our Best Offer"
                    title="Offers To Inspire You"
                    subtitle="Discover exclusive deals and special offers that will spark your wanderlust."
                    highlightIndex={2}
                    className={layoutConfig.headerMargin}
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:h-[400px]">
                    <div className="row-span-2 rounded-2xl md:rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse aspect-[4/5] md:aspect-auto" />
                    {[0, 1, 2, 3].map((_, idx) => (
                        <div
                            key={idx}
                            className={`rounded-2xl md:rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse ${idx >= 2 ? "hidden md:block" : ""} aspect-[4/3] md:aspect-auto`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SpecialOffersSkeleton;
