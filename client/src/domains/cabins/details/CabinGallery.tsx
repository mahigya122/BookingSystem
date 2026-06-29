import { ArrowLeft, MapPin, Tag } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getOptimizedImageUrl } from "@shared/utils/imageUtils";
import { useCabinFiltersContext } from "../contexts/CabinFiltersContext";
import { serializeFiltersToParams } from "../../../store/useCabinFilters";

interface CabinGalleryProps {
    cabin: {
        name: string;
        image_url: string;
        location?: {
            name: string;
            city?: string;
            country?: string;
        };
        offers?: any[];
    };
    activePhoto: string;
    galleryPhotos: string[];
    isLightboxOpen: boolean;
    onSelectPhoto: (photo: string) => void;
    onOpenLightbox: () => void;
    onCloseLightbox: () => void;
}

const CabinGallery = ({
    cabin,
    activePhoto,
    galleryPhotos,
    isLightboxOpen,
    onSelectPhoto,
    onOpenLightbox,
    onCloseLightbox,
}: CabinGalleryProps) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isFromBookings = searchParams.has("bookingId");
    const { appliedFilters, currentPage } = useCabinFiltersContext();

    const handleBackClick = () => {
        if (isFromBookings) {
            navigate("/bookings");
            return;
        }
        
        const queryParams = serializeFiltersToParams(appliedFilters, currentPage);
        queryParams.delete("page");
        const queryStr = queryParams.toString();
        
        const path = currentPage > 1 ? `/explorepage/page${currentPage}` : `/explorepage`;
        navigate(queryStr ? `${path}?${queryStr}` : path);
    };

    return (
        <div className="space-y-3">
            {/* HEADER BAR */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-0">
                <button
                    onClick={handleBackClick}
                    className="group inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors duration-300 cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4 stroke-[2.5] group-hover:-translate-x-1 transition-transform duration-300" />
                    <span>{isFromBookings ? "Back to My Bookings" : "Back to Stays"}</span>
                </button>

                <div className="flex items-center gap-2.5 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-450 bg-sky-50/50 dark:bg-sky-950/20 px-4 py-2.5 rounded-2xl border border-sky-100/50 dark:border-sky-900/20 cursor-default">
                    <MapPin className="h-4 w-4 text-sky-500 shrink-0 animate-pulse-slow" />
                    <span>
                        {cabin.location ? `${cabin.location.city || cabin.location.name}, ${cabin.location.country || ""}` : "Private Location"}
                    </span>
                </div>
            </div>

            {/* AIRBNB-STYLE GALLERY */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 h-auto md:h-[560px]">
                {/* Main image */}
                <div className="col-span-3 md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden relative group h-[240px] md:h-full">
                    {(() => {
                        const totalDiscountPercent = cabin.offers
                            ? cabin.offers.reduce((sum: number, offer: any) => sum + (offer.discount_percent ?? offer.discount_pct ?? 0), 0)
                            : 0;
                        if (totalDiscountPercent <= 0) return null;
                        return (
                            <div className="absolute top-4 left-4 z-10">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/95 dark:bg-emerald-600/95 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md backdrop-blur-sm pointer-events-none">
                                    <Tag className="h-3.5 w-3.5" />
                                    <span>{totalDiscountPercent}% off</span>
                                </div>
                            </div>
                        );
                    })()}
                    <img
                        src={getOptimizedImageUrl(activePhoto, 'hero')}
                        alt={cabin.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer"
                        onClick={onOpenLightbox}
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&q=80";
                        }}
                    />
                </div>

                {/* Small images */}
                {galleryPhotos.slice(1, 5).map((photo, i) => (
                    <div
                        key={i}
                        className={`rounded-2xl overflow-hidden relative group cursor-pointer h-[80px] md:h-full ${
                            i === 3 ? "hidden md:block" : "col-span-1"
                        }`}
                        onClick={() => onSelectPhoto(photo)}
                    >
                        <img
                            src={getOptimizedImageUrl(photo, 'card')}
                            alt={`Gallery ${i + 2}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=600&q=80";
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* LIGHTBOX */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
                    <button
                        onClick={onCloseLightbox}
                        className="absolute top-6 right-6 text-white hover:text-slate-300 font-extrabold text-3xl cursor-pointer"
                    >
                        ×
                    </button>
                    <img
                        src={getOptimizedImageUrl(activePhoto, 'full')}
                        alt="Gallery high definition"
                        className="max-h-full max-w-full rounded-2xl object-contain animate-zoom-in"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=1200&q=80";
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default CabinGallery;
