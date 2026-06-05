import { useState } from "react";
import PaymentMethodCard from "./PaymentMethodCard";
import type { PaymentMethod } from "./PaymentMethodCard";

interface Props {
    onSelect: (method: PaymentMethod) => void;
}

const Methods: PaymentMethod[] = [
    "arrival",
    "visa",
    "mastercard",
    "fonepay",
    "esewa",
];

const PaymentSelector = ({ onSelect }: Props) => {
    const [selected, setSelected] = useState<PaymentMethod | null>(null);

    const handleSelect = (method: PaymentMethod) => {
        setSelected(method);
        onSelect(method);
    };

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase traking-wider text-slate-500">
                Choose Payment Method
            </h3>

            <div className="grid gap-2">
                {Methods.map((m) => (
                    <PaymentMethodCard
                        key={m}
                        method={m}
                        selected={selected === m}
                        onClick={() => handleSelect(m)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PaymentSelector;