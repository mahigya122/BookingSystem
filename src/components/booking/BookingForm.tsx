import { useMemo, useState } from "react";
import { BedDouble, CalendarDays, CheckCircle2, ChevronRight, Sparkles, UserRound, Users } from "lucide-react";
import { useCreateBooking, useCabins, useSettings } from "../../../shared/auth_hooks";
import type { Cabin } from "../../../shared/types/cabin";

interface BookingFormState {
  guest_full_name: string;
  guest_email: string;
  guest_phone: string;
  capacity: string;
  cabin_id: string;
  start_date: string;
  end_date: string;
  has_breakfast: boolean;
}

const INITIAL_FORM_STATE: BookingFormState = {
  guest_full_name: "",
  guest_email: "",
  guest_phone: "",
  capacity: "",
  cabin_id: "",
  start_date: "",
  end_date: "",
  has_breakfast: false,
};

const BookingForm = () => {
  const { createBooking, isPending } = useCreateBooking();
  const { cabins = [], isLoading } = useCabins();
  const { settings } = useSettings();

  const [form, setForm] = useState<BookingFormState>(INITIAL_FORM_STATE);
  const [error, setError] = useState("");

  const selectedCabin = useMemo(
    () => cabins.find((cabin: Cabin) => cabin.id === form.cabin_id) ?? null,
    [cabins, form.cabin_id]
  );

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
      !form.guest_full_name ||
      !form.guest_email ||
      !form.guest_phone ||
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
        guest_full_name: form.guest_full_name,
        guest_email: form.guest_email,
        guest_phone: form.guest_phone,
        cabin_id: form.cabin_id,
        start_date: form.start_date,
        end_date: form.end_date,
        total_price: pricing.total,
        has_breakfast: form.has_breakfast,
      },
      {
        onSuccess: () => {
          setForm(INITIAL_FORM_STATE);
          alert("Booking created!");
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
      <div className="mb-6 overflow-hidden rounded-[32px] border bg-[linear-gradient(135deg,color-mix(in_srgb,var(--app-primary)_14%,transparent)_0%,color-mix(in_srgb,var(--app-secondary)_10%,transparent)_45%,color-mix(in_srgb,var(--app-surface-elevated)_96%,transparent)_100%)] shadow-[0_24px_70px_-40px_rgba(15,23,42,0.32)]">
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
                Capture guest details, assign the right cabin, and see the total update in real time with a cleaner, more premium workflow.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "Guest details",
                "Cabin matching",
                "Live pricing",
              ].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border px-3 py-1 text-[11px] font-semibold"
                  style={{ borderColor: "var(--app-border)", color: "var(--app-text-muted)", background: "color-mix(in srgb, var(--app-surface-elevated) 88%, transparent)" }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 rounded-3xl border p-4" style={{ borderColor: "var(--app-border)", background: "color-mix(in srgb, var(--app-surface-elevated) 82%, transparent)" }}>
            {[
              { label: "Booking status", value: "Ready to create" },
              { label: "Cabin availability", value: isLoading ? "Loading cabins" : `${filteredCabins.length} options` },
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
                <h2 className="text-base font-black" style={{ color: "var(--app-text-main)" }}>Guest details</h2>
                <p className="text-xs font-medium" style={{ color: "var(--app-text-muted)" }}>Who are we welcoming?</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="guest_full_name"
                placeholder="Full name"
                value={form.guest_full_name}
                onChange={handleChange}
                className={inputClass}
                style={{ background: "color-mix(in srgb, var(--app-surface) 92%, white 8%)", borderColor: "var(--app-border)", color: "var(--app-text-main)" }}
              />

              <input
                name="guest_email"
                placeholder="Email address"
                value={form.guest_email}
                onChange={handleChange}
                className={inputClass}
                style={{ background: "color-mix(in srgb, var(--app-surface) 92%, white 8%)", borderColor: "var(--app-border)", color: "var(--app-text-main)" }}
              />

              <input
                name="guest_phone"
                placeholder="Phone number"
                value={form.guest_phone}
                onChange={handleChange}
                className={`${inputClass} sm:col-span-2`}
                style={{ background: "color-mix(in srgb, var(--app-surface) 92%, white 8%)", borderColor: "var(--app-border)", color: "var(--app-text-main)" }}
              />
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
                <Users className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: "var(--app-text-muted)" }} />
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
                <BedDouble className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" size={16} style={{ color: "var(--app-text-muted)" }} />
                <select
                  name="cabin_id"
                  value={form.cabin_id}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                  style={{ background: "color-mix(in srgb, var(--app-surface) 92%, white 8%)", borderColor: "var(--app-border)", color: "var(--app-text-main)" }}
                >
                  <option value="">Select cabin</option>

                  {!isLoading &&
                    filteredCabins.map((cabin: Cabin) => (
                      <option key={cabin.id} value={cabin.id}>
                        {cabin.name} - ${cabin.price_per_night}/night
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className={inputClass}
                style={{ background: "color-mix(in srgb, var(--app-surface) 92%, white 8%)", borderColor: "var(--app-border)", color: "var(--app-text-main)" }}
              />

              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className={inputClass}
                style={{ background: "color-mix(in srgb, var(--app-surface) 92%, white 8%)", borderColor: "var(--app-border)", color: "var(--app-text-main)" }}
              />
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

        <aside className="space-y-6">
          <section className={sectionCardClass}>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl" style={{ background: "color-mix(in srgb, var(--app-primary) 12%, transparent)", color: "var(--app-primary)" }}>
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h2 className="text-base font-black" style={{ color: "var(--app-text-main)" }}>Live summary</h2>
                <p className="text-xs font-medium" style={{ color: "var(--app-text-muted)" }}>Updates as you type</p>
              </div>
            </div>

            {pricing ? (
              <div className="space-y-3">
                <div className="rounded-2xl border p-4" style={{ borderColor: "var(--app-border)", background: "color-mix(in srgb, var(--app-surface) 90%, transparent)" }}>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: "var(--app-text-muted)" }}>Selected cabin</div>
                      <div className="mt-1 text-lg font-black" style={{ color: "var(--app-text-main)" }}>{selectedCabin?.name ?? "Choose a cabin"}</div>
                    </div>
                    <div className="rounded-full border px-3 py-1 text-xs font-bold" style={{ borderColor: "var(--app-border)", color: "var(--app-text-main)" }}>
                      {pricing.nights} night{pricing.nights === 1 ? "" : "s"}
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span style={{ color: "var(--app-text-muted)" }}>Base stay</span>
                      <span className="font-semibold" style={{ color: "var(--app-text-main)" }}>${pricing.base.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span style={{ color: "var(--app-text-muted)" }}>Breakfast</span>
                      <span className="font-semibold" style={{ color: "var(--app-text-main)" }}>${pricing.breakfastPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span style={{ color: "var(--app-text-muted)" }}>Discount</span>
                      <span className="font-semibold" style={{ color: "var(--app-text-main)" }}>{pricing.discount}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border px-4 py-4" style={{ borderColor: "var(--app-border)", background: "linear-gradient(135deg,color-mix(in_srgb,var(--app-primary)_10%,transparent)_0%,color-mix(in_srgb,var(--app-secondary)_8%,transparent)_100%)" }}>
                  <span className="text-sm font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--app-text-muted)" }}>Total</span>
                  <span className="text-2xl font-black" style={{ color: "var(--app-text-main)" }}>${pricing.total.toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed p-5 text-sm leading-6" style={{ borderColor: "var(--app-border)", color: "var(--app-text-muted)" }}>
                Select cabin and dates to generate live pricing, discounts, and breakfast totals.
              </div>
            )}
          </section>

          <button
            disabled={isPending}
            className="btn btn-primary flex w-full items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-black shadow-[0_18px_34px_-20px_rgba(15,23,42,0.45)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? "Booking..." : "Create Booking"}
            <ChevronRight size={16} />
          </button>
        </aside>
      </form>
    </div>
  );
};

export default BookingForm;