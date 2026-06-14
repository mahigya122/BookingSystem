import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "../services/paymentService";
import toast from "react-hot-toast";
import { Loader2, Check, RotateCcw, Undo2 } from "lucide-react";

interface Props {
    bookingId: string;
    currentStatus: string;
    bookingStatus?: string;
    amount: number;
}

const AdminPaymentActions = ({ bookingId, currentStatus, bookingStatus, amount }: Props) => {
    const queryClient = useQueryClient();

    const { mutate: markPaid, isPending: isPaying } = useMutation({
        mutationFn: () => paymentService.markAsPaidAtReception(bookingId, amount),
        onSuccess: () => {
            toast.success("Payment marked as paid");
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
        onError: (err: any) => toast.error(err.message || "Failed to update payment"),
    });

    const { mutate: markPending, isPending: isReverting } = useMutation({
        mutationFn: () => paymentService.markAsPending(bookingId),
        onSuccess: () => {
            toast.success("Payment reverted to pending");
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
        onError: (err: any) => toast.error(err.message || "Failed to update payment"),
    });

    const { mutate: markRefunded, isPending: isRefundings } = useMutation({
        mutationFn: () => paymentService.markAsRefunded(bookingId),
        onSuccess: () => {
            toast.success("Payment marked as refunded");
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
        onError: (err: any) => toast.error(err.message || "Failed to update payment"),
    });

    const loading = isPaying || isReverting || isRefundings;

    if (currentStatus === "refunded") return (
        <span className="text-[10px] font-black uppercase text-slate-400">Transaction Closed</span>
    );

    return (
        <div className="flex justify-end gap-2">
            {currentStatus === "pending" && (
                <button
                    onClick={() => markPaid()}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer"
                >
                    {isPaying ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} strokeWidth={3} />}
                    Mark Paid
                </button>
            )}

            {currentStatus === "paid" && bookingStatus !== "cancelled" && (
                <button
                    onClick={() => markPending()}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200 dark:border-slate-700 disabled:opacity-50 cursor-pointer"
                >
                    {isReverting ? <Loader2 size={12} className="animate-spin" /> : <Undo2 size={12} strokeWidth={3} />}
                    Revert
                </button>
            )}

            {currentStatus === "paid" && bookingStatus === "cancelled" && (
                <button
                    onClick={() => markRefunded()}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer"
                >
                    {isRefundings ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} strokeWidth={3} />}
                    Refund
                </button>
            )}
        </div>
    );
};

export default AdminPaymentActions;