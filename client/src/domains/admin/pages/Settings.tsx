import SettingsForm from "../components/settings/SettingsForm";

const Settings = () => {
  return (
    <div className="space-y-12 animate-slide-up pb-12">
      <div className="space-y-2">
        <p 
          className="text-sky-500 text-lg font-bold"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          System Configuration ✨
        </p>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Global Preferences</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
          Manage operational rules, booking constraints, and hotel-wide policies.
        </p>
      </div>

      <SettingsForm />
    </div>
  );
};

export default Settings;
