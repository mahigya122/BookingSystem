import { useProfile } from "../hooks/useProfile";

const ClientProfile = () => {
  const {
    user,
    fullName,
    setFullName,
    phone,
    setPhone,
    loading,
    saving,
    save
  } = useProfile();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    save();
  };

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
        Client Profile
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Signed in as {user?.email ?? "guest"} ({user?.role ?? "guest"}). Profile updates should only affect this account.
      </p>

      <div className="card space-y-4 p-5">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This page is ready for profile and password updates.
        </p>
      </div>

      <form onSubmit={handleSave} className="card space-y-4 p-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
            placeholder="Enter your phone number"
          />
        </div>

        <button
          type="submit"
          disabled={saving || loading}
          className="rounded-xl bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default ClientProfile;
