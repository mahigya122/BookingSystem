import type { FC } from "react";

export type PaymentMethod =
    | "arrival"
    | "esewa";

interface Props {
    method: PaymentMethod,
    selected: boolean,
    onClick: () => void,
}

const labels: Record<PaymentMethod, string> = {
    "arrival": "Pay on Arrival",
    "esewa": "eSewa",
};

const icons: Record<PaymentMethod, string> = {
    arrival: "🏨",
    esewa: "🟢",
};

const PaymentMethodCard: FC<Props> = ({ method, selected, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition
        ${selected
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                }
      `}
        >
            <span className="text-xl">{icons[method]}</span>
            <span className="font-semibold text-sm">{labels[method]}</span>
        </button>
    );
};
export default PaymentMethodCard;
