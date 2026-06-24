/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useSettings, useUpdateSettings } from "@shared/hooks";
import type { Settings } from "@shared/types/settings";

const SettingsForm = () => {
    const { settings, isLoading } = useSettings();

    if (!settings && !isLoading) return null;

    return (
        <SettingsFormInner
            settings={settings}
            isLoading={isLoading}

        />
    );
};

const SettingsFormInner = ({
    settings,
    isLoading,
}: {
    settings: Settings | undefined;
    isLoading: boolean;
}) => {
    const { editSettings, isPending } = useUpdateSettings();

    const [minBooking, setMinBooking] = useState(settings?.min_booking_length ?? 0);
    const [maxBooking, setMaxBooking] = useState(settings?.max_booking_length ?? 0);
    const [maxGuests, setMaxGuests] = useState(settings?.max_guests_per_booking ?? 0);
    const [breakfastPrice, setBreakfastPrice] = useState(settings?.breakfast_price ?? 0);

    useEffect(() => {
        if (settings) {
            setMinBooking(settings.min_booking_length ?? 0);
            setMaxBooking(settings.max_booking_length ?? 0);
            setMaxGuests(settings.max_guests_per_booking ?? 0);
            setBreakfastPrice(settings.breakfast_price ?? 0);
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

                                {isLoading ? (
                                    <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                ) : (
                                    <input
                                        type="number"
                                        value={minBooking}
                                        onChange={(e) => setMinBooking(Number(e.target.value))}
                                        className="w-full"
                                    />
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-0.5">
                                    Maximum Stay (Nights)
                                </label>

                                {isLoading ? (
                                    <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                ) : (
                                    <input
                                        type="number"
                                        value={maxBooking}
                                        onChange={(e) => setMaxBooking(Number(e.target.value))}
                                        className="w-full"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-0.5">
                                    Max Guests per Booking
                                </label>

                                {isLoading ? (
                                    <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                ) : (
                                    <input
                                        type="number"
                                        value={maxGuests}
                                        onChange={(e) => setMaxGuests(Number(e.target.value))}
                                        className="w-full"
                                    />
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-0.5">
                                    Breakfast Surcharge ($)
                                </label>

                                {isLoading ? (
                                    <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                                ) : (
                                    <input
                                        type="number"
                                        value={breakfastPrice}
                                        onChange={(e) => setBreakfastPrice(Number(e.target.value))}
                                        className="w-full"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        {isLoading ? (
                            <div className="h-10 w-40 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                        ) : (
                            <button
                                disabled={isPending}
                                onClick={handleSave}
                                className="btn btn-primary px-8"
                            >
                                {isPending ? "Applying Changes..." : "Synchronize Settings"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsForm;
