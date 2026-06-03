import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@shared/auth_hooks";
import { useCreateBooking } from "@shared/comp_hooks";
import { useCabin } from "../hooks/useCabin";
import { useCabinAvailability } from "../hooks/useCabinAvailability";
import { useCabins } from "@shared/hooks/cabin";
import { useCabinFiltersContext } from "../contexts/CabinFiltersContext";
import { fetchProfile } from "../../../services/profileApi";
import toast from "react-hot-toast";
import {
  Wifi,
  Tv,
  Coffee,
  Wind,
  Check,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Compass,
  ArrowLeft,
  Shield,
  Loader2,
  Phone,
  User,
  Utensils
} from "lucide-react";

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
  
  // Use specific hooks to load cabin details and availability from the backend
  const { data: cabin, isLoading: loadingCabin } = useCabin(id);
  const { availability, isLoading: loadingAvailability } = useCabinAvailability(id);
  // Use cabins from shared to resolve recently viewed stay cards
  const { cabins = [], isLoading: loadingAllCabins } = useCabins();

  const { user } = useUser();
  const { filters, setFilters } = useCabinFiltersContext();
  const { createBooking, isPending: isBookingPending } = useCreateBooking();

  // Profile data for logged-in user
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // States
  const [activePhoto, setActivePhoto] = useState("");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [breakfast, setBreakfast] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Calendar states (internal control initialized from context filters)
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Sync initial calendar range from filters context
  useEffect(() => {
    if (filters.dateRange.startDate) {
      setStartDate(new Date(filters.dateRange.startDate));
    }
    if (filters.dateRange.endDate) {
      setEndDate(new Date(filters.dateRange.endDate));
    }
  }, [filters.dateRange.startDate, filters.dateRange.endDate]);

  // Load user profile details for prefilling booking info
  useEffect(() => {
    if (!user?.id) return;
    fetchProfile(user.id)
      .then((profile) => {
        if (profile.full_name) setFullName(profile.full_name);
        if (profile.phone) setPhone(profile.phone);
      })
      .catch(() => {
        // Silent catch: Fall back to empty inputs
      });
  }, [user?.id]);

  // Track recently viewed cabins in localStorage
  useEffect(() => {
    if (!id || !cabin) return;
    const viewed = localStorage.getItem("recently-viewed-cabins");
    let list: string[] = viewed ? JSON.parse(viewed) : [];

    // Filter out current and keep unique
    list = list.filter((item) => item !== id);
    list.unshift(id);

    // Limit to 4 unique items
    list = list.slice(0, 4);
    localStorage.setItem("recently-viewed-cabins", JSON.stringify(list));
  }, [id, cabin]);

  // Initialize main photo when cabin loads
  useEffect(() => {
    if (cabin?.image_url) {
      setActivePhoto(cabin.image_url);
    }
  }, [cabin]);

  // Retrieve details for recently viewed cabins (excluding current)
  const recentlyViewed = useMemo(() => {
    const viewed = localStorage.getItem("recently-viewed-cabins");
    if (!viewed) return [];
    const list: string[] = JSON.parse(viewed);
    return cabins.filter((c) => list.includes(c.id) && c.id !== id);
  }, [cabins, id]);

  const isLoading = loadingCabin || loadingAvailability || loadingAllCabins;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!cabin) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white dark:bg-slate-900 dark:border-slate-800 p-12 text-center max-w-xl mx-auto mt-12 shadow-2xl">
        <Compass className="h-16 w-16 mx-auto text-slate-400 dark:text-slate-600 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Cabin Not Found</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">The stay you are looking for does not exist or has been removed.</p>
        <button
          onClick={() => navigate("/user/explore")}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back to Dashboard
        </button>
      </div>
    );
  }

  // --- CALENDAR GENERATION LOGIC ---
  // All booked dates (everyone) - backend returns nights only
  const bookedDatesSet = new Set<string>(availability?.booked_dates || []);

  // My booked dates (current user only) - nights only
  const myBookedDatesSet = new Set<string>();
  if (availability?.bookings) {
    availability.bookings.forEach((booking) => {
      if (booking.guest_id === user?.id) {
        const start = parseDateString(booking.start_date);
        const end = parseDateString(booking.end_date);
        const temp = new Date(start);
        while (temp < end) { // nights only
          myBookedDatesSet.add(formatDateString(temp));
          temp.setDate(temp.getDate() + 1);
        }
      }
    });
  }

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalMonthDays = new Date(year, month + 1, 0).getDate();

  // Create grid arrays
  const daysArray: (Date | null)[] = [];
  // Fill leading empty spots
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  // Fill month days
  for (let d = 1; d <= totalMonthDays; d++) {
    daysArray.push(new Date(year, month, d));
  }

  // Today marker
  const todayStr = formatDateString(new Date());

  const handleDayClick = (date: Date) => {
    const dateStr = formatDateString(date);

    // Prevent selecting booked or past dates
    if (bookedDatesSet.has(dateStr) || dateStr < todayStr) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);

      // Sync to exploration filters context
      setFilters({
        ...filters,
        dateRange: { startDate: date, endDate: null }
      });
    } else {
      // Second click
      if (date < startDate) {
        setStartDate(date);
      } else {
        // Check for booked days in between (nights only!)
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
          // Sync to context
          setFilters({
            ...filters,
            dateRange: { startDate, endDate: date }
          });
          toast.success("Stay dates selected!");
        }
      }
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Pricing calculations
  const totalNights = startDate && endDate ? getDaysDiff(startDate, endDate) : 0;
  const baseAccommodationPrice = totalNights * cabin.price_per_night;
  const breakfastPricePerNight = 15;
  const breakfastTotal = breakfast ? totalNights * breakfastPricePerNight * (filters.capacity || 1) : 0;
  const cleaningFee = totalNights > 0 ? 50 : 0;
  const serviceTax = totalNights > 0 ? 20 : 0;
  const totalPrice = baseAccommodationPrice + breakfastTotal + cleaningFee + serviceTax;

  const handleOpenBookingModal = () => {
    if (!user) {
      toast.error("Please sign in to book a cabin.");
      navigate("/user/login", { state: { from: `/user/cabin/${cabin.id}` } });
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select check-in and check-out dates on the calendar first.");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!fullName.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }
    if (!startDate || !endDate) return;

    createBooking(
      {
        guest_full_name: fullName.trim(),
        guest_email: user?.email ?? "guest@hotelflow.com",
        guest_phone: phone.trim(),
        cabin_id: cabin.id,
        start_date: formatDateString(startDate),
        end_date: formatDateString(endDate),
        total_price: totalPrice,
        has_breakfast: breakfast,
      },
      {
        onSuccess: () => {
          setIsConfirmModalOpen(false);
          toast.custom((t) => (
            <div className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-white dark:bg-slate-900 shadow-2xl rounded-3xl pointer-events-auto flex border border-slate-100 dark:border-slate-800 p-5`}>
              <div className="flex-1 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <p className="font-extrabold text-slate-900 dark:text-white text-lg">Stay Reserved!</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Your reservation for {cabin.name} has been processed successfully.</p>
                </div>
              </div>
            </div>
          ), { duration: 4000 });

          // Redirect to explore page
          setTimeout(() => {
            navigate("/user/explore");
          }, 1500);
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to create booking.");
        },
      }
    );
  };

  // Mock secondary photos to build beautiful gallery
  const galleryPhotos = [
    cabin.image_url,
    "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=1000&auto=format&fit=crop"
  ];

  return (
    <div className="space-y-10 pb-16 animate-fade-in max-w-6xl mx-auto">
      {/* HEADER BARS */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => navigate("/user/explore")}
          className="inline-flex items-center gap-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 px-5 py-2.5 text-sm font-black text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800/50 transition duration-300 active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5 text-emerald-600 stroke-[2.5]" />
          <span>Back to Stays</span>
        </button>

        <div className="flex items-center gap-2 text-sm text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl">
          <MapPin className="h-4 w-4 text-emerald-600" /> Chamonix, France
        </div>
      </div>

      {/* CABIN HEADINGS */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {cabin.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-extrabold text-slate-900 dark:text-white">4.9</span>
            <span>(128 Reviews)</span>
          </div>
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span>👥 Capacity: {cabin.capacity} guests</span>
          <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span>🏠 Cabin Listing</span>
        </div>
      </div>

      {/* AIRBNB-STYLE GALLERY GRID */}
      <div className="grid md:grid-cols-4 gap-4">
        {/* Left Big Hero Image */}
        <div className="md:col-span-2 aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800 relative group shadow-md">
          <img
            src={activePhoto}
            alt={cabin.name}
            className="h-full w-full object-cover group-hover:scale-102 transition duration-500 cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition duration-300" />
        </div>

        {/* Right Thumbnails Grid */}
        <div className="md:col-span-2 grid grid-cols-3 md:grid-cols-1 md:grid-rows-3 gap-4">
          {galleryPhotos.slice(1).map((photo, index) => (
            <div
              key={index}
              className={`aspect-[4/3] md:aspect-auto rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative group cursor-pointer border-2 transition-all duration-300 ${activePhoto === photo
                ? "border-emerald-600 dark:border-emerald-500 shadow-lg scale-[0.98]"
                : "border-transparent hover:border-emerald-600/50"
                }`}
              onClick={() => setActivePhoto(photo)}
            >
              <img
                src={photo}
                alt={`Preview ${index + 1}`}
                className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* LEFT COLUMN: DESCRIPTION, AMENITIES, CALENDAR, LOCATION, REVIEWS */}
        <div className="lg:col-span-2 space-y-12">
          {/* DESCRIPTION */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              About this cabin retreat
            </h2>
            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
              {cabin.description ||
                "Escape the everyday chaos and unwind in this meticulously crafted cabin sanctuary. Perched beautifully amidst whispering pine trees, this stunning location offers spectacular views of local ranges, a fireplace hearth, premium wooden features, and all modern luxuries tailored for a world-class stay."}
            </p>
          </div>

          {/* AMENITIES */}
          <div className="space-y-6 border-t border-slate-100 dark:border-slate-800/80 pt-8">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Amenities & features
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/30">
                <Wifi className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-slate-800 dark:text-slate-200">High-speed WiFi (300 Mbps)</span>
              </div>
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/30">
                <Utensils className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Fully Loaded Kitchen</span>
              </div>
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/30">
                <Wind className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Central Climate Control</span>
              </div>
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/30">
                <Coffee className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Espresso Maker</span>
              </div>
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/30">
                <Tv className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-slate-800 dark:text-slate-200">8K OLED Smart TV</span>
              </div>
              <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100/50 dark:border-slate-800/30">
                <Shield className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Smart Lock Security</span>
              </div>
            </div>
          </div>

          {/* INTERACTIVE CALENDAR SECTION */}
          <div className="space-y-6 border-t border-slate-100 dark:border-slate-800/80 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  Availability Calendar
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Highlighting booked dates, today, and your custom check-in range.
                </p>
              </div>

              {/* Reset Dates */}
              {(startDate || endDate) && (
                <button
                  onClick={() => {
                    setStartDate(null);
                    setEndDate(null);
                    setFilters({ ...filters, dateRange: { startDate: null, endDate: null } });
                    toast.success("Stay dates reset!");
                  }}
                  className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 px-3.5 py-2 rounded-xl transition"
                >
                  Reset Selection
                </button>
              )}
            </div>

            {/* Custom Interactive Month Grid */}
            <div className="rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md overflow-hidden">
              {/* Calendar Month Header */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-black text-lg text-slate-900 dark:text-white">
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-2 text-center mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((dayName) => (
                  <span
                    key={dayName}
                    className="text-xs font-extrabold uppercase tracking-widest text-slate-400 py-1"
                  >
                    {dayName}
                  </span>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-2">
                {daysArray.map((date, idx) => {
                  if (!date) {
                    return <div key={`empty-${idx}`} className="aspect-square" />;
                  }

                  const dateStr = formatDateString(date);
                  const isBooked = bookedDatesSet.has(dateStr);
                  const isMine = myBookedDatesSet.has(dateStr);
                  const isPast = dateStr < todayStr;
                  const isToday = dateStr === todayStr;

                  // Highlighting ranges
                  const startStr = startDate ? formatDateString(startDate) : "";
                  const endStr = endDate ? formatDateString(endDate) : "";

                  const isStart = startStr && dateStr === startStr;
                  const isEnd = endStr && dateStr === endStr;
                  const isWithinRange =
                    startDate &&
                    endDate &&
                    dateStr > startStr &&
                    dateStr < endStr;

                  let cellClass =
                    "aspect-square flex flex-col items-center justify-center rounded-2xl text-sm font-extrabold transition relative ";

                  if (isPast) {
                    cellClass +=
                      "text-slate-300 dark:text-slate-700 cursor-not-allowed bg-slate-50/20 dark:bg-slate-900/10 ";
                  } else if (isMine) {
                    cellClass +=
                      "bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.9)] ring-2 ring-emerald-300 animate-pulse scale-[0.97] cursor-not-allowed ";
                  }
                  else if (isBooked) {
                    cellClass +=
                      "text-rose-400 dark:text-rose-500/80 cursor-not-allowed bg-rose-50/40 dark:bg-rose-950/20 line-through decoration-rose-400/50 ";
                  } else {
                    cellClass += "cursor-pointer ";

                    if (isStart || isEnd) {
                      cellClass += "bg-emerald-600 text-white shadow-md scale-95 ";
                    } else if (isWithinRange) {
                      cellClass +=
                        "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 ";
                    } else {
                      cellClass +=
                        "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-102 ";
                    }
                  }

                  return (
                    <button
                      key={`day-${dateStr}`}
                      disabled={isPast || isBooked}
                      onClick={() => handleDayClick(date)}
                      className={cellClass}
                      title={
                        isBooked
                          ? "Already Reserved"
                          : isPast
                            ? "Past Date"
                            : date.toLocaleDateString()
                      }
                    >
                      <span>{date.getDate()}</span>
                      {isToday && (
                        <span className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${isStart || isEnd ? "bg-white" : "bg-emerald-600 dark:bg-emerald-500"}`} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Calendar Legend */}
              <div className="flex flex-wrap items-center gap-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="h-4.5 w-4.5 rounded-lg bg-emerald-600" />
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4.5 w-4.5 rounded-lg bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50 line-through text-rose-400" />
                  <span>Booked (No double-booking)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4.5 w-4.5 rounded-lg border-2 border-emerald-500 dark:border-emerald-400 bg-white dark:bg-slate-900" />
                  <span>Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4.5 w-4.5 rounded-lg bg-slate-100 dark:bg-slate-800" />
                  <span>Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* LOCATION & NEARBY ATTRACTIONS */}
          <div className="space-y-6 border-t border-slate-100 dark:border-slate-800/80 pt-8">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Location & Neighborhood
            </h2>

            <div className="grid md:grid-cols-2 gap-6 items-center">
              {/* stylized Simulated Interactive Map */}
              <div className="relative h-56 rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 shadow-inner group">
                {/* Map Graphics Grid Pattern */}
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-900 opacity-60 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Simulated Map Marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group-hover:scale-105 transition-transform duration-300">
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl animate-bounce">
                    <MapPin className="h-5 w-5" />
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-30 animate-ping" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-white px-2 py-0.5 rounded-md shadow-md">
                    {cabin.name}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs font-semibold shadow-md flex justify-between items-center">
                  <span>📍 GPS: 45.9227° N, 6.8685° E</span>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 hover:text-emerald-700 font-extrabold"
                  >
                    Open in Maps
                  </a>
                </div>
              </div>

              {/* Nearby Attractions Checklists */}
              <div className="space-y-4">
                <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-200">
                  Popular Spots Nearby
                </h3>
                <ul className="space-y-3 font-semibold text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">1</span>
                    <span>🌲 Pinecrest Forest Hikes (3 min walk)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">2</span>
                    <span>🌊 Emerald Sapphire Lake (8 min drive)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">3</span>
                    <span>🏔️ Peak Gondola Lift Terminal (15 min drive)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">4</span>
                    <span>🥖 Le Petit Boulangerie Bakery (5 min walk)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* REVIEWS & COMMENTS */}
          <div className="space-y-8 border-t border-slate-100 dark:border-slate-800/80 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Guest Reviews & Comments
              </h2>
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-extrabold text-slate-950 dark:text-white text-lg">4.9</span>
                <span className="text-slate-400 dark:text-slate-600 text-lg">·</span>
                <span className="font-bold text-slate-500 text-sm">128 reviews</span>
              </div>
            </div>

            {/* Ratings Detailed Category Grids */}
            <div className="grid md:grid-cols-2 gap-4 text-sm font-bold text-slate-700 dark:text-slate-300">
              {[
                { name: "Cleanliness", rating: 4.9, width: "98%" },
                { name: "Communication", rating: 4.8, width: "95%" },
                { name: "Check-in", rating: 5.0, width: "100%" },
                { name: "Accuracy", rating: 4.9, width: "98%" },
                { name: "Location", rating: 4.7, width: "92%" },
                { name: "Value", rating: 4.8, width: "96%" },
              ].map((category) => (
                <div key={category.name} className="flex items-center justify-between gap-6 p-1">
                  <span className="w-28 text-slate-600 dark:text-slate-400">{category.name}</span>
                  <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full"
                      style={{ width: category.width }}
                    />
                  </div>
                  <span className="w-6 text-right font-black">{category.rating}</span>
                </div>
              ))}
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {[
                {
                  name: "Sophia Chen",
                  date: "May 2026",
                  comment: "Absolutely breathtaking! The details in the wood and masonry are masterfully designed. We watched the sunset from the balcony and it was a spiritual experience. Highly recommend taking the walking forest trail!",
                  rating: 5,
                  initials: "SC"
                },
                {
                  name: "Liam Johnson",
                  date: "April 2026",
                  comment: "Everything was perfectly arranged. The smart fireplace makes evenings extremely cozy and warm. Wi-Fi was blazing fast which let me take a few remote calls flawlessly. We will absolutely return next autumn!",
                  rating: 5,
                  initials: "LJ"
                }
              ].map((review, rIdx) => (
                <div
                  key={rIdx}
                  className="p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white font-extrabold shadow-sm">
                        {review.initials}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 dark:text-white">{review.name}</h4>
                        <p className="text-xs font-bold text-slate-400">{review.date}</p>
                      </div>
                    </div>

                    <div className="flex gap-0.5">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4.5 w-4.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-sm">
                    "{review.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AIRBNB STICKY PRICE & CHECKOUT CARD */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-6">
          <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6.5 shadow-xl hover:shadow-2xl transition duration-500 space-y-6">
            {/* Price tag header */}
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  ${cabin.price_per_night}
                </span>
                <span className="text-slate-400 text-sm font-bold ml-1">/ night</span>
              </div>

              {cabin.discount > 0 && (
                <span className="text-xs font-extrabold bg-rose-500 text-white px-3 py-1 rounded-full uppercase tracking-wider">
                  Save ${cabin.discount}
                </span>
              )}
            </div>

            {/* Check-in / Out Summary */}
            <div className="rounded-2xl border border-slate-150 dark:border-slate-800 overflow-hidden divide-y divide-slate-150 dark:divide-slate-800">
              <div className="grid grid-cols-2 divide-x divide-slate-150 dark:divide-slate-800 text-xs font-black">
                <div className="p-3.5 space-y-1">
                  <span className="text-slate-400 uppercase tracking-wider block">Check-in</span>
                  <span className="text-slate-900 dark:text-white text-sm">
                    {startDate ? startDate.toLocaleDateString() : "Select Date"}
                  </span>
                </div>
                <div className="p-3.5 space-y-1">
                  <span className="text-slate-400 uppercase tracking-wider block">Check-out</span>
                  <span className="text-slate-900 dark:text-white text-sm">
                    {endDate ? endDate.toLocaleDateString() : "Select Date"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 space-y-1">
                <span className="text-slate-400 text-xs font-black uppercase tracking-wider block">Guests</span>
                <span className="text-slate-900 dark:text-white text-sm font-extrabold">
                  {filters.capacity || 1} guest{(filters.capacity || 1) > 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Optional Premium Breakfast */}
            <label className="flex items-center gap-3.5 p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 cursor-pointer group hover:bg-emerald-500/10 transition">
              <input
                type="checkbox"
                checked={breakfast}
                onChange={(e) => setBreakfast(e.target.checked)}
                className="h-5 w-5 rounded-md text-emerald-600 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-emerald-500"
              />
              <div className="space-y-0.5">
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  Premium Breakfast (+ $15/night)
                </span>
                <span className="text-xs font-bold text-slate-500">Fresh organic locally sourced ingredients</span>
              </div>
            </label>

            {/* Breakdown calculations */}
            {totalNights > 0 && (
              <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-sm font-bold text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span className="underline decoration-slate-300 dark:decoration-slate-700 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">
                    ${cabin.price_per_night} x {totalNights} nights
                  </span>
                  <span className="text-slate-900 dark:text-white font-extrabold">${baseAccommodationPrice}</span>
                </div>

                {breakfast && (
                  <div className="flex justify-between">
                    <span className="underline decoration-slate-300 dark:decoration-slate-700 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer">
                      Breakfast fee
                    </span>
                    <span className="text-slate-900 dark:text-white font-extrabold">${breakfastTotal}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span className="text-slate-900 dark:text-white font-extrabold">${cleaningFee}</span>
                </div>

                <div className="flex justify-between">
                  <span>Local service tax</span>
                  <span className="text-slate-900 dark:text-white font-extrabold">${serviceTax}</span>
                </div>

                <div className="flex justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 text-base font-black text-slate-900 dark:text-white">
                  <span>Total price</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            )}

            {/* Checkout CTA */}
            <button
              onClick={handleOpenBookingModal}
              className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4.5 font-black hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-900/10 hover:shadow-emerald-950/20 transition-all active:scale-[0.98] cursor-pointer"
            >
              BOOK NOW (NEW)
            </button>

            <p className="text-center text-xs font-semibold text-slate-400">
              You won't be charged yet. The double-booking algorithm secures your dates instantly.
            </p>
          </div>
        </div>
      </div>

      {/* RECENTLY VIEWED CABINS */}
      {recentlyViewed.length > 0 && (
        <div className="space-y-6 border-t border-slate-150 dark:border-slate-800/80 pt-12">
          <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Recently Viewed Stays
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {recentlyViewed.map((recentCabin) => (
              <div
                key={recentCabin.id}
                onClick={() => navigate(`/user/cabin/${recentCabin.id}`)}
                className="group cursor-pointer space-y-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-3.5 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={recentCabin.image_url}
                    alt={recentCabin.name}
                    className="h-full w-full object-cover group-hover:scale-103 transition duration-500"
                  />
                </div>
                <div className="px-1.5 flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition truncate pr-2">
                    {recentCabin.name}
                  </h4>
                  <span className="font-black text-slate-950 dark:text-emerald-400 shrink-0 text-sm">
                    ${recentCabin.price_per_night}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LIGHTBOX SLIDESHOW MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-slate-300 font-extrabold text-3xl cursor-pointer"
          >
            ×
          </button>
          <img
            src={activePhoto}
            alt="Gallery high definition"
            className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl animate-zoom-in"
          />
        </div>
      )}

      {/* SECURE BOOKING FORM MODAL */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
            onClick={() => setIsConfirmModalOpen(false)}
          />

          {/* Modal Card */}
          <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl border border-slate-100 dark:border-slate-800/80 animate-zoom-in space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Review & Confirm Stay
              </h3>
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-xl cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Quick summary check */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 space-y-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
              <p className="font-extrabold text-base text-slate-900 dark:text-white">{cabin.name}</p>
              <div className="flex justify-between border-t border-slate-100 dark:border-slate-850 pt-2 text-xs">
                <span>Check-in: {startDate?.toLocaleDateString()}</span>
                <span>Check-out: {endDate?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-xs font-black text-slate-900 dark:text-white">
                <span>Stay Price ({totalNights} nights)</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            {/* Form Inputs */}
            <div className="space-y-4 font-bold text-sm">
              <div className="space-y-2">
                <label className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-emerald-600" /> Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-5 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-emerald-600" /> Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="Enter your mobile phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-5 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="flex-1 rounded-2xl border border-slate-250 dark:border-slate-800 py-3.5 font-bold hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-350 cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                disabled={isBookingPending}
                onClick={handleConfirmBooking}
                className="flex-1 rounded-2xl bg-emerald-600 py-3.5 font-black text-white hover:bg-emerald-700 shadow-lg shadow-emerald-900/10 cursor-pointer flex justify-center items-center gap-2"
              >
                {isBookingPending ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" /> Reserving...
                  </>
                ) : (
                  "Confirm Stay"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CabinDetails;