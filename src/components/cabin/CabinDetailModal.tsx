import type { Cabin } from "../../../shared/types/cabin";
import type { Booking } from "../../../shared/types/booking";

interface Props {
  cabin: Cabin;
  activeBooking: Booking | null;
  onClose: () => void;
}

const CabinDetailModal = ({ cabin, activeBooking, onClose }: Props) => {
    const isBooked = Boolean(activeBooking);

    return (
      <div className="modal-overlay">
        <div className="modal-content w-full max-w-2xl space-y-5 p-6">

                <img 
                 src={cabin.image_url}
                 alt={cabin.name}
                 className="w-full h-72 object-cover rounded-lg"
                />
                <div className="p-6 space-y-5">

                    {/* HEADER */}
          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-3xl font-bold">
                {cabin.name}
              </h2>

              <p className="text-gray-500">
                Capacity: {cabin.capacity} guests
              </p>
            </div>

            <button
              onClick={onClose}
              className="btn btn-ghost h-9 w-9 p-0 text-xl"
            >
              ✕
            </button>

          </div>

          {/* INFO */}
          <div className="grid grid-cols-2 gap-4">

            <div className="surface-panel rounded-xl p-4">
                <p className="text-sm text-gray-500">
                    Price / Night
                </p>

                <p className="text-2xl font-bold">
                    ${cabin.price_per_night}
                </p>
            </div>

            <div className="surface-panel rounded-xl p-4">
              <p className="text-sm text-gray-500">
                Discount
              </p>

              <p className="text-2xl font-bold">
                {cabin.discount || 0}%
              </p>
            </div>

          </div>

          <div className="surface-panel rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-sm text-gray-500">
                Booking Status
              </p>

              <span className={`badge ${isBooked ? "badge-danger" : "badge-success"}`}>
                {isBooked ? "Booked" : "Available"}
              </span>
            </div>

            {isBooked && activeBooking ? (
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  Booked by: {activeBooking.guests?.full_name || "Unknown guest"}
                </p>

                <p className="text-gray-600 dark:text-gray-300">
                  Guest email: {activeBooking.guests?.email || "Not available"}
                </p>

                <p className="text-gray-600 dark:text-gray-300">
                  Booked dates: {new Date(activeBooking.start_date).toLocaleDateString()} - {new Date(activeBooking.end_date).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This cabin is currently available. No active booking is linked to it.
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="font-semibold text-lg mb-2">
              Description
            </h3>

            <p className="text-gray-600 leading-relaxed">
              {cabin.description || "No description available."}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CabinDetailModal;