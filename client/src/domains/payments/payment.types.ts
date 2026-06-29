export type PaymentStatus =
    | "pending"
    | "paid"
    | "refunded";

export type PaymentMethod =
    | "arrival"
    | "esewa";

export interface PaymentUpdatePayload {
    bookingId: string;
    status: PaymentStatus;
    method: PaymentMethod;
    amount?: number;
    transactionId?: string;
}
