import type { Booking } from "../../types/booking";

interface Props {
  booking: Booking;
  onClose: () => void;
}

const BookingDetailModal = ({
  booking,
  onClose,
}: Props) => {
  const nights = Math.ceil(
    (new Date(booking.end_date).getTime() -
      new Date(booking.start_date).getTime()) /
      (1000 * 60 * 60 * 24)
    );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
                Booking Details
            </h2>

        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        </div>

         {/* GUEST */}
        <div className="space-y-1">
        <h3 className="text-lg font-semibold">
            Guest Details
        </h3>

        <p>
            Name: {booking.guests?.full_name}
        </p>

        <p>
            Email: {booking.guests?.email}
        </p>
        </div>

         {/* CABIN */}
         <div className="space-y-1">
            <h3 className="font-semibold text-lg">
            Cabin Details
          </h3>

          <p>
            Cabin: {booking.cabins?.name}
          </p>

          <p>
            Price/Night: ${booking.cabins?.price_per_night}
          </p>
         </div>

         {/* BOOKING */}
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">
            Booking Info
          </h3>

          <p>
            Start Date:{" "}
            {new Date(
              booking.start_date
            ).toLocaleDateString()}
          </p>

          <p>
            End Date:{" "}
            {new Date(
              booking.end_date
            ).toLocaleDateString()}
          </p>

          <p>
            Nights: {nights}
          </p>

          <p>
            Status: {booking.status}
          </p>

          <p>
            Breakfast: {""}
            {booking.has_breakfast ? "Included" : "Not Included"}
         </p>

        <p className="font-semibold text-indigo-600">
            Total Price: ${booking.total_price}
          </p>
        </div>

        </div>
        </div>
  );
};
export default BookingDetailModal;