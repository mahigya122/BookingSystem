import { useMemo } from "react";
import { useOffers } from "@shared/hooks/useOffers";
import { useCabinFiltersContext } from "../../../contexts/CabinFiltersContext";

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

    const styles = [
        { bg: "bg-sky-400", dot: "bg-sky-300/60" },
        { bg: "bg-orange-400", dot: "bg-orange-300/60" },
        { bg: "bg-emerald-400", dot: "bg-emerald-300/60" },
        { bg: "bg-violet-400", dot: "bg-violet-300/60" },
    ];

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
        <section className="space-y-10">
            <div className="text-center space-y-2">
                <p className="text-sky-400 text-xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    Our Best Offer
                </p>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white">Offers To Inspire You</h2>
                <p className="text-slate-400 max-w-lg mx-auto text-sm">
                    Discover exclusive deals and special offers that will spark your wanderlust. From discounted rates to limited-time promotions.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {uniqueOffers.slice(0, 4).map((offer, index) => {
                    const style = styles[index % styles.length];
                    const isSelected = filters.offer_id === offer.id;
                    const offerTitle = offer.title || (offer as any).name;
                    return (
                        <div
                            key={offer.id}
                            onClick={() => handleOfferClick(offer.id)}
                            className={`relative overflow-hidden rounded-3xl ${style.bg} min-h-64 flex items-end cursor-pointer group hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ${
                                isSelected ? "ring-4 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900" : ""
                            }`}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-white/15" />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-white/10" />

                            <img
                                src={offer.image_url || fallbackImage}
                                alt={offerTitle}
                                className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-80 mix-blend-overlay"
                            />
                            <img
                                src={offer.image_url || fallbackImage}
                                alt={offerTitle}
                                className="absolute right-4 top-4 bottom-4 w-52 object-cover rounded-2xl shadow-xl border-4 border-white/20"
                            />

                            <div className="relative z-10 p-8 space-y-2 max-w-[55%]">
                                <p className="text-white/80 text-sm font-bold italic">Save {offer.discount_percent || (offer as any).discount_pct}%</p>
                                <h3 className="text-3xl font-black text-white leading-tight">{offerTitle}</h3>
                                <p className="text-white/70 text-sm line-clamp-2">{offer.description}</p>
                                <button className="mt-4 rounded-full bg-slate-900 text-white text-xs font-bold px-6 py-2.5 hover:bg-slate-700 transition-colors duration-200 group-hover:scale-105 transition-transform">
                                    {isSelected ? "Active Filter" : "Filter Cabins"}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Premium full-width offer fallback if we have more than 4 */}
            {uniqueOffers.length > 4 && (() => {
                const offer = uniqueOffers[4];
                const isSelected = filters.offer_id === offer.id;
                const offerTitle = offer.title || (offer as any).name;
                return (
                    <div 
                        onClick={() => handleOfferClick(offer.id)}
                        className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-500 to-indigo-600 min-h-40 flex items-center px-10 cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ${
                            isSelected ? "ring-4 ring-sky-500 ring-offset-2 dark:ring-offset-slate-900" : ""
                        }`}
                    >
                        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[length:16px_16px]" />
                        <img
                            src={offer.image_url || fallbackImage}
                            alt={offerTitle}
                            className="absolute right-16 top-0 bottom-0 w-64 object-cover opacity-50 rounded-2xl my-4"
                        />
                        <div className="relative z-10 space-y-1">
                            <p className="text-violet-200 text-sm font-bold italic">Premium Perk</p>
                            <h3 className="text-3xl font-black text-white">{offerTitle} — Special Access</h3>
                            <p className="text-white/60 text-sm">{offer.description}</p>
                            <button className="mt-3 rounded-full bg-white text-violet-700 text-xs font-bold px-6 py-2.5 hover:bg-violet-50 transition-colors duration-200">
                                {isSelected ? "Active Filter" : "Filter Cabins"}
                            </button>
                        </div>
                    </div>
                );
            })()}
        </section>
    );
};

export default SpecialOffers;