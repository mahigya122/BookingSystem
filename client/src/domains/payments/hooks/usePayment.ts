import { useState } from "react";
import { paymentService } from "../services/paymentService";
import type { PaymentMethod } from "../types/payment.types";

export const usePayment = (bookingId: string) => {
    const [loading, setLoading] = useState(false);

    const payNow = async (method: PaymentMethod, amount: number) => {
        setLoading(true);

        try {
            // simulate gateway delay
            await new Promise((r) => setTimeout(r, 1200));

            return await paymentService.updatePayment({
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