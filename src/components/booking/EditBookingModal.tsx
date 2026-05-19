import { useEffect, useMemo, useState } from "react";
import { useUpdateBooking } from "../../authentication/useUpdateBooking";

interface Props {
  booking: any;
  onClose: () => void;
}

const EditBookingModal = ({ booking, onClose} : Props) => {
  const { editBooking, isPending } = useUpdateBooking();

  const [ startDate, setStartDate ] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");

// INITIALIZE FORM
useEffect(() => {
  if (booking) {
    setStartDate(booking.start_date);
    setEndDate(booking.end_date);
    setStatus(booking.status);
  }
}, [booking]);

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
    const total = Math.round(cabinPrice * nights);

     return{
        nights,
        total,
     };
    }, [startDate, endDate, booking]
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
        status,
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
     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-5">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Edit Booking
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
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
              setStatus(e.target.value)
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
          </select>
        </div>

        {/* PRICING */}
        {Pricing && (
          <div className="bg-gray-100 rounded-xl p-4 space-y-1">

            <p>
              Nights:{" "}
              <span className="font-semibold">
                {Pricing.nights}
              </span>
            </p>

            <p>
              Total Price:{" "}
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
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            disabled={isPending}
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
          >
            {isPending ? "Saving..." : "Save"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default EditBookingModal;