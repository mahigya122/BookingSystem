import { useState } from "react";
import type { Cabin } from "@shared/types/cabin";
import type { Booking } from "@shared/types/booking";
import type { CabinDetailSection } from "./CabinRow";
import { getOptimizedImageUrl } from "@shared/utils/imageUtils";
import {
    Globe,
    MapPin,
    Star,
    Tag,
    Sparkles,
    LayoutDashboard,
    X,
    Calendar,
    User,
    Info,
    ChevronRight,
    TrendingUp,
    DollarSign
} from "lucide-react";

interface Props {
    cabin: Cabin;
    activeBooking: Booking | null;
    initialSection?: CabinDetailSection;
    onClose: () => void;
}

const CabinDetailModal = ({
    cabin,
    activeBooking,
    initialSection = "overview",
    onClose,
}: Props) => {
    const [activeTab, setActiveTab] = useState<CabinDetailSection>(initialSection);
    const isBooked = Boolean(activeBooking);

    const reviewCount = cabin.reviews?.length || 0;
    const avgRating = reviewCount > 0
        ? (cabin.reviews!.reduce((acc, review) => acc + review.rating, 0) / reviewCount).toFixed(1)
        : "N/A";

    const tabs: { id: CabinDetailSection; label: string; icon: React.ElementType }[] = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "location", label: "Location", icon: MapPin },
        { id: "offers", label: "Offers", icon: Tag },
        { id: "activities", label: "Activities", icon: Sparkles },
        { id: "reviews", label: "Reviews", icon: Star },
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">

                {/* HEADER SECTION */}
                <div className="relative h-48 flex-shrink-0">
                    <img
                        src={getOptimizedImageUrl(cabin.image_url, 'hero')}
                        alt={cabin.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                    <div className="absolute top-6 right-6 flex gap-2">
                        <button
                            onClick={onClose}
                            className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center text-white transition-all border border-white/20"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <span className={`badge ${isBooked ? "badge-danger" : "badge-success"} border-none shadow-lg`}>
                                    {isBooked ? "Currently Occupied" : "Available Now"}
                                </span>
                                <span className="badge bg-white/20 text-white border-none backdrop-blur-md">
                                    {cabin.capacity} Guest Capacity
                                </span>
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tight">{cabin.name}</h2>
                        </div>

                        <div className="text-right">
                            <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-1">Standard Rate</p>
                            <div className="flex items-center gap-1 text-white">
                                <span className="text-3xl font-black">${cabin.price_per_night}</span>
                                <span className="text-sm font-bold opacity-70">/ night</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABS NAVIGATION */}
                <div className="flex items-center gap-1 px-8 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex-shrink-0 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id
                                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {tab.id === "reviews" && reviewCount > 0 && (
                                <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === tab.id ? "bg-white/20" : "bg-slate-100 dark:bg-slate-800"}`}>
                                    {reviewCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30 dark:bg-slate-950/30">

                    {/* OVERVIEW TAB */}
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="lg:col-span-2 space-y-8">
                                <section className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Info className="text-sky-500" size={20} />
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white">Unit Description</h3>
                                    </div>
                                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        {cabin.description || "No detailed description provided for this luxury unit."}
                                    </p>
                                </section>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="surface-panel p-6 rounded-3xl group hover:border-sky-500/30 transition-all">
                                        <div className="h-10 w-10 rounded-2xl bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center text-sky-500 mb-4 group-hover:scale-110 transition-transform">
                                            <TrendingUp size={20} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Net Growth</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">Premium Unit</p>
                                    </div>
                                    <div className="surface-panel p-6 rounded-3xl group hover:border-emerald-500/30 transition-all">
                                        <div className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                                            <DollarSign size={20} />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Discount Logic</p>
                                        <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{cabin.discount}% Reduction</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="surface-panel-strong p-6 rounded-[2rem] border-sky-100/50 dark:border-sky-900/20">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Active Booking</h3>
                                        <div className={`h-2.5 w-2.5 rounded-full ${isBooked ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
                                    </div>

                                    {isBooked && activeBooking ? (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                    <User size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 dark:text-white">{activeBooking.guests?.full_name}</p>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate max-w-[120px]">
                                                        {activeBooking.guests?.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-bold text-slate-400 uppercase tracking-widest">Check In</span>
                                                    <span className="font-black text-slate-900 dark:text-white">{new Date(activeBooking.start_date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="font-bold text-slate-400 uppercase tracking-widest">Check Out</span>
                                                    <span className="font-black text-slate-900 dark:text-white">{new Date(activeBooking.end_date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs pt-2">
                                                    <span className="font-bold text-slate-400 uppercase tracking-widest">Total Stay</span>
                                                    <span className="badge badge-primary">
                                                        {Math.ceil((new Date(activeBooking.end_date).getTime() - new Date(activeBooking.start_date).getTime()) / (1000 * 60 * 60 * 24))} Nights
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8 text-center space-y-3">
                                            <div className="h-16 w-16 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500 mx-auto">
                                                <Calendar size={28} />
                                            </div>
                                            <p className="text-sm font-bold text-slate-500">Ready for new reservations</p>
                                            <button className="btn-action btn-action-primary w-full">Quick Book</button>
                                        </div>
                                    )}
                                </div>

                                <div className="surface-panel p-6 rounded-[2rem] space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Guest Rating</span>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star size={14} className="fill-amber-500" />
                                            <span className="text-sm font-black">{avgRating}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-amber-500 h-full rounded-full"
                                            style={{ width: `${(Number(avgRating) || 0) * 20}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* LOCATION TAB */}
                    {activeTab === "location" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {cabin.location ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{cabin.location.name}</h3>
                                            <div className="flex items-center gap-2 mt-2 text-sky-500">
                                                <MapPin size={18} />
                                                <p className="text-sm font-bold uppercase tracking-widest">
                                                    {cabin.location.city}, {cabin.location.country}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                            {cabin.location.description || "This prime location offers unique advantages for resort guests."}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="surface-panel p-4 rounded-2xl">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Region Type</p>
                                                <p className="text-sm font-black text-slate-900 dark:text-white">Premium Zone</p>
                                            </div>
                                            <div className="surface-panel p-4 rounded-2xl">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Access</p>
                                                <p className="text-sm font-black text-slate-900 dark:text-white">Gate 4 Restricted</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                                        <div className="relative surface-panel rounded-[2rem] overflow-hidden aspect-video">
                                            {cabin.location.image_url ? (
                                                <img
                                                    src={getOptimizedImageUrl(cabin.location.image_url, 'featured')}
                                                    alt={cabin.location.name}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="h-full grid place-items-center text-slate-400">
                                                    <Globe size={48} className="opacity-20" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 text-center space-y-4 surface-panel rounded-[2rem]">
                                    <Globe size={48} className="mx-auto text-slate-200" />
                                    <p className="text-slate-500 font-bold">No geographic location linked to this cabin.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* OFFERS TAB */}
                    {activeTab === "offers" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Promotional Packages</h3>
                                <span className="badge badge-primary">{cabin.offers?.length || 0} Active</span>
                            </div>

                            {cabin.offers && cabin.offers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {cabin.offers.map((offer) => (
                                        <div key={offer.id} className="surface-panel rounded-3xl p-6 group hover:border-emerald-500/30 transition-all relative overflow-hidden">
                                            <div className="absolute top-0 right-0 h-24 w-24 -mr-8 -mt-8 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-500">
                                                    <Tag size={20} />
                                                </div>
                                                <span className="text-2xl font-black text-emerald-500">{(offer.discount_percent ?? offer.discount_pct ?? 0)}% OFF</span>
                                            </div>
                                            <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">{offer.title || offer.name || "Special Offer"}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                                {offer.description || "Limited time promotional offer available for this unit."}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center space-y-4 surface-panel rounded-[2rem]">
                                    <Tag size={48} className="mx-auto text-slate-200" />
                                    <p className="text-slate-500 font-bold">No active offers for this cabin.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ACTIVITIES TAB */}
                    {activeTab === "activities" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Experiences & Activities</h3>
                                <span className="badge badge-secondary">{cabin.activities?.length || 0} Included</span>
                            </div>

                            {cabin.activities && cabin.activities.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {cabin.activities.map((activity) => (
                                        <div key={activity.id} className="surface-panel rounded-3xl overflow-hidden group hover:border-cyan-500/30 transition-all">
                                            <div className="h-40 relative">
                                                {activity.image_url ? (
                                                    <img src={getOptimizedImageUrl(activity.image_url, 'card')} alt={activity.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                                ) : (
                                                    <div className="h-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                                                        <Sparkles size={32} />
                                                    </div>
                                                )}
                                                <div className="absolute bottom-4 left-4">
                                                    <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">
                                                        ${activity.price || "Complimentary"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-5 space-y-2">
                                                <h4 className="font-black text-slate-900 dark:text-white">{activity.name}</h4>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-2">
                                                    {activity.description || "Engaging resort activity perfect for unit guests."}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center space-y-4 surface-panel rounded-[2rem]">
                                    <Sparkles size={48} className="mx-auto text-slate-200" />
                                    <p className="text-slate-500 font-bold">No connected activities for this cabin.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* REVIEWS TAB */}
                    {activeTab === "reviews" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Guest Feedback</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} size={14} className={i < Math.round(Number(avgRating) || 0) ? "text-amber-400 fill-amber-400" : "text-slate-200"} />
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">{avgRating} Avg Rating</span>
                                    </div>
                                </div>
                            </div>

                            {cabin.reviews && cabin.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {cabin.reviews.map((review) => (
                                        <div key={review.id} className="surface-panel p-6 rounded-[2rem] flex gap-6 items-start">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-400 text-lg flex-shrink-0">
                                                {review.guest?.full_name?.charAt(0) || "G"}
                                            </div>
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-black text-slate-900 dark:text-white">{review.guest?.full_name || "Anonymous Guest"}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Verified Reservation</p>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
                                                        <Star size={12} className="fill-amber-500 text-amber-500" />
                                                        <span className="text-xs font-black text-amber-700 dark:text-amber-400">{review.rating}</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                                    "{review.comment || "No comment provided."}"
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center space-y-4 surface-panel rounded-[2rem]">
                                    <Star size={48} className="mx-auto text-slate-200" />
                                    <p className="text-slate-500 font-bold">No guest reviews yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                <div className="px-8 py-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Section</span>
                            <ChevronRight size={14} className="text-slate-300" />
                            <span className="text-xs font-black uppercase tracking-widest text-sky-500">{activeTab}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="btn btn-secondary px-8">
                        Done Viewing
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CabinDetailModal;

