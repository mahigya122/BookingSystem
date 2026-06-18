import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useUser, useCreateBooking, useCabins, useUpdateBooking, useBookings } from "@shared/hooks";
import type { Cabin } from "@shared/types";
import { useProfile } from "../../../../hooks/useProfile";
import { useCabin } from "../../hooks/useCabin";
import { useCabinAvailability } from "../../hooks/useCabinAvailability";
import { useCabinFiltersContext } from "../../contexts/CabinFiltersContext";
import { usePayment } from "../../../payments/hooks/usePayment";
import { getBookingRealStatus } from "@shared/utils/bookingUtils";
import toast from "react-hot-toast";
import { Check, Compass, ArrowLeft, Loader2, Star } from "lucide-react";

import CabinGallery from "./CabinGallery";
import CabinAmenities from "./CabinAmenities";
import CabinCalendar from "../../../../shared/components/ui/CabinCalendar";
import CabinLocation from "./CabinLocation";
import CabinReviews from "./CabinReviews";
import BookingCard from "./BookingCard";
import RecentlyViewed from "./RecentlyViewed";
import CheckoutModal from "./CheckoutModal";
import ProfileIncompleteModal from "./ProfileIncompleteModal";
import ReviewForm from "./ReviewForm";

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
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isProfileIncompleteModalOpen, setIsProfileIncompleteModalOpen] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState<"summary" | "payment">("summary");
    const [paymentMethod, setPaymentMethod] = useState<string>("arrival");

    // Calendar date state (synced from context or existing booking)
    const [startDate, setStartDate] = useState<Date | null>(() => {
        if (existingBooking) return parseDateString(existingBooking.start_date);
        return filters?.dateRange?.startDate ? new Date(filters.dateRange.startDate) : null
    });
    const [endDate, setEndDate] = useState<Date | null>(() => {
        if (existingBooking) return parseDateString(existingBooking.end_date);
        return filters?.dateRange?.endDate ? new Date(filters.dateRange.endDate) : null
    });

    const [breakfast, setBreakfast] = useState(existingBooking?.has_breakfast || false);

    // Sync breakfast when entering update mode
    useEffect(() => {
        if (existingBooking && !isConfirmModalOpen) {
            setBreakfast(existingBooking.has_breakfast);
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
    const hasUserReservation = !!activeBooking;

    const handleEnterUpdateMode = () => {
        if (activeBooking) {
            navigate(`?bookingId=${activeBooking.id}`, { replace: true });
        }
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

    // PRICING & SELECTIONS HOOKS
    const selectedActivitiesData = useMemo(() =>
        cabin?.activities?.filter(a => selectedActivities.includes(a.id)) || [],
        [cabin?.activities, selectedActivities]);

    const selectedOffersData = useMemo(() =>
        cabin?.offers?.filter(o => selectedOffers.includes(o.id)) || [],
        [cabin?.offers, selectedOffers]);

    const isLoading = loadingCabin || loadingAvailability || loadingAllCabins || loadingProfile;

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center bg-slate-50/10 dark:bg-slate-950/10">
                <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
            </div>
        );
    }

    if (!cabin) {
        return (
            <div className="rounded-3xl border border-sky-100/50 bg-white dark:bg-slate-900 dark:border-slate-800 p-12 text-center max-w-xl mx-auto mt-12 shadow-2xl animate-slide-up">
                <Compass className="h-16 w-16 mx-auto text-sky-450 dark:text-sky-600 mb-4 animate-bounce" />
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Cabin Not Found</h2>
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
    ];

    const activePhoto = selectedPhoto || cabin.image_url;

    // --- PRICING ---
    const todayStr = formatDateString(new Date());
    const totalNights = startDate && endDate ? getDaysDiff(startDate, endDate) : 0;
    const baseAccommodationPrice = totalNights * cabin.price_per_night;
    const breakfastPricePerNight = 15;
    const breakfastTotal = breakfast ? totalNights * breakfastPricePerNight * (filters.capacity || 1) : 0;

    const activitiesTotal = selectedActivitiesData.reduce((acc, a) => acc + (a.price || 0), 0);

    const discountFromOffers = selectedOffersData.reduce((acc, o) => {
        const discount = (o.discount_percent / 100) * baseAccommodationPrice;
        return acc + discount;
    }, 0);

    const cleaningFee = totalNights > 0 ? 50 : 0;
    const serviceTax = totalNights > 0 ? 20 : 0;
    const totalPrice = Math.max(0, baseAccommodationPrice + breakfastTotal + activitiesTotal + cleaningFee + serviceTax - discountFromOffers);

    // --- HANDLERS ---
    const handleToggleActivity = (id: string) => {
        setSelectedActivities(prev =>
            prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
        );
    };

    const handleToggleOffer = (id: string) => {
        setSelectedOffers(prev =>
            prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
        );
    };
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
        setCheckoutStep("summary");
        setIsConfirmModalOpen(true);
    };

    const handleConfirmBooking = () => {
        if (!startDate || !endDate || !user) return;

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
            extra_activities: selectedActivitiesData,
            extra_offers: selectedOffersData,
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
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 lg:px-16 space-y-16 pb-24 animate-fade-in">
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
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    {cabin.name}
                </h1>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start relative">
                {/* LEFT: description + sections */}
                <div className="lg:col-span-2 space-y-16">
                    <div className="space-y-4">
                        <p className="text-sky-400 text-xl font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                            The Sanctuary
                        </p>
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
                            About this cabin retreat
                        </h2>
                        <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                            {cabin.description ||
                                "Escape the everyday chaos and unwind in this meticulously crafted cabin sanctuary. Perched beautifully amidst whispering pine trees, this stunning location offers spectacular views of local ranges, a fireplace hearth, premium wooden features, and all modern luxuries tailored for a world-class stay."}
                        </p>
                    </div>

                    <CabinAmenities
                        activities={cabin.activities}
                        offers={cabin.offers}
                        selectedActivities={selectedActivities}
                        selectedOffers={selectedOffers}
                        onToggleActivity={handleToggleActivity}
                        onToggleOffer={handleToggleOffer}
                    />

                    <CabinCalendar
                        startDate={startDate}
                        endDate={endDate}
                        currentMonth={currentMonth}
                        bookedDatesSet={bookedDatesSet}
                        userBookingsByDate={userBookingsByDate}
                        onDayClick={handleDayClick}
                        onPrevMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                        onNextMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                        onResetDates={handleResetDates}
                    />

                    <CabinReviews reviews={cabin.reviews} />
                </div>

                {/* RIGHT: booking card + recently viewed + modals */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-8">
                        {(userBookingStatus === "checked-in" || userBookingStatus === "checked-out") && user ? (
                            <ReviewForm
                                cabinId={cabin.id}
                                guestId={user.id}
                                onSuccess={() => navigate(0)}
                            />
                        ) : (
                            <BookingCard
                                cabin={cabin}
                                hasUserReservation={hasUserReservation && !isUpdateMode}
                                userBookingStatus={userBookingStatus}
                                isBookedByOthers={isBookedByOthers}
                                startDate={startDate}
                                endDate={endDate}
                                breakfast={breakfast}
                                totalNights={totalNights}
                                baseAccommodationPrice={baseAccommodationPrice}
                                breakfastTotal={breakfastTotal}
                                activitiesTotal={activitiesTotal}
                                discountFromOffers={discountFromOffers}
                                selectedActivities={selectedActivitiesData}
                                selectedOffers={selectedOffersData}
                                cleaningFee={cleaningFee}
                                serviceTax={serviceTax}
                                totalPrice={totalPrice}
                                guestCount={filters.capacity || 1}
                                onBreakfastChange={setBreakfast}
                                onOpenBookingModal={handleOpenBookingModal}
                                onEnterUpdateMode={handleEnterUpdateMode}
                                isUpdateMode={isUpdateMode}
                            />
                        )}

                        <CabinLocation
                            cabinName={cabin.name}
                            location={cabin.location}
                        />

                        <RecentlyViewed cabins={recentlyViewed} />
                    </div>

                    {/* Modals */}
                    {isProfileIncompleteModalOpen && (
                        <ProfileIncompleteModal
                            fullName={fullName}
                            phone={phone}
                            onClose={() => setIsProfileIncompleteModalOpen(false)}
                        />
                    )}

                    {isConfirmModalOpen && (
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
                            selectedActivities={selectedActivitiesData}
                            selectedOffers={selectedOffersData}
                            totalPrice={totalPrice}
                            paymentMethod={paymentMethod}
                            isBookingPending={isBookingPending}
                            onClose={() => setIsConfirmModalOpen(false)}
                            onStepChange={setCheckoutStep}
                            onPaymentMethodChange={setPaymentMethod}
                            onConfirm={handleConfirmBooking}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CabinDetails;
