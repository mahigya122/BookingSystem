import { useState } from "react";
import PaymentSelector from "../components/PaymentSelector";
import CheckoutSummary from "../components/CheckoutSummary";
import { usePayment } from "../hooks/usePayment";
import type { PaymentMethod } from "../types/payment.types";

interface Props {
    bookingId: string;
    cabinName: string;
    nights: number;
    totalPrice: number;
}

const Checkout = ({ bookingId, cabinName, nights, totalPrice }: Props) => {
    const [method, setMethod] = useState<PaymentMethod | null>(null);
    const { loading, payNow, payOnArrival } = usePayment(bookingId);
    const [done, setDone] = useState(false);

    const handleConfirm = async () => {
        if (!method) return;

        if (method === "arrival") {
            await payOnArrival();
        } else {
            await payNow(method, totalPrice);
        }

        setDone(true);
    };

    if (done) {
        return (
            <div className="text-center p-6">
                <h2 className="text-emerald-600 font-bold text-xl">
                    Booking Confirmed
                </h2>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <CheckoutSummary
                cabinName={cabinName}
                nights={nights}
                totalPrice={totalPrice}
            />

            <PaymentSelector onSelect={setMethod} />

            <button
                onClick={handleConfirm}
                disabled={!method || loading}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-50"
            >
                {loading ? "Processing..." : "Confirm Payment"}
            </button>
        </div>
    );
};

export default Checkout;
