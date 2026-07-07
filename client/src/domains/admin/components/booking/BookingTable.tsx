import BookingRow from "./BookingRow";
import type { Booking } from "@shared/types/booking";


interface Props {
  bookings: Booking[];
  onDelete: (id: string) => void;
  onEdit: (booking: Booking) => void;
  onDetails: (booking: Booking) => void;
  isLoading?: boolean;
}

const BookingTable = ({
  bookings,
  onDelete,
  onEdit,
  onDetails,
  isLoading,
}: Props) => {
  return (
    <div className="overflow-x-auto">
      <table>
        <thead>
          <tr className="bg-blue-50/50 dark:bg-blue-950/30 border-b border-blue-100/50 dark:border-blue-900/20">
            <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Guest Name</th>
            <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Unit / Cabin</th>
            <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Check-in</th>
            <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Check-out</th>
            <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
            <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Revenue</th>
            <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Payment</th>
            <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 w-44">Manage</th>
          </tr>
        </thead>

        <tbody>
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-8 py-5 text-left"><div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                  <td className="px-8 py-5 text-left"><div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                  <td className="px-8 py-5 text-left"><div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                  <td className="px-8 py-5 text-left"><div className="h-4 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                  <td className="px-8 py-5 text-left"><div className="h-6 w-16 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                  <td className="px-8 py-5 text-left"><div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                  <td className="px-8 py-5 text-left"><div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" /></td>
                  <td className="px-8 py-5 text-right w-44"><div className="h-8 w-24 rounded bg-slate-200 dark:bg-slate-800 animate-pulse ml-auto" /></td>
                </tr>
              ))
            : bookings.map((booking) => (
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
