import { useState } from "react";
import { paymentService } from "./paymentService";
import type { PaymentMethod } from "./payment.types";

export const usePayment = (bookingId: string) => {
    const [loading, setLoading] = useState(false);

    const payNow = async (method: PaymentMethod, amount: number, dynamicBookingId?: string) => {
        const bId = dynamicBookingId || bookingId;
        if (!bId) throw new Error("Booking ID is required for payment");

        setLoading(true);

        try {
            // -------------------------
            // ESEWA FLOW (BACKEND)
            // -------------------------
            if (method === "esewa") {
                // 1. mark booking as pending
                await paymentService.updatePayment({
                    bookingId: bId,
                    status: "pending",
                    method,
                    amount,
                });

                // 2. call backend for signed data (using relative Vite proxy)
                const res = await fetch("/api/esewa/init", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount,
                        bookingId: bId,
                    }),
                });

                const formData = await res.json();

                // 3. create eSewa form
                const form = document.createElement("form");
                form.method = "POST";
                form.action =
                    "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

                Object.entries(formData).forEach(([key, value]) => {
                    const input = document.createElement("input");
                    input.type = "hidden";
                    input.name = key;
                    input.value = String(value);
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();

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