/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useBookings } from "@shared/hooks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PaymentStatusBadge from "../../payments/PaymentStatusBadge";
import AdminPaymentActions from "../../payments/AdminPaymentActions";

import type { SortType } from "@shared/types/booking";

const PaymentsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortType>("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const sortOptions = [
    { value: "recent", label: "Recent" },
    { value: "earlier", label: "Earlier" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "price-low", label: "Price: Low to High" },
  ] as const;

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending" },
    { value: "refunded", label: "Refunded" },
  ] as const;

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
    sortBy,
    searchTerm,
    statusFilter
  );

  const totalPages = Math.ceil(totalCount / 10);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);



  return (
    <div className="space-y-6 animate-slide-up pb-2 pt-2 px-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
        <div>
          <p
        className="text-sky-500 text-sm font-bold block"
        style={{ fontFamily: "'Dancing Script', cursive" }}
      >
        Payment Management
      </p>
          <h1 className="text-2xl
          md:text-3xl
          font-black
          text-slate-900
          dark:text-white
          tracking-tighter
          mt-0 ">
            Payments
          </h1>
          <p className="text-xs
          md:text-sm
          text-slate-500
          dark:text-slate-400
          max-w-lg
          leading-relaxed
          mt-0  ">
            Monitor and manage all transaction records
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="Search guest or ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full sm:w-64 outline-none transition-all text-xs font-bold focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 placeholder-slate-500"
              style={{
                backgroundColor: "#F4F0FF",
                color: "#374151",
                borderColor: "#E4D9FF",
                borderWidth: "1px",
                borderStyle: "solid",
                height: "32px",
                borderRadius: "9999px",
                paddingTop: "0px",
                paddingBottom: "0px",
                paddingLeft: "16px",
                paddingRight: "16px",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.02)"
              }}
            />
          </div>

          {/* SORT DROPDOWN */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => {
                setSortOpen(!sortOpen);
                setStatusOpen(false);
              }}
              className="font-bold text-xs outline-none transition-all cursor-pointer w-full sm:w-auto flex items-center justify-between gap-2 px-3.5 h-8 bg-[#E2F8E9] text-[#374151] border border-[#C2F0CD] hover:bg-[#D4F6DF] rounded-full active:scale-95 shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
            >
              <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
              <span className={`text-[9px] text-[#4B5563] transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {sortOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                <div 
                  className="absolute right-0 z-50 mt-1.5 w-full sm:w-48 overflow-hidden rounded-2xl border border-[#C2F0CD] bg-[#E2F8E9] shadow-xl animate-in fade-in zoom-in-95 duration-150"
                >
                  {sortOptions.map((opt) => {
                    const isSelected = sortBy === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all border-b last:border-0 border-[#C2F0CD]/40 flex items-center justify-between ${
                          isSelected 
                            ? "bg-[#C6F0D1] text-[#166534]" 
                            : "text-[#374151] hover:bg-[#D4F6DF]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* STATUS DROPDOWN */}
          <div className="relative w-full sm:w-auto">
            <button
              onClick={() => {
                setStatusOpen(!statusOpen);
                setSortOpen(false);
              }}
              className="font-bold text-xs outline-none transition-all cursor-pointer w-full sm:w-auto flex items-center justify-between gap-2 px-3.5 h-8 bg-[#E2F8E9] text-[#374151] border border-[#C2F0CD] hover:bg-[#D4F6DF] rounded-full active:scale-95 shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
            >
              <span>{statusOptions.find(o => o.value === statusFilter)?.label}</span>
              <span className={`text-[9px] text-[#4B5563] transition-transform duration-200 ${statusOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {statusOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setStatusOpen(false)} />
                <div 
                  className="absolute right-0 z-50 mt-1.5 w-full sm:w-48 overflow-hidden rounded-2xl border border-[#C2F0CD] bg-[#E2F8E9] shadow-xl animate-in fade-in zoom-in-95 duration-150"
                >
                  {statusOptions.map((opt) => {
                    const isSelected = statusFilter === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setStatusFilter(opt.value);
                          setStatusOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all border-b last:border-0 border-[#C2F0CD]/40 flex items-center justify-between ${
                          isSelected 
                            ? "bg-[#C6F0D1] text-[#166534]" 
                            : "text-[#374151] hover:bg-[#D4F6DF]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-emerald-50/50 dark:bg-emerald-950/30 border-b border-emerald-100/50 dark:border-emerald-900/20">
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
        <div className="px-2 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
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
