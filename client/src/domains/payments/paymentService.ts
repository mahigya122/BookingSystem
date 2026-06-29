import { fetchJson } from "../../shared/services/http";
import type { PaymentUpdatePayload } from "./payment.types";

export const paymentService = {
    async updatePayment({
        bookingId,
        status,
        method,
        amount,
        transactionId,
    }: PaymentUpdatePayload) {
        return fetchJson<{ booking: any }>(`/bookings/${encodeURIComponent(bookingId)}`, {
            method: "PATCH",
            body: JSON.stringify({
                payment_status: status,
                payment_method: method,
                payment_amount: amount ?? null,
                transaction_id: transactionId ?? null,
                paid_at: status === "paid" ? new Date().toISOString() : null,
            }),
        });
    },

    async markAsPaidAtReception(bookingId: string, amount: number) {
        return this.updatePayment({
            bookingId,
            status: "paid",
            method: "arrival",
            amount,
            transactionId: `CASH-${Date.now()}`,
        });
    },

    async markAsPending(bookingId: string) {
        return this.updatePayment({
            bookingId,
            status: "pending",
            method: "arrival",
        });
    },

    async markAsRefunded(bookingId: string) {
        return this.updatePayment({
            bookingId,
            status: "refunded",
            method: "arrival",
        });
    },
};