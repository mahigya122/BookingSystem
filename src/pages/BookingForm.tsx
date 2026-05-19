import { useMemo, useState } from "react";
import { useCreateBooking } from "../authentication/useCreateBooking";
import { useCabins } from "../authentication/useCabins";

const INITIAL_FORM_STATE = {
  guest_full_name: "",
  guest_email: "",
  guest_phone: "",
  capacity: "",
  cabin_id: "",
  start_date: "",
  end_date: "",
};

const BookingForm = () => {
  const { createBooking, isPending } = useCreateBooking();
  const { cabins = [] , isLoading} = useCabins();

  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [error, setError] = useState("");

  // ------------------------
  // INPUT HANDLER
  // ------------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ------------------------
  // FILTER CABINS BY CAPACITY
  // ------------------------
  const filteredCabins = useMemo(() => {
    if (!form.capacity) return cabins;
    return cabins.filter(
      (c: any) => c.capacity >= Number(form.capacity)
    );
  }, [form.capacity, cabins]);

  // ------------------------
  // PRICE CALCULATION
  // ------------------------
  const pricing = useMemo(() => {
    if (!form.cabin_id || !form.start_date || !form.end_date) return null;

    const cabin = cabins.find(
      (c: any) => c.id === form.cabin_id
    );

    if (!cabin) return null;

    const nights = Math.ceil(
      (new Date(form.end_date).getTime() -
        new Date(form.start_date).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) return null;

    const base = cabin.price_per_night * nights;
    const discount = cabin.discount || 0;
    const discountAmount = (base * discount) / 100;

    return {
      nights,
      base,
      discount,
      discountAmount,
      total: base - discountAmount,
    };
  }, [form, cabins]);

  // ------------------------
  // SUBMIT
  // ------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // simple validation
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
      },
      {
        onSuccess: () => {
          setForm(INITIAL_FORM_STATE);
          alert("Booking created!");
        },
        onError: (err: any) => {
          setError(err.message || "Something went wrong");
        },
      }
    );
  };

  // ------------------------
  // UI
  // ------------------------
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Create Booking</h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* USER INFO */}
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

        {/* CAPACITY FILTER */}
        <input
          name="capacity"
          placeholder="Required capacity (e.g. 2, 4, 6)"
          value={(form as any).capacity || ""}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        {/* CABIN SELECT */}
        <select
          name="cabin_id"
          value={form.cabin_id}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Select cabin</option>

          {!isLoading &&
            filteredCabins.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name} - ${c.price_per_night}/night
              </option>
            ))}
        </select>

        {/* DATES */}
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

        {/* PRICING */}
        {pricing && (
          <div className="bg-gray-100 p-4 rounded space-y-1">
            <p>Nights: {pricing.nights}</p>
            <p>Base: ${pricing.base}</p>
            <p>Discount: {pricing.discount}%</p>
            <p className="font-bold text-indigo-600">
              Total: ${pricing.total}
            </p>
          </div>
        )}

        {/* BUTTONS */}
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