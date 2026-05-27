import { useEffect, useState } from "react";
import { useSettings, useUpdateSettings } from "../../../shared/auth_hooks";

const SettingsForm = () => {
  const { settings, isLoading } = useSettings();
  const { editSettings, isPending } = useUpdateSettings();

  const [minBooking, setMinBooking] = useState(1);
  const [maxBooking, setMaxBooking] = useState(30);
  const [maxGuests, setMaxGuests] = useState(8);
  const [breakfastPrice, setBreakfastPrice] = useState(12);

  useEffect(() => {
    if (settings) {
      setMinBooking(settings.min_booking_length);
      setMaxBooking(settings.max_booking_length);
      setMaxGuests(settings.max_guests_per_booking);
      setBreakfastPrice(settings.breakfast_price);
    }
  }, [settings]);

  const handleSave = () => {
    editSettings({
        min_booking_length: minBooking,
        max_booking_length: maxBooking,
        max_guests_per_booking: maxGuests,
        breakfast_price: breakfastPrice,
    });
  };

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading system settings...</p>;
  }

  return (
    <div className="max-w-4xl">
        <div className="card">
            <div className="card-header">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Hotel Operational Rules</h2>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Policy</span>
            </div>

            <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-0.5">
                                Minimum Stay (Nights)
                            </label>
                            <input 
                                type="number"
                                value={minBooking}
                                onChange={(e) => setMinBooking(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-0.5">
                                Maximum Stay (Nights)
                            </label>
                            <input
                                type="number"
                                value={maxBooking}
                                onChange={(e) => setMaxBooking(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-0.5">
                                Max Guests per Booking
                            </label>
                            <input
                                type="number"
                                value={maxGuests}
                                onChange={(e) => setMaxGuests(Number(e.target.value))}
                                className="w-full" 
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-0.5">
                                Breakfast Surcharge ($)
                            </label>
                            <input
                                type="number"
                                value={breakfastPrice}
                                onChange={(e) => setBreakfastPrice(Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button
                        disabled={isPending}
                        onClick={handleSave}
                        className="btn btn-primary px-8"
                    >
                        {isPending ? "Applying Changes..." : "Synchronize Settings"}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SettingsForm;
