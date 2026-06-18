import { useState, useEffect } from "react";
import { useBookings } from "@shared/hooks";
import { usePagination } from "@shared/hooks/usePagination";
import { CreditCard, Search, ChevronLeft, ChevronRight } from "lucide-react";
import PaymentStatusBadge from "../../payments/components/PaymentStatusBadge";
import AdminPaymentActions from "../../payments/components/AdminPaymentActions";

const PaymentsPage = () => {
  const { bookings = [], isLoading } = useBookings();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.guests?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
  } = usePagination(filteredBookings, 10);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, setCurrentPage]);

  if (isLoading) return <div className="p-8 text-center">Loading payments...</div>;

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

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search guest or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all w-64 text-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all cursor-pointer"
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
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Booking ID</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Guest</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Method</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {paginatedData.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-5">
                    <span className="font-mono text-xs font-bold text-slate-400">#{booking.id.slice(0, 8)}</span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-slate-900 dark:text-white">{booking.guests?.full_name}</p>
                    <p className="text-xs text-slate-400">{booking.guests?.email}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold">{new Date(booking.created_at || '').toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-black text-slate-900 dark:text-white">${booking.total_price}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{booking.payment_method || 'N/A'}</span>
                  </td>
                  <td className="px-8 py-5">
                    <PaymentStatusBadge status={booking.payment_status || 'pending'} />
                  </td>
                  <td className="px-8 py-5 text-right">
                    <AdminPaymentActions
                      bookingId={booking.id}
                      currentStatus={booking.payment_status || 'pending'}
                      bookingStatus={booking.status}
                      amount={booking.total_price}
                    />
                  </td>
                </tr>
              ))}

              {paginatedData.length === 0 && (
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
