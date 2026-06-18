import { useMemo } from "react";
import { useOffers } from "@shared/hooks/useOffers";
import { useCabinFiltersContext } from "../../../contexts/CabinFiltersContext";
import { motion } from "framer-motion";
import { layoutConfig } from "@shared/utils/spacing";
import SectionHeader from "@shared/components/ui/SectionHeader";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const SpecialOffers = () => {
    const { offers = [], isLoading } = useOffers();
    const { filters, setFilters, applyFilters } = useCabinFiltersContext();

    const uniqueOffers = useMemo(() => {
        const seen = new Set();
        return offers.filter(offer => {
            const title = offer.title || (offer as any).name;
            if (seen.has(title)) return false;
            seen.add(title);
            return true;
        });
    }, [offers]);

    if (isLoading || uniqueOffers.length === 0) return null;

    const fallbackImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80";

    const handleOfferClick = (offId: string) => {
        const newFilters = {
            ...filters,
            offer_id: filters.offer_id === offId ? null : offId
        };
        setFilters(newFilters);
        applyFilters(newFilters);
    };

    return (
        <section id="special-offers" className="py-[52px] md:py-[56px] lg:py-[60px] relative w-full">
            <div className={layoutConfig.container}>
                <SectionHeader
                    label="Our Best Offer"
                    title="Offers To Inspire You"
                    subtitle="Discover exclusive deals and special offers that will spark your wanderlust."
                    highlightIndex={2}
                    className={layoutConfig.headerMargin}
                />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:h-[400px]">
                {/* Tall left card - Featured Offer */}
                {uniqueOffers[0] && (() => {
                    const offer = uniqueOffers[0];
                    const isSelected = filters.offer_id === offer.id;
                    const offerTitle = offer.title || (offer as any).name;
                    return (
                        <motion.div 
                            onClick={() => handleOfferClick(offer.id)}
                            className={`row-span-2 group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-400 aspect-[4/5] md:aspect-auto ${
                                isSelected ? "ring-4 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900" : ""
                            }`}
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.7,
                                ease: EASE,
                            }}
                            viewport={{ once: true }}
                        >
                            <img src={offer.image_url || fallbackImage} alt={offerTitle} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full space-y-1 md:space-y-2">
                                <div className="inline-flex items-center px-2 py-0.5 md:py-1 rounded-lg bg-sky-500 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                                    Save {offer.discount_percent || (offer as any).discount_pct}%
                                </div>
                                <h3 className="text-white font-black text-base md:text-lg leading-tight">{offerTitle}</h3>
                                <p className="text-white/70 text-[9px] md:text-[10px] line-clamp-2">{offer.description}</p>
                                {isSelected && (
                                    <span className="block w-fit bg-white text-sky-600 font-black text-[8px] md:text-[9px] uppercase tracking-widest px-2 py-0.5 md:px-2.5 md:py-1 rounded-full shadow-lg mt-1 md:mt-2">Active</span>
                                )}
                            </div>
                        </motion.div>
                    );
                })()}
                
                {/* Other cards */}
                {uniqueOffers.slice(1, 5).map((offer, idx) => {
                    const isSelected = filters.offer_id === offer.id;
                    const offerTitle = offer.title || (offer as any).name;
                    
                    return (
                        <motion.div 
                            key={offer.id} 
                            onClick={() => handleOfferClick(offer.id)}
                            className={`group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-400 ${
                                isSelected ? "ring-4 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900" : ""
                            } ${idx >= 2 ? "hidden md:block" : ""}`}
                            initial={{
                                opacity: 0,
                                y: 25,
                                scale: 0.98,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            transition={{
                                duration: 0.65,
                                delay: idx * 0.08,
                                ease: EASE,
                            }}
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            <img src={offer.image_url || fallbackImage} alt={offerTitle} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 p-3 md:p-4 w-full flex items-end justify-between">
                                <div>
                                    <p className="text-white font-black text-[10px] md:text-xs leading-tight">{offerTitle}</p>
                                    <p className="text-sky-400 text-[8px] md:text-[10px] font-black uppercase">-{offer.discount_percent || (offer as any).discount_pct}%</p>
                                </div>
                                {isSelected && (
                                    <span className="bg-sky-500 text-white font-black text-[7px] md:text-[8px] uppercase tracking-widest px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full shadow-lg">Active</span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            </div>
        </section>
    );
};

export default SpecialOffers;
