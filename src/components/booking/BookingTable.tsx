import BookingRow from "./BookingRow";

import type { Booking } from "../../types/booking";

interface Props {
  bookings: Booking[];

  onDelete: (id: string) => void;

  onEdit: (booking: Booking) => void;
}

const BookingTable = ({
  bookings,
  onDelete,
  onEdit,
}: Props) => {
  return (
    <table className="w-full">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="px-6 py-4 text-left">
            Guest
          </th>

          <th className="px-6 py-4 text-left">
            Cabin
          </th>

          <th className="px-6 py-4 text-left">
            Start Date
          </th>

          <th className="px-6 py-4 text-left">
            End Date
          </th>

          <th className="px-6 py-4 text-left">
            Status
          </th>

          <th className="px-6 py-4 text-left">
            Price
          </th>

          <th className="px-6 py-4 text-left">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {bookings.map((booking) => (
          <BookingRow
            key={booking.id}
            booking={booking}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </tbody>
    </table>
  );
};

export default BookingTable;