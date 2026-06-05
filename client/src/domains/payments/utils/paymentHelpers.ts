import type { PaymentMethod, PaymentStatus } from "../types/payment.types";

export const PaymentStatusLabel = (
    status: PaymentStatus
) => {
    switch (status) {
        case "paid":
            return "Paid";

        case "pending":
            return "Pending";

        case "refunded":
            return "Refunded";

        default:
            return status;
    }

};
export const paymentMethodLabel = (
    method: PaymentMethod
) => {
    switch (method) {
        case "arrival":
            return "Pay On Arrival";

        case "cash":
            return "Cash";

        case "visa":
            return "Visa";

        case "mastercard":
            return "Mastercard";

        case "fonepay":
            return "Fonepay";

        case "esewa":
            return "eSewa";

        default:
            return method;
    }
};
