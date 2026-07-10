import { useState } from "react";
import { paymentService } from "./paymentService";
import type { PaymentMethod } from "./payment.types";

export const usePayment = (bookingId: string) => {
    const [loading, setLoading] = useState(false);

    const payNow = async (method: PaymentMethod, amount: number, dynamicBookingId?: string, isAdmin?: boolean) => {
        const bId = dynamicBookingId || bookingId;
        if (!bId) throw new Error("Booking ID is required for payment");

        setLoading(true);

        try {
            // -------------------------
            // ESEWA FLOW (LOCAL MOCK)
            // -------------------------
            if (method.startsWith("esewa")) {
                // 1. mark booking as pending
                await paymentService.updatePayment({
                    bookingId: bId,
                    status: "pending",
                    method,
                    amount,
                });

                // Redirect to the local mock eSewa page
                window.location.href = `/payment/esewa?bookingId=${bId}&amount=${amount}&method=${method}&isAdmin=${!!isAdmin}`;
                return;
            }

            // -------------------------
            // OTHER PAYMENT METHODS
            // -------------------------
            await paymentService.updatePayment({
                bookingId,
                status: "paid",
                method,
                amount,
                transactionId: `TXN-${Date.now()}`,
            });
        } finally {
            setLoading(false);
        }
    };

    const payOnArrival = async () => {
        return paymentService.markAsPending(bookingId);
    };

    return {
        loading,
        payNow,
        payOnArrival,
    };
};