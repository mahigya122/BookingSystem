import type { FC } from "react";
import type { PaymentStatus } from "./payment.types";

interface Props {
    status: PaymentStatus;
    paymentMethod?: string;
}

const PaymentStatusBadge: FC<Props> = ({ status, paymentMethod }) => {
    let label = status === "paid" ? "Paid" : status === "fully_paid" ? "Fully Paid" : status;
    let className = "bg-emerald-100 text-emerald-700 border-emerald-300";

    if (status === "pending") {
        label = "Pending";
        className = "bg-yellow-100 text-yellow-700 border-yellow-300";
    } else if (status === "refunded") {
        label = "Refunded";
        className = "bg-rose-100 text-rose-700 border-rose-300";
    } else if (status === "paid" && paymentMethod === "esewa_deposit") {
        label = "Deposit Paid";
        className = "bg-sky-100 text-sky-705 border-sky-350";
    } else if (status === "fully_paid") {
        label = "Fully Paid";
        className = "bg-emerald-100 text-emerald-850 border-emerald-450";
    } else if (status === "paid" && paymentMethod === "esewa_full") {
        label = "Fully Paid";
        className = "bg-emerald-100 text-emerald-750 border-emerald-400";
    }

    return (
        <span className={`px-2 py-1 text-xs font-bold rounded-lg border ${className}`}
        >
            {label}
        </span>
    );
};

export default PaymentStatusBadge;
