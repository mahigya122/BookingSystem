/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from "react";
import { useSettings, useUpdateSettings } from "@shared/hooks";
import { useAdminProfile } from "./useAdminProfile";
import type { Settings } from "@shared/types/settings";

const TABS = [
  { id: "rules", label: "Operational Rules" },
  { id: "profile", label: "Admin Profile" },
] as const;

const SettingsForm = () => {
  const { settings, isLoading } = useSettings();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]["id"]>("rules");

  if (!settings && !isLoading) return null;

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-800 p-1 bg-slate-50 dark:bg-slate-900">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "rules" ? (
        <OperationalRulesCard settings={settings} isLoading={isLoading} />
      ) : (
        <AdminProfileCard />
      )}
    </div>
  );
};

const Field = ({
  label,
  isLoading,
  children,
}: {
  label: string;
  isLoading: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ml-0.5">
      {label}
    </label>
    {isLoading ? (
      <div className="h-10 w-full rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
    ) : (
      children
    )}
  </div>
);

const OperationalRulesCard = ({
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
    <div className="card -mt-3">
      <div className="card-header flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Hotel Operational Rules
        </h2>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
          Global Policy
        </span>
      </div>

      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Field label="Minimum Stay (Nights)" isLoading={isLoading}>
              <input
                type="number"
                value={minBooking}
                onChange={(e) => setMinBooking(Number(e.target.value))}
                className="w-full"
              />
            </Field>

            <Field label="Maximum Stay (Nights)" isLoading={isLoading}>
              <input
                type="number"
                value={maxBooking}
                onChange={(e) => setMaxBooking(Number(e.target.value))}
                className="w-full"
              />
            </Field>
          </div>

          <div className="space-y-6">
            <Field label="Max Guests per Booking" isLoading={isLoading}>
              <input
                type="number"
                value={maxGuests}
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                className="w-full"
              />
            </Field>

            <Field label="Breakfast Surcharge ($)" isLoading={isLoading}>
              <input
                type="number"
                value={breakfastPrice}
                onChange={(e) => setBreakfastPrice(Number(e.target.value))}
                className="w-full"
              />
            </Field>
          </div>
        </div>

        <div className="mt-2 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
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
  );
};

const AdminProfileCard = () => {
  const {
    fullName, setFullName,
    email,
    avatarUrl,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    isLoading, isSaving, isUploadingAvatar, isUpdatingPassword,
    error,
    save, uploadPhoto, updatePass,
  } = useAdminProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePickPhoto = () => fileInputRef.current?.click();
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadPhoto(file);
  };

  return (
    <div className="space-y-6 -mt-3">
      {/* Profile identity card */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Admin Profile
          </h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800">
            Account
          </span>
        </div>

        <div className="card-body">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xl font-black text-slate-400">
                    {fullName ? fullName.charAt(0).toUpperCase() : "A"}
                  </span>
                )}
              </div>
              <button
                onClick={handlePickPhoto}
                disabled={isUploadingAvatar}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider"
              >
                {isUploadingAvatar ? "..." : "Change"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Full Name" isLoading={isLoading}>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full"
                />
              </Field>

              <Field label="Email" isLoading={isLoading}>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full opacity-60 cursor-not-allowed"
                />
              </Field>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-xs font-semibold text-rose-500">{error}</p>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              disabled={isSaving || isLoading}
              onClick={save}
              className="btn btn-primary px-8"
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* Password card */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Change Password
          </h2>
        </div>

        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field label="New Password" isLoading={isLoading}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </Field>

            <Field label="Confirm Password" isLoading={isLoading}>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full"
              />
            </Field>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              disabled={isUpdatingPassword || isLoading}
              onClick={updatePass}
              className="btn btn-primary px-8"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsForm;