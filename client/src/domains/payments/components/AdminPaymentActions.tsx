import { useState } from "react";
import { paymentService } from "../services/paymentService";

interface Props {
    bookingId: string;
    currentStatus: string;
    amount: number;
}

const AdminPaymentActions = ({ bookingId, currentStatus, amount }: Props) => {
    const [loading, setLoading] = useState(false);

    const markPaid = async () => {
        setLoading(true);
        try {
            await paymentService.markAsPaidAtReception(bookingId, amount);
            alert("Marked as Paid");
        } finally {
            setLoading(false);
        }
    };

    const markPending = async () => {
        setLoading(true);
        try {
            await paymentService.markAsPending(bookingId);
            alert("Marked as Pending");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            {currentStatus !== "paid" && (
                <button
                    onClick={markPaid}
                    disabled={loading}
                    className="px-3 py-1 rounded bg-emerald-600 text-white text-xs"
                >
                    Mark Paid
                </button>
            )}

            {currentStatus === "paid" && (
                <button
                    onClick={markPending}
                    disabled={loading}
                    className="px-3 py-1 rounded bg-yellow-500 text-white text-xs"
                >
                    Revert Pending
                </button>
            )}
        </div>
    );
};

export default AdminPaymentActions;