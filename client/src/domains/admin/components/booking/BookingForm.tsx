import { useMemo, useState, useEffect } from "react";
import { 
  CalendarDays, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  UserRound, 
  CreditCard, 
  Loader2, 
  Search, 
  UserPlus, 
  MapPin, 
  Check 
} from "lucide-react";
import { useCreateBooking, useCabins, useSettings, useGuests } from "@shared/hooks";
import { useCabinAvailability } from "../../../cabins/hooks/useCabinAvailability";
import CabinCalendar from "../../../../shared/components/ui/CabinCalendar";
import type { Cabin } from "@shared/types/cabin";
import type { Guest } from "@shared/types/guest";
import type { Activity } from "@shared/types/activity";
import type { Offer } from "@shared/types/offer";
import toast from "react-hot-toast";
import PaymentSelector from "../../../payments/PaymentSelector";
import { supabase } from "@shared/services/supabase";
import { getOptimizedImageUrl } from "@shared/utils/imageUtils";
import { useQueryClient } from "@tanstack/react-query";

// Format date to YYYY-MM-DD string in local timezone
const formatDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDaysDiff = (start: string | Date, end: string | Date) => {
  const s = new Date(start);
  const e = new Date(end);
  const diffTime = Math.abs(e.getTime() - s.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

const BookingForm = () => {
  const queryClient = useQueryClient();
  const { createBooking, isPending } = useCreateBooking();
  const { cabins = [], isLoading: isLoadingCabins } = useCabins();
  const { guests = [], isLoading: isLoadingGuests } = useGuests(1, 1000, "", "name-az");
  const { settings } = useSettings();

  const [form, setForm] = useState<BookingFormState>(INITIAL_FORM_STATE);
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
      setForm(prev => ({ ...prev, start_date: dateStr, end_date: "" }));
    } else {
      const startDate = new Date(form.start_date);
      if (date < startDate) {
        setForm(prev => ({ ...prev, start_date: dateStr, end_date: "" }));
      } else {
        // Check for overlaps
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
          toast.error("Selection overlaps with already booked dates.");
          setForm(prev => ({ ...prev, start_date: "", end_date: "" }));
        } else {
          setForm(prev => ({ ...prev, end_date: dateStr }));
        }
      }
    }
  };

  const handleResetDates = () => {
    setForm(prev => ({ ...prev, start_date: "", end_date: "" }));
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

  const filteredCabins = useMemo(() => {
    if (!form.capacity) return cabins;
    return cabins.filter((cabin: Cabin) => cabin.capacity >= Number(form.capacity));
  }, [form.capacity, cabins]);

  // Pricing calculations engine matching the guest side logic
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

  // Insert guest dynamically into guest directory
  const handleRegisterGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuest.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }
    setIsInsertingGuest(true);
    try {
      const newId = crypto.randomUUID();
      const { error: insertError } = await supabase
        .from("guests")
        .insert({
          id: newId,
          full_name: newGuest.full_name,
          email: newGuest.email || "",
          phone: newGuest.phone || "",
        });

      if (insertError) throw insertError;

      toast.success("Guest registered successfully!");
      setForm((prev) => ({ ...prev, guest_id: newId }));
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

  const handleToggleOffer = (offer: Offer) => {
    setSelectedOffers((prev) => {
      const exists = prev.some((o) => o.id === offer.id);
      if (exists) {
        return prev.filter((o) => o.id !== offer.id);
      } else {
        return [...prev, offer];
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

    if (!pricing) {
      setError("Invalid booking details");
      return;
    }

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
        is_admin_booking: true, // Flag as admin booking
      },
      {
        onSuccess: () => {
          setForm(INITIAL_FORM_STATE);
          setSelectedActivities([]);
          setSelectedOffers([]);
          toast.success("Booking created successfully!");
        },
        onError: (err: unknown) => {
          setError(err instanceof Error ? err.message : "Something went wrong");
        },
      }
    );
  };

  const sectionCardClass =
    "rounded-3xl border bg-[color-mix(in_srgb,var(--app-surface-elevated)_92%,transparent)] p-6 shadow-[0_12px_36px_-24px_rgba(15,23,42,0.15)] space-y-6";

  const inputClass =
    "w-full rounded-2xl border px-5 py-4 text-sm font-bold outline-none transition-all duration-300 focus:border-sky-400 focus:ring-8 focus:ring-sky-500/5";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
      {/* Header Banner */}
      <div className="mb-8 overflow-hidden rounded-4xl border bg-[linear-gradient(135deg,color-mix(in_srgb,var(--app-primary)_12%,transparent)_0%,color-mix(in_srgb,var(--app-secondary)_8%,transparent)_45%,color-mix(in_srgb,var(--app-surface-elevated)_96%,transparent)_100%)] shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.35em]" style={{ borderColor: "var(--app-border)", color: "var(--app-primary)", background: "color-mix(in srgb, var(--app-primary) 10%, transparent)" }}>
              <Sparkles size={12} className="animate-pulse" />
              Administrative Booking System
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight lg:text-4xl" style={{ color: "var(--app-text-main)" }}>
                Book Premium Cabins.
              </h1>
              <p className="max-w-2xl text-sm leading-6" style={{ color: "var(--app-text-muted)" }}>
                Autocomplete guest lookups, live directory addition, interactive cabin slider, and live checkout breakdown.
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border p-4" style={{ borderColor: "var(--app-border)", background: "color-mix(in srgb, var(--app-surface-elevated) 82%, transparent)" }}>
            {[
              { label: "Status", value: "Ready to Book" },
              { label: "Available Cabins", value: isLoadingCabins ? "Loading..." : `${filteredCabins.length} Active` },
              { label: "Estimated Price", value: pricing ? `$${pricing.total.toLocaleString()}` : "Pending Dates" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: "var(--app-border)", background: "color-mix(in srgb, var(--app-surface) 88%, transparent)" }}>
                <span className="text-xs font-semibold uppercase tracking-[0.22em]" style={{ color: "var(--app-text-muted)" }}>{item.label}</span>
                <span className="text-sm font-bold" style={{ color: "var(--app-text-main)" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          
          {/* STEP 1: Select Guest */}
          <section className={sectionCardClass}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-500">
                <UserRound size={18} />
              </div>
              <div>
                <h2 className="text-base font-black" style={{ color: "var(--app-text-main)" }}>Guest Details</h2>
                <p className="text-xs font-medium" style={{ color: "var(--app-text-muted)" }}>Select or create guest record</p>
              </div>
            </div>

            {/* Selected guest display */}
            {selectedGuest ? (
              <div className="flex items-center justify-between gap-4 p-5 rounded-2xl bg-sky-500/5 border border-sky-100/50 dark:border-sky-950/50">
                <div>
                  <h4 className="text-sm font-black text-slate-800 dark:text-white">{selectedGuest.full_name}</h4>
                  <p className="text-xs font-bold text-slate-400 mt-1">{selectedGuest.email} · {selectedGuest.phone || "No phone number"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForm(prev => ({ ...prev, guest_id: "" }));
                    setGuestSearch("");
                  }}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-850 hover:bg-slate-50 border text-xs font-bold text-sky-600 transition-colors"
                >
                  Change Guest
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Guest Autocomplete Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Search size={16} />
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
                    <div className="absolute z-10 w-full mt-2 rounded-2xl border bg-white dark:bg-slate-900 shadow-xl max-h-60 overflow-y-auto" style={{ borderColor: "var(--app-border)" }}>
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
                              className="w-full text-left px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex flex-col transition-colors"
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
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-black transition-colors"
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
                  <div className="p-5 rounded-2xl border bg-slate-50/50 dark:bg-slate-950/20 space-y-4" style={{ borderColor: "var(--app-border)" }}>
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "var(--app-border)" }}>
                      <h4 className="text-xs font-black uppercase tracking-widest text-sky-500">New Guest Registry</h4>
                      <button
                        type="button"
                        onClick={() => setIsCreatingGuest(false)}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600"
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
                          className="w-full rounded-xl border px-4 py-2.5 text-xs font-bold bg-white dark:bg-slate-900"
                          style={{ borderColor: "var(--app-border)" }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-455 mb-1.5 block">Email Address</label>
                        <input
                          type="email"
                          value={newGuest.email}
                          onChange={(e) => setNewGuest((prev) => ({ ...prev, email: e.target.value }))}
                          className="w-full rounded-xl border px-4 py-2.5 text-xs font-bold bg-white dark:bg-slate-900"
                          style={{ borderColor: "var(--app-border)" }}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-455 mb-1.5 block">Phone Number</label>
                        <input
                          type="tel"
                          value={newGuest.phone}
                          onChange={(e) => setNewGuest((prev) => ({ ...prev, phone: e.target.value }))}
                          className="w-full rounded-xl border px-4 py-2.5 text-xs font-bold bg-white dark:bg-slate-900"
                          style={{ borderColor: "var(--app-border)" }}
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isInsertingGuest}
                      onClick={handleRegisterGuest}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-sky-500/10"
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h2 className="text-base font-black" style={{ color: "var(--app-text-main)" }}>Stay Options</h2>
                  <p className="text-xs font-medium" style={{ color: "var(--app-text-muted)" }}>Dates and cabin selection</p>
                </div>
              </div>

              {/* Guest Capacity Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Min Capacity:</span>
                <select
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  className="rounded-xl border px-3 py-1.5 text-xs font-bold bg-slate-50 dark:bg-slate-800"
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

            {/* Horizontal Cabins Carousel Slider */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-455">Choose Cabin:</span>
              {isLoadingCabins ? (
                <div className="h-44 flex items-center justify-center bg-slate-50 dark:bg-slate-950/20 border-2 border-dashed rounded-3xl" style={{ borderColor: "var(--app-border)" }}>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Loader2 size={16} className="animate-spin text-sky-500" />
                    Loading cabin portfolio...
                  </div>
                </div>
              ) : filteredCabins.length > 0 ? (
                <div className="relative group/carousel">
                  <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                    {filteredCabins.map((cabin: Cabin) => {
                      const isSelected = form.cabin_id === cabin.id;
                      return (
                        <button
                          key={cabin.id}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, cabin_id: cabin.id }))}
                          className={`w-72 shrink-0 snap-start text-left rounded-3xl border-2 p-4 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-48 bg-white dark:bg-slate-900 ${
                            isSelected
                              ? "border-sky-500 shadow-xl shadow-sky-500/10 scale-[1.01]"
                              : "border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          {/* Image & metadata */}
                          <div className="flex gap-3 w-full">
                            <img
                              src={getOptimizedImageUrl(cabin.image_url, 'avatar')}
                              alt={cabin.name}
                              className="w-16 h-16 rounded-2xl object-cover border border-slate-100 dark:border-slate-800"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{cabin.name}</h4>
                              <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                                <MapPin size={10} className="text-sky-500" />
                                <span className="truncate">{cabin.location?.name || "Premium Retreat"}</span>
                              </div>
                              <span className="inline-block mt-2 text-[10px] font-black bg-slate-50 dark:bg-slate-850 px-2 py-0.5 rounded-full text-slate-450">
                                👥 Max Cap: {cabin.capacity}
                              </span>
                            </div>
                          </div>

                          {/* Price & selection state */}
                          <div className="flex justify-between items-end mt-4 w-full">
                            <div>
                              <span className="text-slate-455 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest block leading-none mb-1">Rate / Night</span>
                              <span className="text-base font-black text-slate-900 dark:text-white">${cabin.price_per_night}</span>
                            </div>
                            
                            {isSelected ? (
                              <div className="h-8 w-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/20">
                                <Check size={16} className="stroke-[3]" />
                              </div>
                            ) : (
                              <span className="text-[10px] font-black uppercase text-sky-500 opacity-0 group-hover/carousel:opacity-100 hover:opacity-100 transition-opacity">Select Cabin</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-44 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950/20 border-2 border-dashed rounded-3xl p-6 text-center" style={{ borderColor: "var(--app-border)" }}>
                  <p className="text-xs font-bold text-slate-455">No cabins match this filter capacity</p>
                </div>
              )}
            </div>

            {/* Calendar dates selector */}
            {form.cabin_id && (
              <div className="mt-4 border-t pt-6" style={{ borderColor: "var(--app-border)" }}>
                {loadingAvailability ? (
                  <div className="flex h-48 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                  </div>
                ) : (
                  <CabinCalendar
                    startDate={form.start_date ? new Date(form.start_date) : null}
                    endDate={form.end_date ? new Date(form.end_date) : null}
                    currentMonth={currentMonth}
                    bookedDatesSet={bookedDatesSet}
                    userBookingsByDate={new Map()}
                    onDayClick={handleDayClick}
                    onPrevMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                    onNextMonth={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                    onResetDates={handleResetDates}
                  />
                )}
              </div>
            )}
          </section>

          {/* STEP 3: Optional Add-ons (Activities & Offers) */}
          {selectedCabin && (
            <section className={sectionCardClass}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-base font-black" style={{ color: "var(--app-text-main)" }}>Extra Services & Add-ons</h2>
                  <p className="text-xs font-medium" style={{ color: "var(--app-text-muted)" }}>Select cabin-specific activities and offers</p>
                </div>
              </div>

              <div className="grid gap-6">
                {/* Breakfast configuration card */}
                <div className="flex items-center justify-between gap-4 p-5 rounded-2xl border bg-white dark:bg-slate-900" style={{ borderColor: "var(--app-border)" }}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="has_breakfast"
                      id="has_breakfast"
                      checked={form.has_breakfast}
                      onChange={handleChange}
                      className="h-4.5 w-4.5 rounded border"
                    />
                    <label htmlFor="has_breakfast" className="flex flex-col cursor-pointer">
                      <span className="text-sm font-black text-slate-800 dark:text-white">Include organic breakfast</span>
                      <span className="text-xs text-slate-455 mt-0.5">Premium catering at +${settings?.breakfast_price ?? 15}/night per guest</span>
                    </label>
                  </div>
                </div>

                {/* Cabin Activities */}
                {selectedCabin.activities && selectedCabin.activities.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-455 block">Include Local Activities:</span>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {selectedCabin.activities.map((act) => {
                        const isToggled = selectedActivities.some((x) => x.id === act.id);
                        return (
                          <button
                            key={act.id}
                            type="button"
                            onClick={() => handleToggleActivity(act)}
                            className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                              isToggled
                                ? "border-amber-500 bg-amber-50/20 dark:bg-amber-950/10 shadow-sm"
                                : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                            }`}
                          >
                            <div>
                              <h5 className="text-xs font-black text-slate-800 dark:text-white">{act.name}</h5>
                              <p className="text-[10px] text-slate-455 font-bold mt-1 line-clamp-1">{act.description || "Activity package"}</p>
                            </div>
                            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 shrink-0 ml-3">
                              {isToggled ? "✓ " : ""}${act.price || 0}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Cabin Offers */}
                {selectedCabin.offers && selectedCabin.offers.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-455 block">Apply Promotional Discounts:</span>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {selectedCabin.offers.map((offer) => {
                        const isToggled = selectedOffers.some((x) => x.id === offer.id);
                        return (
                          <button
                            key={offer.id}
                            type="button"
                            onClick={() => handleToggleOffer(offer)}
                            className={`flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                              isToggled
                                ? "border-sky-500 bg-sky-50/20 dark:bg-sky-950/10 shadow-sm"
                                : "border-slate-100 dark:border-slate-800 hover:border-slate-200"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <h5 className="text-xs font-black text-slate-800 dark:text-white truncate">{offer.title}</h5>
                              <p className="text-[10px] text-slate-455 font-bold mt-1 truncate">{offer.description || "Discount offer"}</p>
                            </div>
                            <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400 shrink-0 ml-3 bg-sky-500/10 px-2 py-0.5 rounded-full">
                              {offer.discount_percent}% OFF
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* STEP 4: Payment Selector */}
          <section className={sectionCardClass}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
                <CreditCard size={18} />
              </div>
              <div>
                <h2 className="text-base font-black" style={{ color: "var(--app-text-main)" }}>Payment</h2>
                <p className="text-xs font-medium" style={{ color: "var(--app-text-muted)" }}>Configure billing status and channel</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-455 mb-2 block">Booking Status</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, payment_status: "pending" }))}
                    className={`flex-1 py-3 rounded-2xl border font-bold text-xs uppercase tracking-wider transition-all ${form.payment_status === "pending" ? "bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-500/15" : "border-slate-200 text-slate-500 dark:border-slate-800"}`}
                  >
                    Pending Arrival
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, payment_status: "paid" }))}
                    className={`flex-1 py-3 rounded-2xl border font-bold text-xs uppercase tracking-wider transition-all ${form.payment_status === "paid" ? "bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/15" : "border-slate-200 text-slate-500 dark:border-slate-800"}`}
                  >
                    Paid Fully
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-455 mb-2 block">Payment Instrument</label>
                <PaymentSelector selectedMethod={form.payment_method} onSelect={(method) => setForm(f => ({ ...f, payment_method: method }))} />
              </div>
            </div>
          </section>
        </div>

        {/* STEP 5: Invoice summary panel */}
        <div className="space-y-6">
          <div className="sticky top-6">
            <div className="overflow-hidden rounded-3xl border bg-[color-mix(in_srgb,var(--app-surface-elevated)_92%,transparent)] shadow-xl" style={{ borderColor: "var(--app-border)" }}>
              <div className="border-b p-6" style={{ borderColor: "var(--app-border)" }}>
                <h3 className="mb-1 text-xs font-black uppercase tracking-widest text-slate-400">Transaction Overview</h3>
                <p className="text-xl font-black" style={{ color: "var(--app-text)" }}>Invoice Breakdown</p>
              </div>

              <div className="p-6">
                {!pricing ? (
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
                      <span className="font-bold text-slate-500">Accommodation ({pricing.nights} nights)</span>
                      <span className="font-black text-slate-800 dark:text-slate-100">${pricing.base}</span>
                    </div>

                    {/* Breakfast price */}
                    {form.has_breakfast && (
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-500">Breakfast Catering</span>
                        <span className="font-black text-slate-800 dark:text-slate-100">+${pricing.breakfastPrice}</span>
                      </div>
                    )}

                    {/* Activities price */}
                    {pricing.activitiesTotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-500">Extra Activities</span>
                        <span className="font-black text-slate-800 dark:text-slate-100">+${pricing.activitiesTotal}</span>
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

                    {/* Offers discount price */}
                    {pricing.discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-emerald-500">
                        <span className="font-bold">Campaign Discount ({pricing.totalDiscountPercent}%)</span>
                        <span className="font-black">-${pricing.discountAmount}</span>
                      </div>
                    )}

                    {/* Total price */}
                    <div className="mt-4 flex justify-between border-t pt-4 text-lg font-black" style={{ borderColor: "var(--app-border)", color: "var(--app-text)" }}>
                      <span>Total Invoice</span>
                      <span className="text-2xl" style={{ color: "var(--app-primary)" }}>${pricing.total}</span>
                    </div>

                    <div className="mt-4 rounded-2xl bg-[color-mix(in_srgb,var(--app-primary)_8%,transparent)] p-3 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "var(--app-primary)" }}>
                        Selected Method: {form.payment_method.toUpperCase()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-[color-mix(in_srgb,var(--app-surface-elevated)_60%,transparent)] p-6">
                <button
                  type="submit"
                  disabled={isPending || !pricing}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black text-white shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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
      </form>
    </div>
  );
};

export default BookingForm;
