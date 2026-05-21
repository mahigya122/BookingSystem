import { useMemo, useState } from "react";
import { useCreateBooking } from "../authentication/useCreateBooking";
import { useCabins } from "../authentication/useCabins";
import type { Cabin } from "../types/cabin";

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

  const [form, setForm] = useState<BookingFormState>(INITIAL_FORM_STATE);
  const [error, setError] = useState("");

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

    const cabin = cabins.find((cabin: Cabin) => cabin.id === form.cabin_id);

    if (!cabin) return null;

    const nights = Math.ceil(
      (new Date(form.end_date).getTime() -
        new Date(form.start_date).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) return null;

    const base = cabin.price_per_night * nights;
    const breakfastPrice = form.has_breakfast
      ? nights * 12
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
  }, [form, cabins]);

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

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create Booking</h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid gap-3">
          <input
            name="guest_full_name"
            placeholder="Full Name"
            value={form.guest_full_name}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="guest_email"
            placeholder="Email"
            value={form.guest_email}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="guest_phone"
            placeholder="Phone"
            value={form.guest_phone}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <input
          name="capacity"
          placeholder="Required capacity (e.g. 2, 4, 6)"
          value={form.capacity}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <select
          name="cabin_id"
          value={form.cabin_id}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Select cabin</option>

          {!isLoading &&
            filteredCabins.map((cabin: Cabin) => (
              <option key={cabin.id} value={cabin.id}>
                {cabin.name} - ${cabin.price_per_night}/night
              </option>
            ))}
        </select>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="flex items-center gap-3">
        <input
         type="checkbox"
         name="has_breakfast"
         checked={form.has_breakfast}
         onChange={handleChange}
        />

        <label className="text-sm font-medium">
        Include Breakfast (+$12/night)
        </label>
        </div>

        {pricing && (
          <div className="bg-gray-100 p-4 rounded space-y-1">
            <p>Nights: {pricing.nights}</p>
            <p>Base: ${pricing.base}</p>
            <p>Breakfast: ${pricing.breakfastPrice}</p>
            <p>Discount: {pricing.discount}%</p>
            <p className="font-bold text-indigo-600">
              Total: ${pricing.total}
            </p>
          </div>
        )}

        <button
          disabled={isPending}
          className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
        >
          {isPending ? "Booking..." : "Create Booking"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;