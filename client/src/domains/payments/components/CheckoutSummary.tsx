interface props {
    cabinName: string;
    nights: number;
    totalPrice: number;
    currency?: string;
}

const CheckoutSummary = ({
    cabinName,
    nights,
    totalPrice,
    currency = "$",
}: props) => {
    return (
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/60">
            <h3 className="text-sm font-bold mb-3">Booking Summery</h3>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-500">Cabin</span>
                    <span className="font-semibold">{cabinName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Nights</span>
                    <span className="font-semibold">{nights}</span>
                </div>

                <div className="flex justify-between pt-2 border-t">
                    <span className="text-slate-500">Total</span>
                    <span className="font-bold text-emerald-600">
                        {currency}
                        {totalPrice}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSummary;