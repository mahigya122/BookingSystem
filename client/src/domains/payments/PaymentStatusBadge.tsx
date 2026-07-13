import type { FC } from "react";
import type { PaymentStatus } from "./payment.types";

interface Props {
    status: PaymentStatus;
    paymentMethod?: string;
}

const PaymentStatusBadge: FC<Props> = ({ status, paymentMethod }) => {
    let label = status as string;
    let className = "bg-slate-100 text-slate-700 border-slate-300";

    if (status === "pending") {
        label = "Pending";
        className = "bg-yellow-100 text-yellow-700 border-yellow-300";
    } else if (status === "refunded") {
        label = "Refunded";
        className = "bg-rose-100 text-rose-700 border-rose-300";
    } else if (status === "down-paid" || (status === "paid" && paymentMethod === "esewa_deposit")) {
        label = "Down-Paid";
        className = "bg-sky-100 text-sky-700 border-sky-300";
    } else if (status === "paid" || status === "fully_paid") {
        label = "Paid";
        className = "bg-emerald-100 text-emerald-700 border-emerald-300";
    }

    return (
        <span className={`px-2 py-1 text-xs font-bold rounded-lg border ${className}`}
        >
            {label}
        </span>
    );
};

export default PaymentStatusBadge;
