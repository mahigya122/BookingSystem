export type PaymentStatus =
    | "pending"
    | "paid"
    | "down-paid"
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

export function calculatePayableAmount(method: PaymentMethod, total: number): number {
    return method === "esewa_deposit"
        ? total * 0.2
        : method === "esewa_full"
            ? total * 0.95
            : total;
}

