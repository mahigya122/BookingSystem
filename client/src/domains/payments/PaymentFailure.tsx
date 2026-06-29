import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

const PaymentFailure = () => {
  return (
    <div className="flex-grow flex items-center justify-center bg-transparent px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-sky-100/50 dark:border-zinc-800 p-8 text-center animate-fade-in relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mx-auto w-20 h-20 bg-rose-50 dark:bg-rose-950/30 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-rose-100/50 dark:border-rose-900/30 animate-pulse">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-zinc-100 tracking-tight mb-3">
          Payment Failed
        </h1>
        <p className="text-slate-550 dark:text-zinc-400 mb-8 max-w-sm mx-auto font-medium text-sm">
          Your eSewa transaction could not be processed. If any amount was deducted, it will be automatically refunded. Please try again.
        </p>

        <div className="space-y-3">
          <Link
            to="/bookings"
            className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-full bg-slate-900 hover:bg-slate-850 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-bold shadow-md transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Retry from Bookings
          </Link>
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-full bg-slate-50 hover:bg-slate-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-350 font-bold transition-all duration-300 border border-slate-100 dark:border-zinc-800 hover:-translate-y-0.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
