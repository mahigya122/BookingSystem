import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { CreditCard, KeyRound, Loader2, ArrowLeft } from "lucide-react";
import { paymentService } from "./paymentService";

const EsewaPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const bookingId = searchParams.get("bookingId");
  const amount = Number(searchParams.get("amount") || 0);
  const method = searchParams.get("method") || "esewa";
  const isAdmin = searchParams.get("isAdmin") === "true";

  const [esewaId, setEsewaId] = useState("9841234567");
  const [mpin, setMpin] = useState("1234");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!bookingId) {
      toast.error("Invalid transaction: Missing Booking ID");
      navigate(isAdmin ? "/admin" : "/");
    }
  }, [bookingId, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingId) return;

    if (!esewaId.trim() || !mpin.trim()) {
      toast.error("Please enter eSewa ID and MPIN");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Processing simulated eSewa payment...");

    try {
      await paymentService.updatePayment({
        bookingId,
        status: method === "esewa_deposit" ? "down-paid" : "paid",
        method: method as any,
        amount,
        transactionId: `ESEWA-${Date.now()}`,
      });

      toast.success("Payment completed successfully (Simulated)!", { id: toastId });
      navigate(`/payment/success?bookingId=${bookingId}${isAdmin ? "&isAdmin=true" : ""}`);
    } catch (err: any) {
      toast.error(err.message || "Simulated payment failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    toast.error("Payment cancelled");
    navigate(`/payment/failure?bookingId=${bookingId}${isAdmin ? "&isAdmin=true" : ""}`);
  };

  return (
    <div className="flex-grow flex items-center justify-center bg-slate-100 dark:bg-slate-950 px-4 py-12 min-h-[80vh]">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/55 dark:border-slate-800 overflow-hidden">
        <div className="bg-[#60bb46] px-8 py-6 text-white text-center relative">
          <h1 className="text-3xl font-black tracking-tight flex items-center justify-center gap-1">
            <span className="bg-white text-[#60bb46] px-2 py-0.5 rounded-lg text-2xl font-black">e</span>sewa
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest mt-1 opacity-90">Mock Payment Gateway</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-5 border border-slate-100 dark:border-slate-800/80 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold uppercase">Merchant</span>
              <span className="text-slate-700 dark:text-slate-250 font-black">Antigravity Retreats</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-bold uppercase">Booking Reference</span>
              <span className="text-slate-700 dark:text-slate-250 font-mono font-bold truncate max-w-[180px]">{bookingId}</span>
            </div>
            <div className="border-t border-slate-200/60 dark:border-slate-800 pt-3 flex justify-between items-center">
              <span className="text-sm font-black text-slate-800 dark:text-white">Amount to Pay</span>
              <span className="text-xl font-black text-[#60bb46]">${amount.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <CreditCard size={12} className="text-[#60bb46]" />
                eSewa ID (Mobile Number)
              </label>
              <input
                type="text"
                value={esewaId}
                onChange={(e) => setEsewaId(e.target.value)}
                placeholder="98********"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#60bb46]/50 dark:text-white"
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <KeyRound size={12} className="text-[#60bb46]" />
                eSewa MPIN / Password
              </label>
              <input
                type="password"
                value={mpin}
                onChange={(e) => setMpin(e.target.value)}
                placeholder="****"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#60bb46]/50 dark:text-white"
                disabled={loading}
              />
            </div>

            <div className="text-[10px] text-slate-400 leading-normal flex items-start gap-2 bg-yellow-500/5 dark:bg-yellow-500/10 border border-yellow-500/10 rounded-2xl p-3.5 mt-2">
              <span className="text-xs">⚠️</span>
              <p className="font-semibold text-yellow-600 dark:text-yellow-400">
                This is a secure developer sandbox simulated checkout page. Clicking the bypass button below will mock-approve the transaction instantly.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#60bb46] hover:bg-[#52a03c] text-white font-black py-4 px-6 rounded-full shadow-lg shadow-[#60bb46]/20 flex items-center justify-center gap-2 cursor-pointer transition active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Complete Payment (Bypass)
                </>
              )}
            </button>
          </form>

          <button
            onClick={handleCancel}
            disabled={loading}
            className="w-full py-2.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-500 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <ArrowLeft size={14} />
            Cancel Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default EsewaPayment;
