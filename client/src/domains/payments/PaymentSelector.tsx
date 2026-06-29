import PaymentMethodCard from "./PaymentMethodCard";
import type { PaymentMethod } from "./PaymentMethodCard";

interface Props {
    selectedMethod?: string | null;
    onSelect: (method: PaymentMethod) => void;
}

const Methods: PaymentMethod[] = [
    "arrival",
    "esewa",
];

const PaymentSelector = ({ selectedMethod = null, onSelect }: Props) => {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Choose Payment Method
            </h3>

            <div className="grid gap-2">
                {Methods.map((m) => (
                    <PaymentMethodCard
                        key={m}
                        method={m}
                        selected={selectedMethod === m}
                        onClick={() => onSelect(m)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PaymentSelector;
