import { useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, ChevronRight, Sparkles, UserRound, CreditCard, Loader2 } from "lucide-react";
import { useCreateBooking, useCabins, useSettings, useGuests } from "@shared/hooks";
import { useCabinAvailability } from "../../../cabins/hooks/useCabinAvailability";
import CabinCalendar from "../../../../shared/components/ui/CabinCalendar";
import type { Cabin } from "@shared/types/cabin";
import type { Guest } from "@shared/types/guest";
import toast from "react-hot-toast";
import PaymentSelector from "../../../payments/components/PaymentSelector";

// Format date to YYYY-MM-DD string in local timezone
const formatDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
  capacity: "",
  cabin_id: "",
  start_date: "",
  end_date: "",
  has_breakfast: false,
  payment_status: "pending",
  payment_method: "arrival",
};

const BookingForm = () => {
  const { createBooking, isPending } = useCreateBooking();
  const { cabins = [], isLoading: isLoadingCabins } = useCabins();
  const { guests = [], isLoading: isLoadingGuests } = useGuests();
  const { settings } = useSettings();

  const [form, setForm] = useState<BookingFormState>(INITIAL_FORM_STATE);
  const [error, setError] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { availability, isLoading: loadingAvailability } = useCabinAvailability(form.cabin_id);

  const selectedCabin = useMemo(
    () => cabins.find((cabin: Cabin) => cabin.id === form.cabin_id) ?? null,
    [cabins, form.cabin_id]
  );

  const bookedDatesSet = useMemo(() => new Set<string>(availability?.booked_dates || []), [availability]);

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

  const pricing = useMemo(() => {
    if (!form.cabin_id || !form.start_date || !form.end_date) return null;

    const cabin = selectedCabin;

    if (!cabin) return null;

    const nights = Math.ceil(
      (new Date(form.end_date).getTime() -
        new Date(form.start_date).getTime()) /
      (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) return null;

    const base = cabin.price_per_night * nights;
    const breakfastUnit = settings?.breakfast_price ?? 12;
    const breakfastPrice = form.has_breakfast
      ? nights * breakfastUnit
      : 0;
    const discount = cabin.discount || 0;
    const discountAmount = (base * discount) / 100;

    return {
      nights,
      base,
      breakfastPrice,
      discount,
      discountAmount,
      total: base + breakfastPrice - discountAmount,
    };
  }, [form, selectedCabin, settings?.breakfast_price]);

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

    const selectedGuest = guests.find((g: Guest) => g.id === form.guest_id);

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
        is_admin_booking: true, // Flag as admin booking
      },
      {
        onSuccess: () => {
          setForm(INITIAL_FORM_STATE);
          toast.success("Booking created!");
        },
        onError: (err: unknown) => {
          setError(err instanceof Error ? err.message : "Something went wrong");
        },
      }
    );
  };

  const inputClass =
    "w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition-all duration-200 focus:shadow-[0_0_0_4px_var(--app-glow)]";

  const sectionCardClass =
    "rounded-3xl border bg-[color-mix(in_srgb,var(--app-surface-elevated)_92%,transparent)] p-5 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.3)]";

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
      <div className="mb-6 overflow-hidden rounded-4xl border bg-[linear-gradient(135deg,color-mix(in_srgb,var(--app-primary)_14%,transparent)_0%,color-mix(in_srgb,var(--app-secondary)_10%,transparent)_45%,color-mix(in_srgb,var(--app-surface-elevated)_96%,transparent)_100%)] shadow-[0_24px_70px_-40px_rgba(15,23,42,0.32)]">
        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr] lg:p-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.35em]" style={{ borderColor: "var(--app-border)", color: "var(--app-primary)", background: "color-mix(in srgb, var(--app-primary) 10%, transparent)" }}>
              <Sparkles size={12} />
              New Booking
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tight lg:text-4xl" style={{ color: "var(--app-text-main)" }}>
                Create a booking that feels effortless.
              </h1>
              <p className="max-w-2xl text-sm leading-6" style={{ color: "var(--app-text-muted)" }}>
                Select a guest, assign the right cabin, and see the total update in real time with a cleaner, more premium workflow.
              </p>
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border p-4" style={{ borderColor: "var(--app-border)", background: "color-mix(in srgb, var(--app-surface-elevated) 82%, transparent)" }}>
            {[
              { label: "Booking status", value: "Ready to create" },
              { label: "Cabin availability", value: isLoadingCabins ? "Loading cabins" : `${filteredCabins.length} options` },
              { label: "Pricing", value: pricing ? `$${pricing.total.toLocaleString()}` : "Calculated live" },
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
          <section className={sectionCardClass}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: "color-mix(in srgb, var(--app-primary) 12%, transparent)", color: "var(--app-primary)" }}>
                <UserRound size={18} />
              </div>
              <div>
                <h2 className="text-base font-black" style={{ color: "var(--app-text-main)" }}>Select Guest</h2>
                <p className="text-xs font-medium" style={{ color: "var(--app-text-muted)" }}>Who are we welcoming?</p>
              </div>
            </div>

            <div className="grid gap-3">
              <select
                name="guest_id"
                value={form.guest_id}
                onChange={handleChange}
                className={inputClass}
                style={{ background: "color-mix(in srgb, var(--app-surface) 92%, white 8%)", borderColor: "var(--app-border)", color: "var(--app-text-main)" }}
              >
                <option value="">Select a guest...</option>
                {isLoadingGuests ? (
                  <option disabled>Loading guests...</option>
                ) : (
                  guests.map((guest: Guest) => (
                    <option key={guest.id} value={guest.id}>
                      {guest.full_name} ({guest.email})
                    </option>
                  ))
                )}
              </select>
            </div>
          </section>

          <section className={sectionCardClass}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: "color-mix(in srgb, var(--app-secondary) 12%, transparent)", color: "var(--app-secondary)" }}>
                <CalendarDays size={18} />
              </div>
              <div>
                <h2 className="text-base font-black" style={{ color: "var(--app-text-main)" }}>Stay details</h2>
                <p className="text-xs font-medium" style={{ color: "var(--app-text-muted)" }}>Dates and capacity</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative">
                <input
                  name="capacity"
                  placeholder="Guests required"
                  value={form.capacity}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                  style={{ background: "color-mix(in srgb, var(--app-surface) 92%, white 8%)", borderColor: "var(--app-border)", color: "var(--app-text-main)" }}
                />
              </div>

              <div className="relative">
                <select
                  name="cabin_id"
                  value={form.cabin_id}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                  style={{ background: "color-mix(in srgb, var(--app-surface) 92%, white 8%)", borderColor: "var(--app-border)", color: "var(--app-text-main)" }}
                >
                  <option value="">Select cabin</option>

                  {!isLoadingCabins &&
                    filteredCabins.map((cabin: Cabin) => (
                      <option key={cabin.id} value={cabin.id}>
                        {cabin.name} - ${cabin.price_per_night}/night
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {form.cabin_id && (
              <div className="mt-6 border-t pt-6">
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

          <section className={sectionCardClass}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: "color-mix(in srgb, var(--app-primary) 12%, transparent)", color: "var(--app-primary)" }}>
                <CreditCard size={18} />
              </div>
              <div>
                <h2 className="text-base font-black" style={{ color: "var(--app-text-main)" }}>Payment</h2>
                <p className="text-xs font-medium" style={{ color: "var(--app-text-muted)" }}>Method and status</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, payment_status: "pending" }))}
                  className={`flex-1 px-4 py-2.5 rounded-xl border font-bold text-xs transition-all ${form.payment_status === "pending" ? "bg-amber-50 border-amber-600 text-white" : "border-slate-200 text-slate-500"}`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, payment_status: "paid" }))}
                  className={`flex-1 px-4 py-2.5 rounded-xl border font-bold text-xs transition-all ${form.payment_status === "paid" ? "bg-emerald-600 border-emerald-700 text-white" : "border-slate-200 text-slate-500"}`}
                >
                  Paid
                </button>
              </div>

              <PaymentSelector selectedMethod={form.payment_method} onSelect={(method) => setForm(f => ({ ...f, payment_method: method }))} />
            </div>
          </section>

          <div className="flex items-center gap-3 rounded-3xl border px-4 py-4" style={{ borderColor: "var(--app-border)", background: "color-mix(in srgb, var(--app-surface-elevated) 86%, transparent)" }}>
            <input
              type="checkbox"
              name="has_breakfast"
              checked={form.has_breakfast}
              onChange={handleChange}
              className="h-4 w-4 rounded border"
            />

            <label className="text-sm font-semibold" style={{ color: "var(--app-text-main)" }}>
              Include breakfast <span style={{ color: "var(--app-text-muted)" }}>(+${settings?.breakfast_price ?? 12}/night)</span>
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="sticky top-6">
            <div className="overflow-hidden rounded-3xl border bg-[color-mix(in_srgb,var(--app-surface-elevated)_92%,transparent)] shadow-2xl shadow-slate-900/10" style={{ borderColor: "var(--app-border)" }}>
              <div className="border-b p-6" style={{ borderColor: "var(--app-border)" }}>
                <h3 className="mb-1 text-sm font-black uppercase tracking-widest text-slate-400">Order Summary</h3>
                <p className="text-xl font-black" style={{ color: "var(--app-text)" }}>Review Details</p>
              </div>

              <div className="p-6">
                {!pricing ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
                    <CalendarDays className="mb-3 h-10 w-10 opacity-20" />
                    <p className="text-xs font-bold leading-relaxed">
                      Select a cabin and dates<br />to see pricing breakdown
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-slate-500">Base Rate ({pricing.nights} nt)</span>
                      <span className="font-black" style={{ color: "var(--app-text)" }}>${pricing.base}</span>
                    </div>
                    {form.has_breakfast && (
                      <div className="flex justify-between text-sm">
                        <span className="font-bold text-slate-500">Breakfast</span>
                        <span className="font-black" style={{ color: "var(--app-text)" }}>+${pricing.breakfastPrice}</span>
                      </div>
                    )}
                    {pricing.discount > 0 && (
                      <div className="flex justify-between text-sm text-rose-500">
                        <span className="font-bold">Discount ({pricing.discount}%)</span>
                        <span className="font-black">-${pricing.discountAmount}</span>
                      </div>
                    )}
                    <div className="mt-4 flex justify-between border-t pt-4 text-lg font-black" style={{ borderColor: "var(--app-border)", color: "var(--app-text)" }}>
                      <span>Total</span>
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
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black text-white shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
                      <span>Confirm Booking</span>
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
