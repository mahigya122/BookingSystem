import { useMemo, useState, useEffect, useRef, Suspense } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  UserRound,
  Loader2,
  UserPlus,
  MapPin,
  Home,
  Users,
  Check,
  Compass,
} from "lucide-react";
import { useCreateBooking, useCabins, useSettings, useGuests, useLocations } from "@shared/hooks";
import { useCabinAvailability } from "../../../cabins/hooks/useCabinAvailability";
import CabinCalendar from "../../../../shared/components/ui/CabinCalendar";
import { getBookingRealStatus } from "@shared/utils/bookingUtils";
import type { Cabin } from "@shared/types/cabin";
import type { Guest } from "@shared/types/guest";
import type { Activity } from "@shared/types/activity";
import type { Location } from "@shared/types/location";
import type { Offer } from "@shared/types/offer";
import toast from "react-hot-toast";
import { supabase } from "@shared/services/supabase";
import { getOptimizedImageUrl } from "@shared/utils/imageUtils";
import { useQueryClient } from "@tanstack/react-query";
import { CheckoutModal } from "@shared/modals/lazyModals";
import ModalSpinner from "@shared/components/ui/ModalSpinner";
import { usePayment } from "../../../payments/usePayment";
import { calculatePayableAmount } from "../../../payments/payment.types";

// Format date to YYYY-MM-DD string in local timezone
const formatDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Parse YYYY-MM-DD string into a local Date object (mirrors client-side CabinDetails.tsx)
const parseDateString = (str: string) => {
  const [year, month, day] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const getDaysDiff = (start: string | Date, end: string | Date) => {
  const s = typeof start === "string" ? parseDateString(start) : start;
  const e = typeof end === "string" ? parseDateString(end) : end;
  const diffTime = Math.abs(e.getTime() - s.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Short, readable date label for the trip-summary pills (e.g. "25 Jul 2025")
const formatShortDate = (dateStr: string) => {
  if (!dateStr) return "Not set";
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

interface BookingFormState {
  guest_id: string;
  capacity: string;
  cabin_id: string;
  start_date: string;
  end_date: string;
  has_breakfast: boolean;
  payment_status: "pending" | "paid";
  payment_method: string;
}

const INITIAL_FORM_STATE: BookingFormState = {
  guest_id: "",
  capacity: "1",
  cabin_id: "",
  start_date: "",
  end_date: "",
  has_breakfast: false,
  payment_status: "pending",
  payment_method: "arrival",
};

/* ------------------------------------------------------------------ */
/* Word-style "font picker" dropdown: closed trigger + searchable list  */
/* Shared by the cabin selector and the location selector below.       */
/* ------------------------------------------------------------------ */
interface SelectDropdownProps<T> {
  items: T[];
  getId: (item: T) => string;
  getSearchText: (item: T) => string;
  selectedId: string;
  onSelect: (id: string) => void;
  renderTrigger: (item: T | undefined) => React.ReactNode;
  renderRow: (item: T, isSelected: boolean) => React.ReactNode;
  placeholder: string;
  searchPlaceholder: string;
  isLoading?: boolean;
  emptyLabel?: string;
}

function SelectDropdown<T>({
  items,
  getId,
  getSearchText,
  selectedId,
  onSelect,
  renderTrigger,
  renderRow,
  placeholder,
  searchPlaceholder,
  isLoading = false,
  emptyLabel = "No results found",
}: SelectDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedItem = items.find((item) => getId(item) === selectedId);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((item) => getSearchText(item).toLowerCase().includes(q));
  }, [items, search, getSearchText]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 hover:border-sky-300 dark:hover:border-sky-800 cursor-pointer"
        style={{
          borderColor: isOpen ? "var(--app-primary)" : "var(--app-border)",
          background: "color-mix(in srgb, var(--app-surface) 92%, white 8%)",
        }}
      >
        {selectedItem ? (
          <div className="min-w-0 flex-1">{renderTrigger(selectedItem)}</div>
        ) : (
          <span className="text-sm font-bold text-slate-400">{placeholder}</span>
        )}
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-20 w-full mt-2 rounded-2xl border bg-white dark:bg-slate-900 shadow-xl overflow-hidden animate-fade-in"
          style={{ borderColor: "var(--app-border)" }}
        >
          <div className="relative border-b p-2" style={{ borderColor: "var(--app-border)" }}>
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl pl-8 pr-3 py-2.5 text-xs font-bold bg-slate-50 dark:bg-slate-850 outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div className="max-h-72 overflow-y-auto py-1.5">
            {isLoading ? (
              <div className="p-4 text-xs font-bold text-slate-400 text-center flex items-center justify-center gap-2">
                <Loader2 size={12} className="animate-spin" />
                Loading...
              </div>
            ) : filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const id = getId(item);
                const isSelected = id === selectedId;
                return (
                  <button
                    key={id || "all"}
                    type="button"
                    onClick={() => {
                      onSelect(id);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`w-[calc(100%-0.75rem)] mx-1.5 my-0.5 text-left px-3 py-2.5 rounded-xl transition-colors cursor-pointer ${
                      isSelected ? "bg-sky-500/10" : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    {renderRow(item, isSelected)}
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-xs font-bold text-slate-400 text-center">{emptyLabel}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const BookingForm = () => {
  const queryClient = useQueryClient();
  const { createBooking, isPending } = useCreateBooking();
  const { payNow } = usePayment("");
  const { cabins = [], isLoading: isLoadingCabins } = useCabins();
  const { guests = [], isLoading: isLoadingGuests } = useGuests(1, 1000, "", "name-az");
  const { locations = [], isLoading: isLoadingLocations } = useLocations();
  const { settings } = useSettings();

  const [form, setForm] = useState<BookingFormState>(INITIAL_FORM_STATE);
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Location selector state
  const [selectedLocationId, setSelectedLocationId] = useState("");

  // Guest Autocomplete Search & Creation States
  const [guestSearch, setGuestSearch] = useState("");
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [isCreatingGuest, setIsCreatingGuest] = useState(false);
  const [newGuest, setNewGuest] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [isInsertingGuest, setIsInsertingGuest] = useState(false);

  // Cabin-specific Add-ons selection states
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<Offer[]>([]);

  // Checkout Modal states (client-side matching)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"activities" | "summary" | "payment">("summary");

  const { availability, isLoading: loadingAvailability } = useCabinAvailability(form.cabin_id);

  const selectedCabin = useMemo(
    () => cabins.find((cabin: Cabin) => cabin.id === form.cabin_id) ?? null,
    [cabins, form.cabin_id]
  );

  const selectedGuest = useMemo(
    () => guests.find((g: Guest) => g.id === form.guest_id) ?? null,
    [guests, form.guest_id]
  );

  // Auto-fill selected cabin's offers by default when selected cabin changes
  useEffect(() => {
    setSelectedActivities([]);
    if (selectedCabin?.offers) {
      setSelectedOffers(selectedCabin.offers);
    } else {
      setSelectedOffers([]);
    }
  }, [form.cabin_id, selectedCabin]);

  const bookedDatesSet = useMemo(() => new Set<string>(availability?.booked_dates || []), [availability]);

  // Compile the selected guest's bookings by date, using the same real-status resolver
  // (getBookingRealStatus) the client-facing calendar relies on, so colors match 1:1.
  const userBookingsByDate = useMemo(() => {
    const bookingMap = new Map<string, string>();
    if (!form.guest_id || !availability?.bookings) return bookingMap;

    availability.bookings.forEach((booking: any) => {
      if (booking.guest_id === form.guest_id) {
        const start = parseDateString(booking.start_date);
        const end = parseDateString(booking.end_date);
        const realStatus = getBookingRealStatus(booking);
        const temp = new Date(start);
        while (temp < end) {
          bookingMap.set(formatDateString(temp), realStatus);
          temp.setDate(temp.getDate() + 1);
        }
      }
    });
    return bookingMap;
  }, [form.guest_id, availability]);

  /* ---------------------------------------------------------------- */
  /* Realtime presence — identical channel/payload shape to the        */
  /* client-facing CabinDetails page, so an admin booking a cabin and   */
  /* a guest browsing that same cabin see each other's live selection.  */
  /* ---------------------------------------------------------------- */
  const [clientId] = useState(() => Math.random().toString(36).substring(2, 15));
  const [otherSelections, setOtherSelections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!form.cabin_id) {
      setOtherSelections(new Set());
      return;
    }

    const channel = supabase.channel(`cabin-selections:${form.cabin_id}`);

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

              if (form.start_date && form.end_date) {
                const myStart = parseDateString(form.start_date);
                const myEnd = parseDateString(form.end_date);
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
          setForm((prev) => ({ ...prev, start_date: "", end_date: "" }));
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            clientId,
            startDate: form.start_date || null,
            endDate: form.end_date || null,
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [form.cabin_id, clientId, form.start_date, form.end_date]);

  // Filter guests list locally for autocomplete
  const filteredGuests = useMemo(() => {
    if (!guestSearch.trim()) return [];
    return guests.filter(
      (g) =>
        g.full_name.toLowerCase().includes(guestSearch.toLowerCase()) ||
        g.email.toLowerCase().includes(guestSearch.toLowerCase())
    );
  }, [guests, guestSearch]);

  const handleDayClick = (date: Date) => {
    const dateStr = formatDateString(date);
    const todayStr = formatDateString(new Date());

    if (bookedDatesSet.has(dateStr) || dateStr < todayStr) return;

    if (!form.start_date || (form.start_date && form.end_date)) {
      setForm((prev) => ({ ...prev, start_date: dateStr, end_date: "" }));
    } else {
      const startDate = parseDateString(form.start_date);
      if (date < startDate) {
        setForm((prev) => ({ ...prev, start_date: dateStr, end_date: "" }));
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
          setForm((prev) => ({ ...prev, start_date: "", end_date: "" }));
        } else {
          setForm((prev) => ({ ...prev, end_date: dateStr }));
          toast.success("Stay dates selected!");
        }
      }
    }
  };

  const handleResetDates = () => {
    setForm((prev) => ({ ...prev, start_date: "", end_date: "" }));
    toast.success("Stay dates reset!");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  // Filter cabins by capacity and location selection
  const filteredCabins = useMemo(() => {
    let result = cabins;
    if (form.capacity) {
      result = result.filter((cabin: Cabin) => cabin.capacity >= Number(form.capacity));
    }
    if (selectedLocationId) {
      result = result.filter((cabin: Cabin) => cabin.location_id === selectedLocationId);
    }
    return result;
  }, [form.capacity, selectedLocationId, cabins]);

  // Sync cabin selection with location filters
  useEffect(() => {
    if (selectedLocationId && filteredCabins.length === 1) {
      const singleId = filteredCabins[0].id;
      if (form.cabin_id !== singleId) {
        setForm((prev) => ({ ...prev, cabin_id: singleId }));
      }
    } else if (form.cabin_id) {
      const exists = filteredCabins.some((cabin) => cabin.id === form.cabin_id);
      if (!exists) {
        setForm((prev) => ({ ...prev, cabin_id: "" }));
      }
    }
  }, [selectedLocationId, filteredCabins, form.cabin_id]);

  const locationOptions = useMemo(
    () => [{ id: "", name: "All Locations" } as Location, ...locations],
    [locations]
  );

  // --- Free-breakfast offer detection, mirrored from CabinDetails/BookingCard ---
  const hasFreeBreakfastOffer = useMemo(() => {
    return selectedOffers.some((offer) => {
      const nameMatch = (offer.name || offer.title || "").toLowerCase().includes("breakfast");
      const descMatch = (offer.description || "").toLowerCase().includes("breakfast");
      return nameMatch || descMatch;
    });
  }, [selectedOffers]);

  useEffect(() => {
    if (hasFreeBreakfastOffer) {
      setForm((prev) => ({ ...prev, has_breakfast: false }));
    }
  }, [hasFreeBreakfastOffer]);



 const handleRegisterGuest = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newGuest.full_name.trim()) {
    toast.error("Full name is required");
    return;
  }
  setIsInsertingGuest(true);
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData?.session?.access_token;

    if (!token) {
      toast.error("Your admin session has expired. Please log in again.");
      setIsInsertingGuest(false);
      return;
    }

    const res = await fetch("/api/admin/guests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        full_name: newGuest.full_name,
        email: newGuest.email,
        phone: newGuest.phone,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to register guest");

    toast.success("Guest registered successfully!");
    setForm((prev) => ({ ...prev, guest_id: data.guest.id }));
    setIsCreatingGuest(false);
    setNewGuest({ full_name: "", email: "", phone: "" });
    setGuestSearch("");
    await queryClient.invalidateQueries({ queryKey: ["guests"] });
  } catch (err: any) {
    toast.error(err.message || "Failed to register guest");
  } finally {
    setIsInsertingGuest(false);
  }
};

  // Pricing calculations engine — matches the guest-facing logic in CabinDetails.tsx exactly
  const pricing = useMemo(() => {
    if (!form.cabin_id || !form.start_date || !form.end_date) return null;

    const cabin = selectedCabin;
    if (!cabin) return null;

    const nights = getDaysDiff(form.start_date, form.end_date);
    if (nights <= 0) return null;

    const base = cabin.price_per_night * nights;
    const breakfastUnit = settings?.breakfast_price ?? 15;
    const capacityVal = Number(form.capacity) || 1;
    const breakfastPrice = form.has_breakfast ? nights * breakfastUnit * capacityVal : 0;

    const totalDiscountPercent = selectedOffers.reduce((sum, offer) => sum + (offer.discount_percent || 0), 0);
    const discountAmount = base * (totalDiscountPercent / 100);

    const activitiesTotal = selectedActivities.reduce((sum, act) => sum + (act.price || 0), 0);

    const cleaningFee = 50;
    const serviceTax = 20;

    const total = Math.max(0, base - discountAmount + breakfastPrice + activitiesTotal + cleaningFee + serviceTax);

    return {
      nights,
      base,
      breakfastPrice,
      discountAmount,
      totalDiscountPercent,
      activitiesTotal,
      cleaningFee,
      serviceTax,
      total,
    };
  }, [form, selectedCabin, settings?.breakfast_price, selectedActivities, selectedOffers]);

  // Overlap / double-booking guard — identical semantics to CabinDetails.tsx's isBookedByOthers,
  // scoped to "others" meaning any guest other than the one currently selected in this form.
  const isBookedByOthers = useMemo(() => {
    if (!availability?.bookings || !form.start_date || !form.end_date) return false;
    const selStart = parseDateString(form.start_date);
    const selEnd = parseDateString(form.end_date);

    return availability.bookings.some((booking: any) => {
      if (booking.status === "cancelled") return false;
      const isOthers = !form.guest_id || booking.guest_id !== form.guest_id;
      if (!isOthers) return false;

      const bStart = parseDateString(booking.start_date);
      const bEnd = parseDateString(booking.end_date);
      return selStart < bEnd && selEnd > bStart;
    });
  }, [availability, form.start_date, form.end_date, form.guest_id]);


  const handleToggleActivity = (activity: Activity) => {
    setSelectedActivities((prev) => {
      const exists = prev.some((act) => act.id === activity.id);
      if (exists) {
        return prev.filter((act) => act.id !== activity.id);
      } else {
        return [...prev, activity];
      }
    });
  };



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !form.guest_id ||
      !form.cabin_id ||
      !form.start_date ||
      !form.end_date
    ) {
      setError("All fields are required");
      return;
    }

    if (isBookedByOthers) {
      setError("The selected dates are no longer available for this cabin.");
      toast.error("These dates were just booked by someone else. Please pick new dates.");
      return;
    }

    if (!pricing) {
      setError("Invalid booking details");
      return;
    }

    setError("");
    if (selectedCabin?.activities && selectedCabin.activities.length > 0) {
      setCheckoutStep("activities");
    } else {
      setCheckoutStep("summary");
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!form.guest_id || !form.cabin_id || !form.start_date || !form.end_date || !pricing) return;

    createBooking(
      {
        guest_id: form.guest_id,
        guest_full_name: selectedGuest?.full_name,
        guest_email: selectedGuest?.email,
        guest_phone: selectedGuest?.phone,
        cabin_id: form.cabin_id,
        start_date: form.start_date,
        end_date: form.end_date,
        total_price: pricing.total,
        has_breakfast: form.has_breakfast,
        payment_status: form.payment_status,
        payment_method: form.payment_method,
        extra_activities: selectedActivities,
        extra_offers: selectedOffers,
        is_admin_booking: true,
      },
      {
        onSuccess: (newBooking) => {
          setIsConfirmModalOpen(false);

          if (form.payment_method.startsWith("esewa")) {
            toast.loading("Redirecting to eSewa...");
            const payableAmount = calculatePayableAmount(form.payment_method as any, pricing.total);
            void payNow(form.payment_method as any, payableAmount, newBooking.id, true);
            return;
          }

          setForm(INITIAL_FORM_STATE);
          setSelectedActivities([]);
          setSelectedOffers([]);
          toast.success("Booking created successfully!");
        },
        onError: (err: unknown) => {
          setIsConfirmModalOpen(false);
          setError(err instanceof Error ? err.message : "Something went wrong");
        },
      }
    );
  };

  const sectionCardClass =
    "rounded-3xl border bg-[color-mix(in_srgb,var(--app-surface-elevated)_92%,transparent)] p-6 shadow-[0_12px_36px_-24px_rgba(15,23,42,0.15)] space-y-6";

  const sectionHeaderTitleClass =
    "text-base font-black uppercase tracking-wider";
  const sectionHeaderSubtitleClass = "text-xs font-medium mt-0.5";

  const inputClass =
    "w-full rounded-2xl border px-5 py-4 text-sm font-bold outline-none transition-all duration-300 focus:border-sky-400 focus:ring-8 focus:ring-sky-500/5";

  // Small "trip summary" pill used in the Your Stay card — mirrors the label-over-value
  // pill pattern (icon + value inside a rounded pill, small caps label above it).
  const SummaryPill = ({
    icon,
    label,
    value,
    accent = "sky",
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    accent?: "sky" | "emerald";
  }) => (
    <div>
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
        {label}
      </span>
      <div
        className={`flex items-center gap-2 rounded-2xl border px-3.5 py-2.5 ${
          accent === "emerald"
            ? "bg-emerald-500/5 border-emerald-500/20"
            : "bg-sky-500/5 border-sky-500/20"
        }`}
      >
        <span className={accent === "emerald" ? "text-emerald-500 shrink-0" : "text-sky-500 shrink-0"}>
          {icon}
        </span>
        <span className="text-xs font-black text-slate-800 dark:text-white truncate">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-slide-up pb-2 px-2 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <p
            className="text-sky-500 text-sm font-bold block"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            New Booking
          </p>
          <h1 className="text-2xl
            md:text-3xl
            font-black
            text-slate-900
            dark:text-white
            tracking-tighter
            mt-0">Book Premium Cabins</h1>
          <p className="text-xs
            md:text-sm
            text-slate-500
            dark:text-slate-400
            max-w-lg
            leading-relaxed
            mt-0">Autocomplete guest lookups, live directory addition, searchable cabin picker, and live checkout breakdown.</p>
        </div>

        {/* Stats on Right */}
        <div className="flex items-center gap-3 w-full sm:w-auto mt-3 sm:mt-0">
          {[
            { label: "Cabins Available", value: isLoadingCabins ? "Loading..." : `${filteredCabins.length} Active` },
            { label: "Estimated Price", value: pricing ? `$${pricing.total.toLocaleString()}` : "Pending Dates" },
          ].map((item) => (
            <div key={item.label} className="px-3.5 py-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-sm text-left">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">{item.label}</span>
              <span className="text-xs font-black text-slate-800 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">

          {/* STEP 1: Select Guest */}
          <section className={sectionCardClass}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                <UserRound size={18} />
              </div>
              <div>
                <h2 className={sectionHeaderTitleClass} style={{ color: "var(--app-text-main)" }}>Guest Details</h2>
                <p className={sectionHeaderSubtitleClass} style={{ color: "var(--app-text-muted)" }}>Select or create guest record</p>
              </div>
            </div>

            {/* Selected guest display */}
            {selectedGuest ? (
              <div className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-sky-500/5 border border-sky-100/50 dark:border-sky-950/50 transition-all duration-300">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white font-black text-sm">
                    {selectedGuest.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-slate-800 dark:text-white truncate">{selectedGuest.full_name}</h4>
                    <p className="text-xs font-bold text-slate-400 mt-0.5 truncate">{selectedGuest.email} · {selectedGuest.phone || "No phone number"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForm(prev => ({ ...prev, guest_id: "" }));
                    setGuestSearch("");
                  }}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 border text-xs font-bold text-sky-600 transition-colors cursor-pointer shrink-0"
                  style={{ borderColor: "var(--app-border)" }}
                >
                  Change Guest
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Guest Autocomplete Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  
                  </div>
                  <input
                    type="text"
                    placeholder="Search guest by name or email..."
                    value={guestSearch}
                    onChange={(e) => {
                      setGuestSearch(e.target.value);
                      setShowGuestDropdown(true);
                      setIsCreatingGuest(false);
                    }}
                    onFocus={() => setShowGuestDropdown(true)}
                    className={`${inputClass} pl-11`}
                    style={{ background: "color-mix(in srgb, var(--app-surface) 92%, white 8%)", borderColor: "var(--app-border)", color: "var(--app-text-main)" }}
                  />
                  {showGuestDropdown && guestSearch && (
                    <div className="absolute z-10 w-full mt-2 rounded-2xl border bg-white dark:bg-slate-900 shadow-xl max-h-60 overflow-y-auto animate-fade-in" style={{ borderColor: "var(--app-border)" }}>
                      {isLoadingGuests ? (
                        <div className="p-4 text-xs font-bold text-slate-400 text-center flex items-center justify-center gap-2">
                          <Loader2 size={12} className="animate-spin" />
                          Searching database...
                        </div>
                      ) : filteredGuests.length > 0 ? (
                        <div className="py-2">
                          {filteredGuests.map((guest) => (
                            <button
                              key={guest.id}
                              type="button"
                              onClick={() => {
                                setForm((prev) => ({ ...prev, guest_id: guest.id }));
                                setShowGuestDropdown(false);
                                setGuestSearch("");
                              }}
                              className="w-full text-left px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex flex-col transition-colors cursor-pointer"
                            >
                              <span className="text-sm font-black text-slate-800 dark:text-white">{guest.full_name}</span>
                              <span className="text-xs text-slate-400 font-bold mt-0.5">{guest.email}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-xs text-slate-400 font-bold mb-2">No matching guest found</p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreatingGuest(true);
                              setShowGuestDropdown(false);
                              setNewGuest({ full_name: guestSearch, email: "", phone: "" });
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-black transition-colors cursor-pointer"
                          >
                            <UserPlus size={14} />
                            Create Guest: "{guestSearch}"
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Create Guest Form inline */}
                {isCreatingGuest && (
                  <div className="p-5 rounded-2xl border bg-slate-50/50 dark:bg-slate-950/20 space-y-4 animate-fade-in" style={{ borderColor: "var(--app-border)" }}>
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--app-border)" }}>
                      <h4 className="text-xs font-black uppercase tracking-widest text-sky-500">New Guest Registry</h4>
                      <button
                        type="button"
                        onClick={() => setIsCreatingGuest(false)}
                        className="text-xs font-bold text-slate-455 hover:text-slate-600 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-455 mb-1.5 block">Full Name</label>
                        <input
                          type="text"
                          value={newGuest.full_name}
                          onChange={(e) => setNewGuest((prev) => ({ ...prev, full_name: e.target.value }))}
                          className="w-full rounded-xl border px-4 py-2.5 text-xs font-bold bg-white dark:bg-slate-900 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all"
                          style={{ borderColor: "var(--app-border)" }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-455 mb-1.5 block">Email Address</label>
                        <input
                          type="email"
                          value={newGuest.email}
                          onChange={(e) => setNewGuest((prev) => ({ ...prev, email: e.target.value }))}
                          className="w-full rounded-xl border px-4 py-2.5 text-xs font-bold bg-white dark:bg-slate-900 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all"
                          style={{ borderColor: "var(--app-border)" }}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-455 mb-1.5 block">Phone Number</label>
                        <input
                          type="tel"
                          value={newGuest.phone}
                          onChange={(e) => setNewGuest((prev) => ({ ...prev, phone: e.target.value }))}
                          className="w-full rounded-xl border px-4 py-2.5 text-xs font-bold bg-white dark:bg-slate-900 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 transition-all"
                          style={{ borderColor: "var(--app-border)" }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isInsertingGuest}
                      onClick={handleRegisterGuest}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-lg shadow-sky-500/10 cursor-pointer active:scale-[0.99]"
                    >
                      {isInsertingGuest ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <>
                          <UserPlus size={14} />
                          <span>Register & Select Guest</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* STEP 2: Cabin & Date Selector */}
          <section className={sectionCardClass}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h2 className={sectionHeaderTitleClass} style={{ color: "var(--app-text-main)" }}>Stay Options</h2>
                  <p className={sectionHeaderSubtitleClass} style={{ color: "var(--app-text-muted)" }}>Dates and cabin selection</p>
                </div>
              </div>

              {/* Guest Capacity Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Min Capacity:</span>
                <select
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className="rounded-xl border px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800 cursor-pointer"
                  style={{ borderColor: "var(--app-border)" }}
                >
                  {[1, 2, 4, 6, 8].map((n) => (
                    <option key={n} value={n}>
                      👥 {n} Guest{n > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION picker — Word font-list style: closed trigger + searchable dropdown */}
            <div className="space-y-2.5 border-t pt-6" style={{ borderColor: "var(--app-border)" }}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-455 block">Location Filter</span>
              <SelectDropdown<Location>
                items={locationOptions}
                getId={(loc) => loc.id}
                getSearchText={(loc) => loc.name}
                selectedId={selectedLocationId}
                onSelect={setSelectedLocationId}
                placeholder="All Locations"
                searchPlaceholder="Search locations..."
                isLoading={isLoadingLocations}
                emptyLabel="No locations found"
                renderTrigger={(loc) => (
                  <span className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-white truncate">
                    <MapPin size={14} className="text-sky-500 shrink-0" />
                    {loc?.name || "All Locations"}
                  </span>
                )}
                renderRow={(loc, isSelected) => (
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-xs font-black text-slate-700 dark:text-slate-200 truncate">
                      <MapPin size={12} className={isSelected ? "text-sky-500" : "text-slate-400"} />
                      {loc.name}
                    </span>
                    {isSelected && <Check size={13} className="text-sky-500 shrink-0" />}
                  </span>
                )}
              />
            </div>

            {/* CABIN picker — same Word font-list pattern: thumbnail preview per row */}
            <div className="space-y-2.5 border-t pt-6" style={{ borderColor: "var(--app-border)" }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-455">Choose Cabin</span>
                <span className="text-[10px] font-bold text-slate-400">{filteredCabins.length} available</span>
              </div>

              {selectedLocationId ? (
                <div className="grid gap-4 sm:grid-cols-2 mt-3">
                  {filteredCabins.map((cabin) => {
                    const isSelected = form.cabin_id === cabin.id;
                    const glowClass = isSelected
                      ? "ring-4 ring-sky-500 shadow-[0_0_25px_rgba(14,165,233,0.35)]"
                      : "border border-slate-150 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800";
                    return (
                      <button
                        key={cabin.id}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, cabin_id: cabin.id }))}
                        className={`group relative flex flex-col overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 ease-out aspect-[4/3] w-full ${glowClass}`}
                      >
                        {/* Cabin Image */}
                        <img
                          src={getOptimizedImageUrl(cabin.image_url, "featured")}
                          alt={cabin.name}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Discount Tag / Selection Badge at Top Left */}
                        {isSelected ? (
                          <div className="absolute top-3 left-3 z-10 bg-sky-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                            <Check size={10} className="stroke-[3]" />
                            Selected
                          </div>
                        ) : cabin.discount > 0 ? (
                          <div className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                            Save ${cabin.discount}
                          </div>
                        ) : null}

                        {/* Price tag */}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md rounded-xl shadow-lg z-10 px-2.5 py-1 text-slate-900 font-black text-xs md:text-sm">
                          <span>${cabin.price_per_night}</span>
                          <span className="text-slate-500 text-[9px] ml-0.5">/nt</span>
                        </div>

                        {/* Details at bottom */}
                        <div className="absolute bottom-0 left-0 p-4 w-full text-left space-y-1">
                          <h3 className="text-white font-black text-sm md:text-base leading-tight group-hover:text-sky-400 transition-colors truncate">
                            {cabin.name}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={10} className="text-sky-400 shrink-0" />
                            <p className="text-white/70 font-medium text-[10px] md:text-xs truncate">
                              {cabin.location?.name || "Private Location"} · 👥 {cabin.capacity} Guest{cabin.capacity > 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <SelectDropdown<Cabin>
                  items={filteredCabins}
                  getId={(cabin) => cabin.id}
                  getSearchText={(cabin) => `${cabin.name} ${cabin.location?.name || ""}`}
                  selectedId={form.cabin_id}
                  onSelect={(id) => setForm((prev) => ({ ...prev, cabin_id: id }))}
                  placeholder="Choose a cabin..."
                  searchPlaceholder="Search cabins by name or location..."
                  isLoading={isLoadingCabins}
                  emptyLabel="No cabins match this filter"
                  renderTrigger={(cabin) =>
                    cabin ? (
                      <span className="flex items-center gap-3 min-w-0">
                        <span className="h-9 w-9 rounded-xl overflow-hidden shrink-0 border" style={{ borderColor: "var(--app-border)" }}>
                          <img
                            src={getOptimizedImageUrl(cabin.image_url, "avatar")}
                            alt={cabin.name}
                            className="h-full w-full object-cover"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="text-sm font-black text-slate-800 dark:text-white truncate block">{cabin.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 truncate block">
                            {cabin.location?.name || "Premium Retreat"} · ${cabin.price_per_night}/night
                          </span>
                        </span>
                      </span>
                    ) : null
                  }
                  renderRow={(cabin, isSelected) => (
                    <span className="flex items-center gap-3 min-w-0">
                      <span className="h-10 w-10 rounded-xl overflow-hidden shrink-0 border" style={{ borderColor: "var(--app-border)" }}>
                        <img
                          src={getOptimizedImageUrl(cabin.image_url, "avatar")}
                          alt={cabin.name}
                          className="h-full w-full object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="text-xs font-black text-slate-800 dark:text-white truncate block">{cabin.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 truncate block">
                          {cabin.location?.name || "Premium Retreat"} · 👥 {cabin.capacity} · ${cabin.price_per_night}/night
                        </span>
                      </span>
                      {isSelected && <Check size={14} className="text-sky-500 shrink-0" />}
                    </span>
                  )}
                />
              )}

              {filteredCabins.length === 0 && !isLoadingCabins && (
                <div className="flex items-center gap-2 px-1 pt-1 text-[11px] font-bold text-slate-455">
                  <Compass size={13} className="text-slate-300 dark:text-slate-700 shrink-0" />
                  No cabins match this capacity/location combination.
                </div>
              )}
            </div>

            {/* Calendar dates selector */}
            {form.cabin_id && (
              loadingAvailability ? (
                <div className="flex h-48 items-center justify-center border-t pt-6" style={{ borderColor: "var(--app-border)" }}>
                  <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                </div>
              ) : (
                <CabinCalendar
                  startDate={form.start_date ? parseDateString(form.start_date) : null}
                  endDate={form.end_date ? parseDateString(form.end_date) : null}
                  currentMonth={currentMonth}
                  bookedDatesSet={bookedDatesSet}
                  userBookingsByDate={userBookingsByDate}
                  otherSelectionsByDate={otherSelections}
                  onDayClick={handleDayClick}
                  onPrevMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                  onNextMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                  onResetDates={handleResetDates}
                />
              )
            )}
          </section>

        </div>

        {/* RIGHT COLUMN: Trip summary + invoice panel */}
        <div className="space-y-6">
          <div className="sticky top-6 space-y-6">

            {/* "Your Stay" trip-summary card */}
            <div className="rounded-3xl border p-6 space-y-5" style={{ borderColor: "var(--app-border)", background: "color-mix(in srgb, var(--app-surface-elevated) 92%, transparent)" }}>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Your Stay</h3>

              <div className="grid grid-cols-2 gap-3">
                <SummaryPill
                  icon={<Home size={14} />}
                  label="Cabin"
                  value={selectedCabin?.name || "Not selected"}
                />
                <SummaryPill
                  icon={<MapPin size={14} />}
                  label="Location"
                  value={selectedCabin?.location?.name || "Not selected"}
                />
                <SummaryPill
                  icon={<CalendarDays size={14} />}
                  label="Check-in"
                  value={form.start_date ? formatShortDate(form.start_date) : "Not set"}
                />
                <SummaryPill
                  icon={<CalendarDays size={14} />}
                  label="Check-out"
                  value={form.end_date ? formatShortDate(form.end_date) : "Not set"}
                />
              </div>

              <SummaryPill
                icon={<Users size={14} />}
                label="Guests"
                value={`${form.capacity} guest${Number(form.capacity) > 1 ? "s" : ""}${pricing ? ` · ${pricing.nights} night${pricing.nights > 1 ? "s" : ""}` : ""}`}
                accent="emerald"
              />
            </div>

            {/* Price breakdown card */}
            <div className="overflow-hidden rounded-3xl border shadow-xl" style={{ borderColor: "var(--app-border)", background: "color-mix(in_srgb,var(--app-surface-elevated)_92%,transparent)" }}>
              <div className="border-b p-6" style={{ borderColor: "var(--app-border)" }}>
                <h3 className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400">Transaction Overview</h3>
                <p className="text-xl font-black" style={{ color: "var(--app-text)" }}>Price Details</p>
              </div>

              <div className="p-6">
                {isBookedByOthers ? (
                  /* Matches BookingCard.tsx's "Dates Unavailable" state exactly */
                  <div className="rounded-2xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/20 dark:bg-rose-950/10 p-6 text-center space-y-4 animate-fade-in ring-1 ring-rose-500/10">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                      <svg className="h-6 w-6 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">Dates Unavailable</p>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        This cabin is already booked for the selected dates by another guest. Please choose different dates.
                      </p>
                    </div>
                  </div>
                ) : !pricing ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                    <CalendarDays className="mb-3 h-10 w-10 opacity-20" />
                    <p className="text-xs font-bold leading-relaxed">
                      Select cabin and stay dates<br />to compile dynamic pricing
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Accommodation price */}
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-slate-500">Accommodation ({pricing.nights} night{pricing.nights > 1 ? "s" : ""})</span>
                      <span className="font-black text-slate-800 dark:text-slate-100">${pricing.base}</span>
                    </div>

                    {/* Offers discount */}
                    {pricing.discountAmount > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400 font-extrabold">
                          <span>Perks Discount</span>
                          <span>-${pricing.discountAmount.toFixed(0)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedOffers.map((o) => (
                            <span key={o.id} className="text-[9px] bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/30 font-black uppercase tracking-wider">
                              {o.name || o.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Breakfast price */}
                    {(form.has_breakfast || hasFreeBreakfastOffer) && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-slate-500">Breakfast Catering</span>
                          <span className={hasFreeBreakfastOffer ? "font-black text-emerald-600 dark:text-emerald-400" : "font-black text-slate-800 dark:text-slate-100"}>
                            {hasFreeBreakfastOffer ? "FREE" : `+$${pricing.breakfastPrice}`}
                          </span>
                        </div>
                        {hasFreeBreakfastOffer && (
                          <span className="text-[10px] text-emerald-500 font-bold block leading-none">
                            Included via promotional offer
                          </span>
                        )}
                      </div>
                    )}

                    {/* Activities price */}
                    {pricing.activitiesTotal > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-bold text-slate-500">Extra Activities</span>
                          <span className="font-black text-slate-800 dark:text-slate-100">+${pricing.activitiesTotal}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {selectedActivities.map((a) => (
                            <span key={a.id} className="text-[9px] bg-sky-50 dark:bg-sky-955/40 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full border border-sky-100 dark:border-sky-900/30 font-black uppercase tracking-wider">
                              {a.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tax & fees */}
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-slate-500">Cleaning Fee</span>
                      <span className="font-black text-slate-800 dark:text-slate-100">+$50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-slate-500">Service Tax</span>
                      <span className="font-black text-slate-800 dark:text-slate-100">+$20</span>
                    </div>

                    {/* Total, with a struck-through pre-discount reference price when a discount applies */}
                    <div className="mt-4 flex items-end justify-between border-t pt-4" style={{ borderColor: "var(--app-border)" }}>
                      <span className="text-lg font-black" style={{ color: "var(--app-text)" }}>Total Invoice</span>
                      <div className="text-right">
                        {pricing.discountAmount > 0 && (
                          <span className="block text-xs font-bold text-slate-400 line-through">
                            ${(pricing.total + pricing.discountAmount).toFixed(0)}
                          </span>
                        )}
                        <span className="text-2xl font-black" style={{ color: "var(--app-primary)" }}>${pricing.total}</span>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-[color-mix(in_srgb,var(--app-primary)_8%,transparent)] p-3 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--app-primary)" }}>
                        Selected Method: {form.payment_method.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[color-mix(in_srgb,var(--app-surface-elevated)_60%,transparent)] p-6 hidden lg:block">
                <button
                  type="submit"
                  disabled={isPending || !pricing || isBookedByOthers}
                  className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-black uppercase tracking-wider text-white shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
                    boxShadow: "0 12px 30px -10px color-mix(in srgb, var(--app-primary) 50%, transparent)"
                  }}
                >
                  {isPending ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Create Booking</span>
                      <ChevronRight className="h-4 w-4 opacity-50" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE STICKY SUBMIT BAR */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 border-t p-4 flex items-center justify-between backdrop-blur-md lg:hidden shadow-[0_-10px_30px_rgba(0,0,0,0.08)]" style={{ borderColor: "var(--app-border)" }}>
          <div className="flex flex-col text-left min-w-0">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {pricing ? `$${pricing.total}` : "—"}
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate">
              {isBookedByOthers
                ? "Dates unavailable"
                : pricing
                  ? `Total · ${pricing.nights} night${pricing.nights > 1 ? "s" : ""}`
                  : "Select cabin & dates"}
            </span>
          </div>
          <button
            type="submit"
            disabled={isPending || !pricing || isBookedByOthers}
            className="px-6 py-3.5 rounded-full text-white font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--app-primary), var(--app-secondary))",
            }}
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : "Create Booking"}
          </button>
        </div>
      </form>

      {isConfirmModalOpen && selectedCabin && (
        <Suspense fallback={<ModalSpinner />}>
          <CheckoutModal
            cabin={selectedCabin}
            checkoutStep={checkoutStep}
            startDate={form.start_date ? parseDateString(form.start_date) : null}
            endDate={form.end_date ? parseDateString(form.end_date) : null}
            totalNights={pricing?.nights || 0}
            guestCount={Number(form.capacity) || 1}
            fullName={selectedGuest?.full_name || ""}
            phone={selectedGuest?.phone || ""}
            breakfast={form.has_breakfast}
            baseAccommodationPrice={pricing?.base || 0}
            breakfastTotal={pricing?.breakfastPrice || 0}
            activitiesTotal={pricing?.activitiesTotal || 0}
            discountFromOffers={pricing?.discountAmount || 0}
            selectedActivities={selectedActivities}
            selectedOffers={selectedOffers}
            totalPrice={pricing?.total || 0}
            paymentMethod={form.payment_method as any}
            isBookingPending={isPending}
            onClose={() => setIsConfirmModalOpen(false)}
            onStepChange={setCheckoutStep}
            onPaymentMethodChange={(method) => {
              const status = (method === "esewa_full" || method === "esewa") ? "paid" : "pending";
              setForm(f => ({ ...f, payment_method: method, payment_status: status }));
            }}
            onConfirm={handleConfirmBooking}
            onToggleActivity={handleToggleActivity}
            isAdmin={true}
          />
        </Suspense>
      )}
    </div>
  );
};

export default BookingForm;