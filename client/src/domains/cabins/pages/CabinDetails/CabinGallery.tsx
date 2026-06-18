import { ArrowLeft, MapPin } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface CabinGalleryProps {
    cabin: {
        name: string;
        image_url: string;
        location?: {
            name: string;
            city?: string;
            country?: string;
        };
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

    return (
        <>
            {/* HEADER BAR */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                    onClick={() => navigate(isFromBookings ? "/bookings" : "/")}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 px-5 py-2.5 text-sm font-black text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition duration-300 active:scale-95 cursor-pointer"
                >
                    <ArrowLeft className="h-4.5 w-4.5 text-sky-500 stroke-[2.5]" />
                    <span>{isFromBookings ? "Back to My Bookings" : "Back to Stays"}</span>
                </button>

                <div className="flex items-center gap-2 text-sm text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl">
                    <MapPin className="h-4 w-4 text-sky-500" /> {cabin.location ? `${cabin.location.city || cabin.location.name}, ${cabin.location.country || ""}` : "Private Location"}
                </div>
            </div>

            {/* AIRBNB-STYLE GALLERY */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[560px]">
                {/* Main image */}
                <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden relative group">
                    <img
                        src={activePhoto}
                        alt={cabin.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer"
                        onClick={onOpenLightbox}
                    />
                </div>

                {/* Small images */}
                {galleryPhotos.slice(1, 5).map((photo, i) => (
                    <div
                        key={i}
                        className="rounded-2xl overflow-hidden relative group cursor-pointer"
                        onClick={() => onSelectPhoto(photo)}
                    >
                        <img
                            src={photo}
                            alt={`Gallery ${i + 2}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
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
                        src={activePhoto}
                        alt="Gallery high definition"
                        className="max-h-full max-w-full rounded-2xl object-contain animate-zoom-in"
                    />
                </div>
            )}
        </>
    );
};

export default CabinGallery;
