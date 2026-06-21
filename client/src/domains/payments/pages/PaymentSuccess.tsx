import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Calendar, CreditCard, Home, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "../../../shared/services/supabase";
import type { Booking } from "../../../shared/types/booking";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error: dbError } = await supabase
          .from("bookings")
          .select("*, cabins(name)")
          .eq("id", bookingId)
          .single();

        if (dbError) throw dbError;
        setBooking(data);
      } catch (err: any) {
        console.error("Error fetching booking on success page:", err);
        setError(err.message || "Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-transparent py-12">
        <Loader2 className="w-12 h-12 text-sky-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-zinc-400 font-bold animate-pulse">Verifying payment details...</p>
      </div>
    );
  }

  const formattedStartDate = booking?.start_date
    ? new Date(booking.start_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const formattedEndDate = booking?.end_date
    ? new Date(booking.end_date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="flex-grow flex items-center justify-center bg-transparent px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-sky-100/50 dark:border-zinc-800 p-8 text-center animate-fade-in relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto w-20 h-20 bg-sky-50 dark:bg-sky-950/30 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-sky-100/50 dark:border-sky-900/30">
          <CheckCircle2 className="w-10 h-10 text-sky-550 animate-bounce" style={{ animationDuration: '2s' }} />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-zinc-100 tracking-tight mb-2">
          Payment Successful!
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 mb-6 font-semibold">
          Thank you! Your cabin booking is confirmed.
        </p>

        {error && (
          <p className="text-sm text-rose-500 mb-4 bg-rose-50 dark:bg-rose-955/20 p-3 rounded-xl">
            {error}
          </p>
        )}

        {booking && (
          <div className="bg-slate-50 dark:bg-zinc-800/30 rounded-2xl p-5 mb-8 text-left border border-slate-100 dark:border-zinc-800/80 space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200/60 dark:border-zinc-700/60">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-0.5">Cabin</p>
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-200">
                  {booking.cabins?.name || "Premium Cabin"}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-0.5">Amount Paid</p>
                <p className="text-lg font-black text-sky-650 dark:text-sky-400">
                  Rs. {booking.total_price.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">Check In</p>
                  <p className="font-semibold text-slate-700 dark:text-zinc-300">{formattedStartDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 dark:text-zinc-500">Check Out</p>
                  <p className="font-semibold text-slate-700 dark:text-zinc-300">{formattedEndDate}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm pt-3 border-t border-slate-200/60 dark:border-zinc-700/60">
              <CreditCard className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
              <div className="w-full min-w-0">
                <p className="text-xs text-slate-400 dark:text-zinc-500">Transaction ID</p>
                <p className="font-mono text-xs font-medium text-slate-600 dark:text-zinc-400 truncate select-all">
                  {booking.transaction_id || "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Link
            to="/bookings"
            className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-bold shadow-md shadow-sky-200/50 dark:shadow-none hover:shadow-sky-300/40 transition-all duration-300 transform hover:-translate-y-0.5 group cursor-pointer"
          >
            Go to My Bookings
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-350 font-bold transition-all duration-300 border border-slate-100 dark:border-zinc-800 hover:-translate-y-0.5 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
