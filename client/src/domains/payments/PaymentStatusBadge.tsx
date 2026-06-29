import type { FC } from "react";
import type { PaymentStatus } from "./payment.types";


interface Props {
    status: PaymentStatus;
}

const statusConfig: Record<
    PaymentStatus,
    { label: string; className: string }
> = {
    pending: {
        label: "Pending",
        className: "bg-yellow-100 text-yellow-700 border-yellow-300",
    },
    paid: {
        label: "Paid",
        className: "bg-emerald-100 text-emerald-700 border-emerald-300",
    },
    refunded: {
        label: "refunded",
        className: "bg-rose-100 text-rose-700 border-rose-300",
    },
};

const PaymentStatusBadge: FC<Props> = ({ status }) => {
    const config = statusConfig[status];
    return (
        <span className={`px-2 py-1 text-xs font-bold rounded-lg border ${config.className}`}
        >
            {config.label}
        </span>
    );
};

export default PaymentStatusBadge;
