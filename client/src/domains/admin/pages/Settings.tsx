import SettingsForm from "../components/settings/SettingsForm";

const Settings = () => {
  return (
    <div className="space-y-6 animate-slide-up pb-2 px-2 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
        <p 
          className="text-sky-500 text-lg font-bold"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          System Configuration
        </p>
        <h1 className="text-2xl
          md:text-3xl
          font-black
          text-slate-900
          dark:text-white
          tracking-tighter

          mt-0">Global Preferences</h1>
        <p className="text-xs
          md:text-sm
          text-slate-500
          dark:text-slate-400
          max-w-lg
          leading-relaxed

          mt-0">
          Manage operational rules, booking constraints, and hotel-wide policies.
        </p>
      </div>
      </div>

      <SettingsForm />
    </div>
  );
};

export default Settings;
