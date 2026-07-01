export type PaymentStatus =
    | "pending"
    | "paid"
    | "fully_paid"
    | "refunded";

export type PaymentMethod =
    | "arrival"
    | "esewa"
    | "esewa_deposit"
    | "esewa_full";

export interface PaymentUpdatePayload {
    bookingId: string;
    status: PaymentStatus;
    method: PaymentMethod;
    amount?: number;
    transactionId?: string;
}
