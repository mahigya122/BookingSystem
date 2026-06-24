/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useBookings } from "@shared/hooks";
import { CreditCard, Search, ChevronLeft, ChevronRight } from "lucide-react";
import PaymentStatusBadge from "../../payments/components/PaymentStatusBadge";
import AdminPaymentActions from "../../payments/components/AdminPaymentActions";

const PaymentsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const { bookings = [], totalCount = 0, isLoading } = useBookings(
    currentPage,
    10,
    "all",
    "recent",
    searchTerm,
    statusFilter
  );

  const totalPages = Math.ceil(totalCount / 10);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);



  return (
    <div className="px-6 md:px-0 space-y-6 animate-slide-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <CreditCard className="h-10 w-10 text-emerald-600" />
            Payments
          </h1>
          <p className="text-slate-500 font-bold mt-1 uppercase text-xs tracking-widest">
            Monitor and manage all transaction records
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search guest or ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all w-full sm:w-64 text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 w-32 text-left">Booking ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Guest</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Amount</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Method</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right w-44">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-8 py-5 text-left w-32">
                        <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                      </td>
                      <td className="px-8 py-5 text-left">
                        <div className="space-y-1">
                           <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                           <div className="h-3 w-36 bg-slate-100 dark:bg-slate-900/50 animate-pulse rounded" />
                        </div>
                      </td>
                      <td className="px-8 py-5 text-left">
                        <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                      </td>
                      <td className="px-8 py-5 text-left">
                        <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                      </td>
                      <td className="px-8 py-5 text-left">
                        <div className="h-4 w-12 bg-slate-200 dark:bg-slate-800 animate-pulse rounded" />
                      </td>
                      <td className="px-8 py-5 text-left">
                        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full" />
                      </td>
                      <td className="px-8 py-5 text-right w-44">
                        <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 animate-pulse rounded ml-auto" />
                      </td>
                    </tr>
                  ))
                : bookings.map((booking: any) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-8 py-5 text-left w-32">
                        <span className="font-mono text-xs font-bold text-slate-400">#{booking.id.slice(0, 8)}</span>
                      </td>
                      <td className="px-8 py-5 text-left">
                        <p className="font-bold text-slate-900 dark:text-white">{booking.guests?.full_name}</p>
                        <p className="text-xs text-slate-400">{booking.guests?.email}</p>
                      </td>
                      <td className="px-8 py-5 text-left">
                        <p className="text-sm font-bold">{new Date(booking.created_at || '').toLocaleDateString()}</p>
                      </td>
                      <td className="px-8 py-5 text-left">
                        <span className="font-black text-slate-900 dark:text-white">${booking.total_price}</span>
                      </td>
                      <td className="px-8 py-5 text-left">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{booking.payment_method || 'N/A'}</span>
                      </td>
                      <td className="px-8 py-5 text-left">
                        <PaymentStatusBadge status={booking.payment_status || 'pending'} />
                      </td>
                      <td className="px-8 py-5 text-right w-44">
                        <AdminPaymentActions
                          bookingId={booking.id}
                          currentStatus={booking.payment_status || 'pending'}
                          bookingStatus={booking.status}
                          amount={booking.total_price}
                        />
                      </td>
                    </tr>
                  ))}

              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-bold">
                    No payment records found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Showing Page {currentPage} <span className="mx-1 text-slate-300 dark:text-slate-700">/</span> {totalPages}
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary py-1.5 px-3 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft size={14} />
              Prev
            </button>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary py-1.5 px-3 text-[10px] font-black uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
