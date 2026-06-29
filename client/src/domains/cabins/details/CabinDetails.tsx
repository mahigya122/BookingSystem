/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo, Suspense } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useUser, useCreateBooking, useCabins, useUpdateBooking, useBookings } from "@shared/hooks";
import type { Cabin, Activity, Offer } from "@shared/types";
import { useProfile } from "../../../hooks/useProfile";
import { useCabin } from "../hooks/useCabin";
import { useCabinAvailability } from "../hooks/useCabinAvailability";
import { useCabinFiltersContext } from "../contexts/CabinFiltersContext";
import { usePayment } from "../../payments/usePayment";
import { getBookingRealStatus } from "@shared/utils/bookingUtils";
import toast from "react-hot-toast";
import { Check, Compass, ArrowLeft, Star, MapPin, Calendar } from "lucide-react";

import CabinGallery from "./CabinGallery";
import CabinAmenities from "./CabinAmenities";
import CabinCalendar from "../../../shared/components/ui/CabinCalendar";
import CabinLocation from "./CabinLocation";
import CabinReviews from "./CabinReviews";
import BookingCard from "./BookingCard";
import RecentlyViewed from "./RecentlyViewed";
import { CheckoutModal, ProfileIncompleteModal } from "@shared/modals/lazyModals";
import ModalSpinner from "@shared/components/ui/ModalSpinner";
import { supabase } from "@shared/services/supabase";

// Format date to YYYY-MM-DD string in local timezone
const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// Parse YYYY-MM-DD string into a local Date object
const parseDateString = (str: string) => {
    const [year, month, day] = str.split("-").map(Number);
    return new Date(year, month - 1, day);
};

// Calculate difference in days between two dates
const getDaysDiff = (start: Date, end: Date) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((end.getTime() - start.getTime()) / oneDay));
};

const CabinDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get("bookingId");

    const { data: cabin, isLoading: loadingCabin } = useCabin(id);
    const { availability, isLoading: loadingAvailability } = useCabinAvailability(id);
    const { cabins = [], isLoading: loadingAllCabins } = useCabins();
    const { bookings: allBookings = [] } = useBookings();

    const { user } = useUser();
    const { fullName, phone, loading: loadingProfile } = useProfile();
    const { filters, setFilters } = useCabinFiltersContext();
    const { createBooking, isPending: isBookingPending } = useCreateBooking();
    const { editBooking } = useUpdateBooking();
    const { payNow } = usePayment("");

    const existingBooking = useMemo(() => {
        if (!bookingId || !allBookings.length) return null;
        return allBookings.find(b => b.id === bookingId);
    }, [bookingId, allBookings]);

    const isUpdateMode = !!existingBooking;

    // UI state
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());



    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isProfileIncompleteModalOpen, setIsProfileIncompleteModalOpen] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState<"activities" | "summary" | "payment">("summary");
    const [paymentMethod, setPaymentMethod] = useState<string>("");

    // Calendar date state (synced from context or existing booking)
    const [startDate, setStartDate] = useState<Date | null>(() => {
        if (existingBooking) return parseDateString(existingBooking.start_date);
        return filters?.dateRange?.startDate ? new Date(filters.dateRange.startDate) : null
    });
    const [endDate, setEndDate] = useState<Date | null>(() => {
        if (existingBooking) return parseDateString(existingBooking.end_date);
        return filters?.dateRange?.endDate ? new Date(filters.dateRange.endDate) : null
    });

   const [clientId] = useState(() => Math.random().toString(36).substring(2, 15));
const [otherSelections, setOtherSelections] = useState<Set<string>>(new Set());

// Supabase Realtime Presence: track and sync date selections across active clients
useEffect(() => {
    if (!cabin?.id) return;

    const channel = supabase.channel(`cabin-selections:${cabin.id}`);

    channel
        .on("presence", { event: "sync" }, () => {
            const state = channel.presenceState();
            const dates = new Set<string>();
            let conflictFound = false;

            Object.values(state).forEach((presenceInfo: any) => {
                presenceInfo.forEach((presence: any) => {
                    if (presence.clientId === clientId) return;
                    if (presence.startDate) {
                        const start = parseDateString(presence.startDate);
                        const end = presence.endDate ? parseDateString(presence.endDate) : start;
                        const temp = new Date(start);
                        while (temp <= end) {
                            dates.add(formatDateString(temp));
                            temp.setDate(temp.getDate() + 1);
                        }

                        // Conflict check against our local selection
                        if (startDate && endDate) {
                            const myStart = new Date(startDate);
                            const myEnd = new Date(endDate);
                            if (start <= myEnd && end >= myStart) {
                                conflictFound = true;
                            }
                        }
                    }
                });
            });

            setOtherSelections(dates);
            if (conflictFound) {
                toast.error("Conflict: Someone else selected this date! Please choose a new date.");
                setStartDate(null);
                setEndDate(null);
            }
        })
        .subscribe(async (status) => {
            if (status === "SUBSCRIBED") {
                await channel.track({
                    clientId,
                    startDate: startDate ? formatDateString(startDate) : null,
                    endDate: endDate ? formatDateString(endDate) : null,
                });
            }
        });

    return () => {
        supabase.removeChannel(channel);
    };
}, [cabin?.id, clientId, startDate, endDate]);

    const [breakfast, setBreakfast] = useState(existingBooking?.has_breakfast || false);

    const [selectedOffers, setSelectedOffers] = useState<Offer[]>(() => {
        if (existingBooking?.extra_offers) {
            return typeof existingBooking.extra_offers === "string"
                ? JSON.parse(existingBooking.extra_offers)
                : existingBooking.extra_offers;
        }
        return [];
    });
    const [selectedActivities, setSelectedActivities] = useState<Activity[]>(() => {
        if (existingBooking?.extra_activities) {
            return typeof existingBooking.extra_activities === "string"
                ? JSON.parse(existingBooking.extra_activities)
                : existingBooking.extra_activities;
        }
        return [];
    });

    useEffect(() => {
        if (isUpdateMode) return;
        if (startDate && endDate && cabin?.offers) {
            setSelectedOffers(cabin.offers);
        } else {
            setSelectedOffers([]);
        }
    }, [startDate, endDate, cabin?.offers, isUpdateMode]);

    const hasFreeBreakfastOffer = useMemo(() => {
        return selectedOffers.some((offer) => {
            const nameMatch = (offer.name || offer.title || "").toLowerCase().includes("breakfast");
            const descMatch = (offer.description || "").toLowerCase().includes("breakfast");
            return nameMatch || descMatch;
        });
    }, [selectedOffers]);

    useEffect(() => {
        if (hasFreeBreakfastOffer) {
            setBreakfast(false);
        }
    }, [hasFreeBreakfastOffer]);

    const cabinHasFreeBreakfast = useMemo(() => {
        return cabin?.offers?.some(offer => {
            const nameMatch = (offer.name || offer.title || "").toLowerCase().includes("breakfast");
            const descMatch = (offer.description || "").toLowerCase().includes("breakfast");
            return nameMatch || descMatch;
        }) || false;
    }, [cabin?.offers]);

    const handleToggleActivity = (activity: Activity) => {
        setSelectedActivities(prev => {
            const exists = prev.some(act => act.id === activity.id);
            if (exists) {
                return prev.filter(act => act.id !== activity.id);
            } else {
                return [...prev, activity];
            }
        });
    };

    // --- PRICING ---
    const todayStr = formatDateString(new Date());
    const totalNights = startDate && endDate ? getDaysDiff(startDate, endDate) : 0;
    const baseAccommodationPrice = totalNights * (cabin?.price_per_night || 0);
    const breakfastPricePerNight = 15;
    const breakfastTotal = breakfast ? totalNights * breakfastPricePerNight * (filters.capacity || 1) : 0;

    const activitiesTotal = useMemo(() => {
        return selectedActivities.reduce((sum, act) => sum + (act.price || 0), 0);
    }, [selectedActivities]);

    const discountFromOffers = useMemo(() => {
        const totalDiscountPercent = selectedOffers.reduce((sum, offer) => sum + (offer.discount_percent || 0), 0);
        return baseAccommodationPrice * (totalDiscountPercent / 100);
    }, [selectedOffers, baseAccommodationPrice]);

    const cleaningFee = totalNights > 0 ? 50 : 0;
    const serviceTax = totalNights > 0 ? 20 : 0;
    const totalPrice = Math.max(0, baseAccommodationPrice - discountFromOffers + breakfastTotal + activitiesTotal + cleaningFee + serviceTax);

    // Sync breakfast when entering update mode
    useEffect(() => {
        if (existingBooking && !isConfirmModalOpen) {
            setBreakfast(existingBooking.has_breakfast);
            setPaymentMethod(existingBooking.payment_method || "");
        }
    }, [existingBooking, isConfirmModalOpen]);

    const isBookedByOthers = useMemo(() => {
        if (!availability?.bookings || !startDate || !endDate) return false;
        return availability.bookings.some((booking) => {
            if (booking.status === "cancelled") return false;
            // If updating, ignore the booking we are currently editing
            if (isUpdateMode && booking.id === bookingId) return false;

            // Check if it's booked by someone else
            const isOthers = !user || booking.guest_id !== user.id;
            if (!isOthers) return false;

            const bStart = parseDateString(booking.start_date);
            const bEnd = parseDateString(booking.end_date);
            return startDate < bEnd && endDate > bStart;
        });
    }, [availability, startDate, endDate, user, isUpdateMode, bookingId]);

    // --- BOOKING STATE LOGIC ---
    // Find all bookings for this user for this cabin
    const userBookings = useMemo(() => {
        if (!user || !availability?.bookings) return [];
        return availability.bookings.filter(b => b.guest_id === user.id);
    }, [user, availability]);

    // Priority 1: Current Active or Future Booking (for updating/status display)
    const activeBooking = useMemo(() => {
        return userBookings.find(b => {
            const realStatus = getBookingRealStatus(b);
            return realStatus === "booked" || realStatus === "checked-in";
        });
    }, [userBookings]);

    // Priority 2: Most recent past/cancelled booking (for "Book Again" and Reviews)
    const recentPastBooking = useMemo(() => {
        const past = userBookings.filter(b => {
            const realStatus = getBookingRealStatus(b);
            return realStatus === "checked-out" || realStatus === "cancelled";
        });
        if (past.length === 0) return null;
        // Sort by end date descending
        return past.sort((a, b) => b.end_date.localeCompare(a.end_date))[0];
    }, [userBookings]);

    const userBookingStatus = activeBooking ? getBookingRealStatus(activeBooking) : (recentPastBooking ? getBookingRealStatus(recentPastBooking) : undefined);

    const handleScrollToCalendar = () => {
        document.getElementById("selection-theatre")?.scrollIntoView({ behavior: "smooth" });
    };

    // Track recently viewed
    useEffect(() => {
        if (!id || !cabin) return;
        const viewed = localStorage.getItem("recently-viewed-cabins");
        let list: string[] = viewed ? JSON.parse(viewed) : [];
        list = list.filter((item) => item !== id);
        list.unshift(id);
        list = list.slice(0, 4);
        localStorage.setItem("recently-viewed-cabins", JSON.stringify(list));
    }, [id, cabin]);

    const recentlyViewed = useMemo(() => {
        const viewed = localStorage.getItem("recently-viewed-cabins");
        if (!viewed) return [];
        const list: string[] = JSON.parse(viewed);
        return (cabins as Cabin[]).filter((c) => list.includes(c.id) && c.id !== id);
    }, [cabins, id]);



    const isLoading = loadingCabin || loadingAvailability || loadingAllCabins || loadingProfile;

    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        if (isLoading) return;

        const timer = setTimeout(() => {
            setShouldAnimate(true);
        }, 600);

        const removeTimer = setTimeout(() => {
            setShouldAnimate(false);
        }, 2600);

        return () => {
            clearTimeout(timer);
            clearTimeout(removeTimer);
        };
    }, [isLoading]);

    if (isLoading) {
        return (
            <div className="max-w-[1600px] mx-auto px-4 md:px-12 lg:px-16 pt-2 md:pt-2 space-y-8 md:space-y-12 lg:space-y-16 pb-6 animate-fade-in">
                {/* Gallery + header bar skeleton */}
                <div className="space-y-3">
                    {/* Header bar skeleton */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-0">
                        <button
                            disabled
                            className="group inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-300 dark:text-slate-700 cursor-not-allowed"
                        >
                            <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
                            <span>Back to Stays</span>
                        </button>

                        <div className="flex items-center gap-2.5 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400 bg-slate-50/50 dark:bg-slate-950/20 px-4 py-2.5 rounded-2xl border border-slate-100/50 dark:border-slate-900/20 cursor-default">
                            <MapPin className="h-4 w-4 text-slate-350 shrink-0" />
                            <div className="h-3.5 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Image Grid skeleton (matching 5-photo layout) */}
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 h-auto md:h-[560px]">
                        {/* Main Image */}
                        <div className="col-span-3 md:col-span-2 md:row-span-2 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse h-[240px] md:h-full" />
                        {/* 4 Small Images */}
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className={`rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse h-[80px] md:h-full ${i === 3 ? "hidden md:block" : "col-span-1"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Cabin title + meta skeleton */}
                <div>
                    <div className="flex flex-row items-center justify-between gap-4">
                        <h1 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight flex-1 min-w-0">
                            <span className="inline-block h-[1em] w-2/3 md:w-1/2 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse align-middle" />
                        </h1>
                        <div className="md:hidden h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse shrink-0" />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Star className="h-4 w-4 fill-amber-400/40 text-amber-400/40 animate-pulse" />
                            <span className="inline-block h-3.5 w-12 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        </div>
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span className="inline-block h-3.5 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <span className="inline-block h-3.5 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    </div>
                </div>

                {/* Main content split skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 items-start">
                    {/* LEFT: description + sections */}
                    <div className="lg:col-span-2 space-y-6 md:space-y-8 lg:space-y-8">
                        <div className="space-y-6">
                            {/* About Retreat */}
                            <div className="space-y-3">
                                <h2 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white mt-1">
                                    About
                                </h2>
                                <div className="space-y-4 pt-2">
                                    <div className="h-[1.125rem] w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                    <div className="h-[1.125rem] w-full rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                    <div className="h-[1.125rem] w-5/6 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                    <div className="h-[1.125rem] w-4/6 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                </div>
                            </div>

                            {/* Amenities & features skeleton */}
                            <div className="space-y-6 border-t border-slate-100 dark:border-slate-800/80 pt-6">
                                <div className="space-y-6">
                                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-450 dark:text-slate-500">
                                        Amenities
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="h-14 rounded-2xl bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100/50 dark:border-slate-800/20 animate-pulse" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Calendar Skeleton */}
                        <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/80 pt-6">
                            <div>
                                <h2 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                    Selection Theatre
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">
                                    Select your stay dates like choosing seats in a premium cinema.
                                </p>
                            </div>
                            <div className="h-[550px] sm:h-[600px] rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 p-4 sm:p-8 animate-pulse w-full" />
                        </div>

                        {/* Reviews Skeleton */}
                        <div className="space-y-6 border-t border-slate-100 dark:border-slate-800/80 pt-6">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
                                        Reviews & Feedback
                                    </h2>
                                    <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-600">
                                        <Star className="h-5 w-5 text-amber-400/40 fill-amber-400/40 animate-pulse" />
                                        <div className="h-4 w-8 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                        <span className="text-slate-300">·</span>
                                        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            {/* Rating bars skeleton */}
                            <div className="grid md:grid-cols-2 gap-4 text-sm font-bold text-slate-400 dark:text-slate-655">
                                {[
                                    "Cleanliness",
                                    "Communication",
                                    "Check-in",
                                    "Accuracy",
                                    "Location",
                                    "Value"
                                ].map((name) => (
                                    <div key={name} className="flex items-center justify-between gap-6 p-1">
                                        <span className="w-28 text-slate-400 dark:text-slate-600">{name}</span>
                                        <div className="flex-1 h-2 bg-slate-100/60 dark:bg-slate-800/40 rounded-full overflow-hidden">
                                            <div className="h-full bg-sky-500/30 rounded-full w-full animate-pulse" />
                                        </div>
                                        <div className="h-4 w-6 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                    </div>
                                ))}
                            </div>

                            {/* Review Cards skeleton */}
                            <div className="space-y-6 pt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                                        Guest Experiences
                                    </h3>
                                    <div className="flex gap-2 opacity-50">
                                        <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
                                        <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20 space-y-4 w-full">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                                    <div className="h-3 w-16 bg-slate-150 dark:bg-slate-800/60 rounded animate-pulse" />
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5 opacity-40">
                                                {[...Array(5)].map((_, idx) => (
                                                    <Star key={idx} className="h-4 w-4 text-slate-200 dark:text-slate-800 fill-slate-200 dark:fill-slate-800" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <div className="h-3.5 w-full bg-slate-155 dark:bg-slate-800/60 rounded animate-pulse" />
                                            <div className="h-3.5 w-5/6 bg-slate-155 dark:bg-slate-800/60 rounded animate-pulse" />
                                        </div>
                                    </div>
                                    <div className="hidden md:block p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20 space-y-4 w-full">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                                <div className="space-y-2">
                                                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                                    <div className="h-3 w-16 bg-slate-150 dark:bg-slate-800/60 rounded animate-pulse" />
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5 opacity-40">
                                                {[...Array(5)].map((_, idx) => (
                                                    <Star key={idx} className="h-4 w-4 text-slate-200 dark:text-slate-800 fill-slate-200 dark:fill-slate-800" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <div className="h-3.5 w-full bg-slate-155 dark:bg-slate-800/60 rounded animate-pulse" />
                                            <div className="h-3.5 w-5/6 bg-slate-155 dark:bg-slate-800/60 rounded animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: booking card + details skeleton */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Booking Card */}
                        <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="h-8 w-28 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                <div className="h-6 w-20 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
                            </div>

                            {/* Replicated Dates summary structure */}
                            <div className="rounded-xl border border-slate-150 dark:border-slate-800/80 overflow-hidden divide-y divide-slate-150 dark:divide-slate-800">
                                <div className="grid grid-cols-2 divide-x divide-slate-150 dark:divide-slate-800 text-xs font-black">
                                    <div className="p-3.5 space-y-2">
                                        <span className="text-slate-400 dark:text-slate-600 uppercase tracking-wider block">Check-in</span>
                                        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                    </div>
                                    <div className="p-3.5 space-y-2">
                                        <span className="text-slate-400 dark:text-slate-600 uppercase tracking-wider block">Check-out</span>
                                        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                    </div>
                                </div>
                                <div className="p-3.5 space-y-2">
                                    <span className="text-slate-400 dark:text-slate-600 text-xs font-black uppercase tracking-wider block">Guests</span>
                                    <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                </div>
                            </div>

                            {/* Replicated Breakfast toggle structure */}
                            {!cabinHasFreeBreakfast && (
                                <div className="flex items-center gap-3.5 p-4 rounded-xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 opacity-60">
                                    <input
                                        type="checkbox"
                                        disabled
                                        className="h-5 w-5 rounded-md text-sky-600 border-slate-350 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-sky-500"
                                    />
                                    <div className="space-y-0.5 text-left">
                                        <span className="text-sm font-extrabold text-slate-400 dark:text-slate-600 block">
                                            Premium Breakfast (+ $15/night)
                                        </span>
                                        <span className="text-xs font-bold text-slate-400/60 dark:text-slate-600/60">Fresh organic locally sourced ingredients</span>
                                    </div>
                                </div>
                            )}

                            {/* Replicated Button structure */}
                            <div className="pt-4">
                                <button
                                    disabled
                                    className="w-full rounded-xl bg-sky-600/40 dark:bg-sky-900/45 text-white/50 py-4 font-black cursor-not-allowed uppercase tracking-wider"
                                >
                                    BOOK NOW
                                </button>
                            </div>

                            <p className="text-center text-xs font-semibold text-slate-400">
                                You won't be charged yet. The double-booking algorithm secures your dates instantly.
                            </p>
                        </div>

                        {/* Location */}
                        <div className="space-y-6 border-t border-slate-150 dark:border-slate-800/80 pt-12">
                            <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Location & Neighborhood
                            </h2>

                            <div className="flex flex-col gap-8 items-start w-full">
                                {/* Map skeleton */}
                                <div className="space-y-4 w-full">
                                    <div className="h-72 rounded-[2.5rem] bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-800 animate-pulse w-full" />

                                    {/* Location detail row */}
                                    <div className="flex items-center gap-3 px-2 pt-2">
                                        <div className="h-10 w-10 rounded-2xl bg-slate-150 dark:bg-slate-800/60 animate-pulse shrink-0" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                            <div className="h-3 w-20 bg-slate-150 dark:bg-slate-800/60 rounded animate-pulse" />
                                        </div>
                                    </div>
                                </div>

                                {/* About area skeleton */}
                                <div className="space-y-6 w-full">
                                    <div className="space-y-2">
                                        <div className="h-5 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                        <div className="space-y-2.5">
                                            <div className="h-3.5 w-full bg-slate-150 dark:bg-slate-800/60 rounded animate-pulse" />
                                            <div className="h-3.5 w-5/6 bg-slate-150 dark:bg-slate-800/60 rounded animate-pulse" />
                                        </div>
                                    </div>

                                    {/* Popular spots nearby */}
                                    <div className="space-y-4">
                                        <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                                        <div className="space-y-3">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="h-7 w-7 rounded-xl bg-slate-150 dark:bg-slate-800/60 animate-pulse shrink-0" />
                                                    <div className="h-3.5 w-2/3 bg-slate-155 dark:bg-slate-800/60 rounded animate-pulse" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!cabin) {
        return (
            <div className="rounded-3xl border border-sky-100/50 bg-white dark:bg-slate-900 dark:border-slate-800 p-12 text-center max-w-xl mx-auto mt-12 shadow-2xl animate-slide-up">
                <Compass className="h-16 w-16 mx-auto text-sky-450 dark:text-sky-600 mb-4 animate-bounce" />
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Cabin Not Found</h2>
                <p className="mt-2 text-slate-550 dark:text-slate-400 font-medium">
                    The stay you are looking for does not exist or has been removed.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 font-bold text-white hover:bg-sky-600 transition shadow-lg shadow-sky-200/50 dark:shadow-none hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" /> Go Back to Dashboard
                </button>
            </div>
        );
    }

    // --- DERIVED DATA ---
    const bookedDatesSet = new Set<string>(
        (availability?.booked_dates || []).filter(d => {
            if (!isUpdateMode || !existingBooking) return true;
            // When updating, remove the dates of the current booking from 'unavailable' dates
            const start = parseDateString(existingBooking.start_date);
            const end = parseDateString(existingBooking.end_date);
            const current = parseDateString(d);
            return current < start || current >= end;
        })
    );

    const userBookingsByDate = new Map<string, string>();
    if (availability?.bookings) {
        availability.bookings.forEach((booking) => {
            if (booking.guest_id === user?.id) {
                // If we are updating a specific booking, don't highlight its dates in status colors
                // so they can be re-selected in 'Selection' (blue)
                if (isUpdateMode && booking.id === bookingId) return;

                const start = parseDateString(booking.start_date);
                const end = parseDateString(booking.end_date);
                const realStatus = getBookingRealStatus(booking);
                const temp = new Date(start);
                while (temp < end) {
                    userBookingsByDate.set(formatDateString(temp), realStatus);
                    temp.setDate(temp.getDate() + 1);
                }
            }
        });
    }

    const galleryPhotos = [
        cabin.image_url,
        "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1000&auto=format&fit=crop",
    ];

    const activePhoto = selectedPhoto || cabin.image_url;



    // --- HANDLERS ---
    const handleDayClick = (date: Date) => {
        const dateStr = formatDateString(date);
        if (bookedDatesSet.has(dateStr) || dateStr < todayStr) return;

        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
            setFilters({ ...filters, dateRange: { startDate: date, endDate: null } });
        } else {
            if (date < startDate) {
                setStartDate(date);
            } else {
                let hasBookedInRange = false;
                const temp = new Date(startDate);
                while (temp < date) {
                    if (bookedDatesSet.has(formatDateString(temp))) {
                        hasBookedInRange = true;
                        break;
                    }
                    temp.setDate(temp.getDate() + 1);
                }

                if (hasBookedInRange) {
                    toast.error("Selection overlaps with already booked dates. Please select another range.");
                    setStartDate(null);
                    setEndDate(null);
                    setFilters({ ...filters, dateRange: { startDate: null, endDate: null } });
                } else {
                    setEndDate(date);
                    setFilters({ ...filters, dateRange: { startDate, endDate: date } });
                    toast.success("Stay dates selected!");
                }
            }
        }
    };

    const handleResetDates = () => {
        setStartDate(null);
        setEndDate(null);
        setFilters({ ...filters, dateRange: { startDate: null, endDate: null } });
        toast.success("Stay dates reset!");
    };

    const handleOpenBookingModal = () => {
        if (!user) {
            toast.error("Please sign in to book a cabin.");
            navigate("/login", { state: { from: `/cabin/${cabin.id}` } });
            return;
        }
        if (!fullName || !phone) {
            setIsProfileIncompleteModalOpen(true);
            return;
        }
        if (!startDate || !endDate) {
            toast.error("Please select check-in and check-out dates on the calendar first.");
            return;
        }
        if (cabin.activities && cabin.activities.length > 0) {
            setCheckoutStep("activities");
        } else {
            setCheckoutStep("summary");
        }
        setIsConfirmModalOpen(true);
    };

    const handleConfirmBooking = () => {
        if (!startDate || !endDate || !user || !paymentMethod) return;

        const isEsewa = paymentMethod === "esewa";

        const bookingData = {
            guest_id: user.id,
            guest_full_name: fullName,
            guest_phone: phone,
            guest_email: user.email,
            cabin_id: cabin.id,
            start_date: formatDateString(startDate),
            end_date: formatDateString(endDate),
            total_price: totalPrice,
            has_breakfast: breakfast,
            extra_activities: selectedActivities,
            extra_offers: selectedOffers,
            payment_status: isUpdateMode ? existingBooking?.payment_status : "pending",
            payment_method: paymentMethod,
            status: isUpdateMode ? existingBooking?.status : "booked",
        };

        if (isUpdateMode && bookingId) {
            editBooking(
                { id: bookingId, ...bookingData },
                {
                    onSuccess: () => {
                        setIsConfirmModalOpen(false);
                        toast.success("Reservation updated successfully!");
                        setTimeout(() => navigate("/bookings"), 1500);
                    },
                    onError: (err: Error) => {
                        toast.error(err.message || "Failed to update reservation.");
                    },
                }
            );
            return;
        }

        createBooking(
            bookingData as any,
            {
                onSuccess: (newBooking) => {
                    setIsConfirmModalOpen(false);

                    if (isEsewa) {
                        toast.loading("Redirecting to eSewa...");
                        // Trigger eSewa redirect using the newly created booking ID
                        void payNow("esewa", totalPrice, newBooking.id);
                        return;
                    }

                    toast.custom((t) => (
                        <div className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-white dark:bg-slate-900 shadow-2xl rounded-3xl pointer-events-auto flex border border-sky-100/50 dark:border-slate-800 p-5`}>
                            <div className="flex-1 flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400">
                                    <Check className="h-6 w-6 stroke-[3]" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-extrabold text-slate-900 dark:text-white text-lg">Stay Reserved!</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Your reservation for {cabin.name} has been processed successfully.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ), { duration: 4000 });

                    setTimeout(() => navigate("/"), 1500);
                },
                onError: (err: Error) => {
                    toast.error(err.message || "Failed to create booking.");
                },
            }
        );
    };

    return (
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 lg:px-16 pt-2 md:pt-2 space-y-8 md:space-y-12 lg:space-y-16 pb-24 lg:pb-6 animate-fade-in">
            {/* Gallery + header bar */}
            <CabinGallery
                cabin={cabin}
                activePhoto={activePhoto}
                galleryPhotos={galleryPhotos}
                isLightboxOpen={isLightboxOpen}
                onSelectPhoto={setSelectedPhoto}
                onOpenLightbox={() => setIsLightboxOpen(true)}
                onCloseLightbox={() => setIsLightboxOpen(false)}
            />

            {/* Cabin title + meta */}
            <div>
                <div className="flex flex-row items-center justify-between gap-4">
                    <h1 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight truncate flex-1">
                        {cabin.name}
                    </h1>
                    <button
                        onClick={handleScrollToCalendar}
                        className={`md:hidden flex items-center gap-2 p-2 rounded-xl border border-sky-100/50 dark:border-sky-950/50 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-xs transition-all duration-300 active:scale-95 cursor-pointer shrink-0 ${shouldAnimate ? "animate-playful-attention" : ""}`}
                    >
                        <div className="h-6 w-6 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-500/20">
                            <Calendar size={12} className="stroke-[2.5]" />
                        </div>
                        <span>Book Now</span>
                    </button>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-extrabold text-slate-900 dark:text-white">
                            {cabin.reviews && cabin.reviews.length > 0
                                ? (cabin.reviews.reduce((acc, r) => acc + r.rating, 0) / cabin.reviews.length).toFixed(1)
                                : "N/A"}
                        </span>
                        <span>({cabin.reviews?.length || 0} Reviews)</span>
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span>👥 Capacity: {cabin.capacity} guests</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span> Cabin Listing</span>
                </div>
            </div>

            {/* Main content split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 items-start relative">
                {/* LEFT: description + sections */}
                <div className="lg:col-span-2 space-y-6 md:space-y-8 lg:space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <h2 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white mt-1">
                                About
                            </h2>
                            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                                {cabin.description ||
                                    "Escape the everyday chaos and unwind in this meticulously crafted cabin sanctuary. Perched beautifully amidst whispering pine trees, this stunning location offers spectacular views of local ranges, a fireplace hearth, premium wooden features, and all modern luxuries tailored for a world-class stay."}
                            </p>
                        </div>

                        <CabinAmenities
                            activities={cabin.activities}
                            offers={cabin.offers}
                        />
                    </div>

                    <div id="selection-theatre">
                        <CabinCalendar
                            startDate={startDate}
                            endDate={endDate}
                            currentMonth={currentMonth}
                            bookedDatesSet={bookedDatesSet}
                            userBookingsByDate={userBookingsByDate}
                            otherSelectionsByDate={otherSelections}
                            onDayClick={handleDayClick}
                            onPrevMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                            onNextMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                            onResetDates={handleResetDates}
                        />
                    </div>

                    {cabin.reviews && cabin.reviews.length > 0 && (
                        <CabinReviews reviews={cabin.reviews} />
                    )}
                </div>

                {/* RIGHT: booking card + recently viewed + modals */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-8">
                        <BookingCard
                            cabin={cabin}
                            userBookingStatus={userBookingStatus}
                            isBookedByOthers={isBookedByOthers}
                            startDate={startDate}
                            endDate={endDate}
                            breakfast={breakfast}
                            totalNights={totalNights}
                            baseAccommodationPrice={baseAccommodationPrice}
                            breakfastTotal={breakfastTotal}
                            cleaningFee={cleaningFee}
                            serviceTax={serviceTax}
                            totalPrice={totalPrice}
                            guestCount={filters.capacity || 1}
                            onBreakfastChange={setBreakfast}
                            onOpenBookingModal={handleOpenBookingModal}
                            isUpdateMode={isUpdateMode}
                            hasFreeBreakfast={hasFreeBreakfastOffer}
                        />

                        <CabinLocation
                            cabinName={cabin.name}
                            location={cabin.location}
                        />

                        <RecentlyViewed cabins={recentlyViewed} />
                    </div>

                    {/* Modals */}
                    {isProfileIncompleteModalOpen && (
                        <Suspense fallback={<ModalSpinner />}>
                            <ProfileIncompleteModal
                                fullName={fullName}
                                phone={phone}
                                onClose={() => setIsProfileIncompleteModalOpen(false)}
                            />
                        </Suspense>
                    )}

                    {isConfirmModalOpen && (
                        <Suspense fallback={<ModalSpinner />}>
                            <CheckoutModal
                                cabin={cabin}
                                checkoutStep={checkoutStep}
                                startDate={startDate}
                                endDate={endDate}
                                totalNights={totalNights}
                                guestCount={filters.capacity || 1}
                                fullName={fullName}
                                phone={phone}
                                breakfast={breakfast}
                                baseAccommodationPrice={baseAccommodationPrice}
                                breakfastTotal={breakfastTotal}
                                activitiesTotal={activitiesTotal}
                                discountFromOffers={discountFromOffers}
                                selectedActivities={selectedActivities}
                                selectedOffers={selectedOffers}
                                totalPrice={totalPrice}
                                paymentMethod={paymentMethod}
                                isBookingPending={isBookingPending}
                                onClose={() => setIsConfirmModalOpen(false)}
                                onStepChange={setCheckoutStep}
                                onPaymentMethodChange={setPaymentMethod}
                                onConfirm={handleConfirmBooking}
                                onToggleActivity={handleToggleActivity}
                            />
                        </Suspense>
                    )}
                </div>
            </div>

            {/* MOBILE STICKY BOOKING BAR */}
            <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 border-t border-slate-100 dark:border-slate-800 p-4 flex items-center justify-between backdrop-blur-md lg:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.08)]">
                <div className="flex flex-col text-left">
                    <div>
                        <span className="text-xl font-black text-slate-900 dark:text-white">
                            {startDate && endDate ? `$${totalPrice}` : `$${cabin.price_per_night}`}
                        </span>
                        <span className="text-slate-400 text-xs font-bold ml-1">
                            {startDate && endDate ? `total (${totalNights} nts)` : "/ night"}
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        {startDate && endDate
                            ? `${startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
                            : "No dates selected"}
                    </span>
                </div>

                <button
                    onClick={startDate && endDate ? handleOpenBookingModal : () => {
                        document.getElementById("selection-theatre")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-sky-500/20 cursor-pointer ${shouldAnimate ? "animate-playful-attention" : ""}`}
                >
                    {startDate && endDate ? "Book Now" : "Select Dates"}
                </button>
            </div>
        </div>
    );
};

export default CabinDetails;
