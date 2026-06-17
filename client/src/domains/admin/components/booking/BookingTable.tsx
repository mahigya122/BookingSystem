import BookingRow from "./BookingRow";
import type { Booking } from "@shared/types/booking";


interface Props {
  bookings: Booking[];

  onDelete: (id: string) => void;
  onEdit: (booking: Booking) => void;
  onDetails: (booking: Booking) => void;
}

const BookingTable = ({
  bookings,
  onDelete,
  onEdit,
  onDetails,
}: Props) => {
  return (
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th>Guest Name</th>
            <th>Unit / Cabin</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Status</th>
            <th>Revenue</th>
            <th>Payment</th>
            <th className="text-right">Manage</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <BookingRow
              key={booking.id}
              booking={booking}
              onDelete={onDelete}
              onEdit={onEdit}
              onDetails={onDetails}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingTable;
