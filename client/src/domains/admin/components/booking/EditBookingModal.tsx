import { useMemo, useState } from "react";
import type { Booking } from "@shared/types/booking";
import { useUpdateBooking } from "@shared/auth_hooks";
import type { PaymentStatus, PaymentMethod } from "../../../payments/types/payment.types";

interface Props {
  booking: Booking;
  onClose: () => void;
}

const EditBookingModal = ({ booking, onClose} : Props) => {
  const { editBooking, isPending } = useUpdateBooking();

  const [startDate, setStartDate] = useState(booking.start_date);
  const [endDate, setEndDate] = useState(booking.end_date);
  const [status, setStatus] = useState<Booking["status"]>(booking.status);
  const [hasBreakfast, setHasBreakfast] = useState(booking.has_breakfast);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(booking.payment_status || "pending");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(booking.payment_method || "arrival");

// PRICE CALCULATION
const Pricing = useMemo(() => {
    if ( !startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const nights = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) return null;

    const cabinPrice = booking.cabins?.price_per_night || 0;
  const breakfastPrice = hasBreakfast ? nights * 12 : 0;
    const total = Math.round(cabinPrice * nights + breakfastPrice);

     return{
        nights,
        total,
        breakfastPrice,
     };
    }, [startDate, endDate, booking, hasBreakfast]
);
  // SAVE
  const handleSave = () => {
    if (!Pricing) return;

    editBooking(
      {
        id: booking.id,
        start_date: startDate,
        end_date: endDate,
        total_price: Pricing.total,
        has_breakfast: hasBreakfast,
        status,
        payment_status: paymentStatus,
        payment_method: paymentMethod,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  // UI
  return (
     <div className="modal-overlay">

      <div className="modal-content w-full max-w-lg space-y-5 p-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Edit Booking
          </h2>

          <button
            onClick={onClose}
            className="btn btn-ghost h-9 w-9 p-0"
          >
            ✕
          </button>
        </div>

        {/* GUEST */}
        <div>
          <p className="text-sm text-gray-500">
            Guest
          </p>

          <p className="font-semibold">
            {booking.guests?.full_name}
          </p>
        </div>

        {/* DATES */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="text-sm text-gray-600">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(e.target.value)
              }
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(e.target.value)
              }
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

        </div>

        {/* STATUS */}
        <div>
          <label className="text-sm text-gray-600">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as Booking["status"])
            }
            className="w-full border rounded-lg p-2 mt-1"
          >
            <option value="booked">
              booked
            </option>

            <option value="checked-in">
              checked-in
            </option>

            <option value="checked-out">
              checked-out
            </option>

            <option value="cancelled">
              cancelled
            </option>
          </select>
        </div>

        <div className="flex items-center gap-3">
        <input
         type="checkbox"
         checked={hasBreakfast}
         onChange={(e) =>
         setHasBreakfast(e.target.checked)
        }
        />

       <label>
          Include Breakfast
       </label>
       </div>

        {/* PAYMENT METHOD */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value as PaymentMethod)
              }
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="arrival">arrival</option>
              <option value="esewa">esewa</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600">
              Payment Status
            </label>
            <select
              value={paymentStatus}
              onChange={(e) =>
                setPaymentStatus(e.target.value as PaymentStatus)
              }
              className="w-full border rounded-lg p-2 mt-1"
            >
              <option value="pending">pending</option>
              <option value="paid">paid</option>
            </select>
          </div>
        </div>

        {/* PRICING */}
        {Pricing && (
          <div className="surface-panel rounded-xl p-4 space-y-1">

            <p>
              Nights: {" "}
              <span className="font-semibold">
                {Pricing.nights}
              </span>
            </p>

            <p>
              Total Price: {" "}
              <span className="font-bold text-indigo-600">
                ${Pricing.total}
              </span>
            </p>

          </div>
        )}

        {/* BUTTONS */}
        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="btn btn-secondary px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={isPending}
            onClick={handleSave}
            className="btn btn-primary px-4 py-2"
          >
            {isPending ? "Saving..." : "Save"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default EditBookingModal;