import { useEffect, useState } from "react";
import { useSettings } from "../../authentication/useSettings";
import { useUpdateSettings } from "../../authentication/useUpdateSettings";

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
    return <p className="text-sm text-slate-500">Loading settings...</p>;
  }

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 rounded-2xl bg-white p-8 shadow">

        <div> 
        <h2 className="text-2xl font-bold"> Update Hotel Seetings </h2>
         <p className="text-gray-500 mt-1">
          Manage booking limitations and pricing
        </p>
      </div>

       {/* MIN BOOKING */}
       <div>
        <label className="block text-sm font-medium mb-2">
        Minimum nights/booking
        </label>

        <input 
        type= "number"
        value= {minBooking}
        onChange={(e) => 
            setMinBooking(
                Number(e.target.value))}
        className="w-full border rounded-xl p-3"
        />
        </div>

        {/* MAX BOOKING */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Maximum nights/booking
        </label>

        <input
          type="number"
          value={maxBooking}
          onChange={(e) =>
            setMaxBooking(
              Number(e.target.value)
            )
          }
          className="w-full border rounded-xl p-3"
        />
      </div>

      {/* MAX GUEST */}
      <div>
        <label className= "block text-sm font-medium mb-2">
            maximum guests/booking
        </label>

        <input
        type="number"
        value={maxGuests}
        onChange= {(e) => 
            setMaxGuests(
                Number(e.target.value))}
        className="w-full border rounded-xl p-3" 
        />
        </div>

    {/* BREAKFAST */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Breakfast price
        </label>

        <input
          type="number"
          value={breakfastPrice}
          onChange={(e) =>
            setBreakfastPrice(
              Number(e.target.value)
            )
          }
          className="w-full border rounded-xl p-3"
        />
      </div>

      {/* BUTTON */}
      <button
      disabled={isPending}
      onClick={handleSave}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl"
      >
        { isPending
        ? "Updating..."
        : "Save Changes"
        }        
        </button>
      </div>
    );
};
export default SettingsForm;  