import SettingsForm from "../components/settings/SettingsForm";

const Settings = () => {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Configuration</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage global hotel settings and booking rules.</p>
      </div>

      <SettingsForm />
    </div>
  );
};

export default Settings;
