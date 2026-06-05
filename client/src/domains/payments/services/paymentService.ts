import { supabase } from "../../../shared/services/supabase";
import type { PaymentUpdatePayload } from "../types/payment.types";

export const paymentService = {
    async updatePayment({
        bookingId,
        status,
        method,
        amount,
        transactionId,
    }: PaymentUpdatePayload) {
        const { data, error } = await supabase
            .from("bookings")
            .update({
                payment_status: status,
                payment_method: method,
                payment_amount: amount ?? null,
                transaction_id: transactionId ?? null,
                paid_at: status === "paid" ? new Date().toISOString() : null,
            })
            .eq("id", bookingId)
            .select()
            .single();

        if (error) throw error;

        return data;
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
};