import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService } from "./paymentService";
import toast from "react-hot-toast";
import { Loader2, Check, RotateCcw, Eye, Edit, Calendar, X } from "lucide-react";
import InvoiceModal from "../../shared/modals/InvoiceModal";
import EditPaymentModal from "./EditPaymentModal";
import ModifyStayModal from "./ModifyStayModal";

interface Props {
    booking: any;
    bookingId: string;
    currentStatus: string;
    bookingStatus?: string;
    amount: number;
}

const AdminPaymentActions = ({ booking, bookingId, currentStatus, bookingStatus, amount }: Props) => {
    const queryClient = useQueryClient();
    const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isModifyOpen, setIsModifyOpen] = useState(false);

    const { mutate: markPaid, isPending: isPaying } = useMutation({
        mutationFn: () => paymentService.markAsPaidAtReception(bookingId, amount),
        onSuccess: () => {
            toast.success("Payment marked as paid");
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

    const { mutate: cancelPending, isPending: isCancellingPending } = useMutation({
        mutationFn: () => paymentService.editPaymentDetails({
            bookingId: bookingId,
            status: "cancelled",
            payment_status: "refunded"
        }),
        onSuccess: () => {
            toast.success("Pending booking successfully cancelled");
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
        onError: (err: any) => toast.error(err.message || "Failed to cancel booking"),
    });

    const loading = isPaying || isRefundings || isCancellingPending;

    // Standard button classes for alignment and height consistency
    const viewBtnClass =
        "flex items-center justify-center gap-1.5 px-3 py-1.5 h-[32px] min-w-[75px] rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 transition-all cursor-pointer select-none";

    const editBtnClass =
        "flex items-center justify-center gap-1.5 px-3 py-1.5 h-[32px] min-w-[75px] rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-md cursor-pointer select-none";

    const reviewCancelBtnClass =
        "flex items-center justify-center gap-1.5 px-3 py-1.5 h-[32px] min-w-[100px] rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-md cursor-pointer select-none animate-pulse";

    const settleBtnClass =
        "flex items-center justify-center gap-1.5 px-3 py-1.5 h-[32px] min-w-[100px] rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer select-none";

    const refundBtnClass =
        "flex items-center justify-center gap-1.5 px-3 py-1.5 h-[32px] min-w-[75px] rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-md disabled:opacity-50 cursor-pointer select-none";

    if (currentStatus === "refunded") return (
        <div className="flex justify-end gap-2">
            <button
                onClick={() => setIsInvoiceOpen(true)}
                className={viewBtnClass}
            >
                <Eye size={12} strokeWidth={3} />
                View
            </button>
            {isInvoiceOpen && (
                <InvoiceModal
                    booking={booking}
                    onClose={() => setIsInvoiceOpen(false)}
                />
            )}
        </div>
    );

    return (
        <div className="flex justify-end gap-2 items-center">
            {currentStatus === "pending" && (
                <>
                    <button
                        onClick={() => markPaid()}
                        disabled={loading}
                        className={settleBtnClass}
                    >
                        {isPaying ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} strokeWidth={3} />}
                        Mark Paid
                    </button>
                    {bookingStatus === "cancelling" && (
                        <button
                            onClick={() => cancelPending()}
                            disabled={loading}
                            className={refundBtnClass}
                        >
                            {isCancellingPending ? <Loader2 size={12} className="animate-spin" /> : <X size={12} strokeWidth={3} />}
                            Cancel
                        </button>
                    )}
                </>
            )}

            {currentStatus === "down-paid" && bookingStatus !== "cancelled" && (
                <>
                    <button
                        onClick={() => setIsInvoiceOpen(true)}
                        className={viewBtnClass}
                    >
                        <Eye size={12} strokeWidth={3} />
                        View
                    </button>
                    <button
                        onClick={() => setIsEditOpen(true)}
                        className={bookingStatus === "cancelling" ? reviewCancelBtnClass : editBtnClass}
                    >
                        {bookingStatus === "cancelling" ? <RotateCcw size={12} strokeWidth={3} /> : <Edit size={12} strokeWidth={3} />}
                        {bookingStatus === "cancelling" ? "Review Cancel" : "Edit"}
                    </button>
                    {isInvoiceOpen && (
                        <InvoiceModal
                            booking={booking}
                            onClose={() => setIsInvoiceOpen(false)}
                        />
                    )}
                    {isEditOpen && (
                        <EditPaymentModal
                            booking={booking}
                            onClose={() => setIsEditOpen(false)}
                        />
                    )}
                </>
            )}

            {currentStatus === "paid" && bookingStatus !== "cancelled" && (
                <>
                    <button
                        onClick={() => setIsInvoiceOpen(true)}
                        className={viewBtnClass}
                    >
                        <Eye size={12} strokeWidth={3} />
                        View
                    </button>
                    {bookingStatus !== "checked-out" && (
                        <button
                            onClick={() => setIsModifyOpen(true)}
                            className={bookingStatus === "cancelling" ? reviewCancelBtnClass : editBtnClass}
                        >
                            {bookingStatus === "cancelling" ? <RotateCcw size={12} strokeWidth={3} /> : <Calendar size={12} strokeWidth={3} />}
                            {bookingStatus === "cancelling" ? "Review Cancel" : "Modify"}
                        </button>
                    )}
                    {isInvoiceOpen && (
                        <InvoiceModal
                            booking={booking}
                            onClose={() => setIsInvoiceOpen(false)}
                        />
                    )}
                    {isModifyOpen && (
                        <ModifyStayModal
                            booking={booking}
                            onClose={() => setIsModifyOpen(false)}
                        />
                    )}
                </>
            )}

            {currentStatus === "paid" && bookingStatus === "cancelled" && (
                <>
                    <button
                        onClick={() => setIsInvoiceOpen(true)}
                        className={viewBtnClass}
                    >
                        <Eye size={12} strokeWidth={3} />
                        View
                    </button>
                    <button
                        onClick={() => markRefunded()}
                        disabled={loading}
                        className={refundBtnClass}
                    >
                        {isRefundings ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} strokeWidth={3} />}
                        Refund
                    </button>
                    {isInvoiceOpen && (
                        <InvoiceModal
                            booking={booking}
                            onClose={() => setIsInvoiceOpen(false)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default AdminPaymentActions;
