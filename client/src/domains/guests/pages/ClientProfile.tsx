import { useProfile } from "../hooks/useProfile";
import { User, Mail, Shield, Loader2 } from "lucide-react";

const ClientProfile = () => {
  const {
    user,
    fullName,
    setFullName,
    phone,
    setPhone,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    saving,
    updatingPassword,
    save,
    updatePass
  } = useProfile();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    save();
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    updatePass();
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Manage your personal information and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Overview */}
        <div className="space-y-6">
          <div className="card p-6 space-y-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <User size={48} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {fullName || "User Account"}
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider mt-2">
                  <Shield size={12} /> {user?.role || "Guest"}
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-slate-400" />
                <div className="flex flex-col">
                  <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Email Address</span>
                  <span className="text-slate-700 dark:text-slate-200 font-bold">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Form */}
          <section className="card overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <User size={20} className="text-emerald-600" /> Personal Information
              </h3>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    Full Name
                  </label>
                  <div className="relative">

                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition font-medium"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    Phone Number
                  </label>
                  <div className="relative">

                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition font-medium"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-emerald-600 px-8 py-3.5 font-black text-white hover:bg-emerald-700 transition shadow-lg shadow-emerald-900/10 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Password Form */}
          <section className="card overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Change Password
              </h3>
            </div>

            <form onSubmit={handleUpdatePassword} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition font-medium"
                      placeholder="At least 6 characters"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition font-medium"
                      placeholder="Repeat new password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updatingPassword}
                  className="rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 font-black hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-lg shadow-slate-900/10 disabled:opacity-50 flex items-center gap-2"
                >
                  {updatingPassword ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
