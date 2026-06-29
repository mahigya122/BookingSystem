import { useProfile } from "../../hooks/useProfile";
import { User, Mail, Shield, Loader2, Lock, Camera, Compass } from "lucide-react";
import { useScrollToTop } from "@shared/hooks/useScrollToTop";
import { useNavigate } from "react-router-dom";
import { useCabinFiltersContext } from "../cabins/contexts/CabinFiltersContext";

const ClientProfile = () => {
  const {
    user, fullName, setFullName, phone, setPhone,
    password, setPassword, confirmPassword, setConfirmPassword,
    loading, saving, updatingPassword, save, updatePass
  } = useProfile();

  const navigate = useNavigate();
  const { setIsSearching } = useCabinFiltersContext();

  const handleSaveProfile = (e: React.FormEvent) => { e.preventDefault(); save(); };
  const handleUpdatePassword = (e: React.FormEvent) => { e.preventDefault(); updatePass(); };

  const handleViewTrips = () => {
    setIsSearching(false);
    navigate("/bookings");
  };

  const containerRef = useScrollToTop();

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

          .profile-root {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            min-height: 100vh;
            background: #f5f5f7;
            padding: 48px 24px 80px;
            -webkit-font-smoothing: antialiased;
          }

          .dark .profile-root { background: #09090b; }

          .profile-inner { max-width: 860px; margin: 0 auto; }

          .page-eyebrow {
            font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
            text-transform: uppercase; color: #6e6e73; margin-bottom: 6px;
          }

          .page-title {
            font-size: clamp(20px, 4vw, 34px); font-weight: 700;
            letter-spacing: -0.03em; line-height: 1.1; color: #1d1d1f; margin: 0 0 6px;
          }

          .dark .page-title { color: #f5f5f7; }

          .page-header { margin-bottom: 40px; }

          .profile-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }

          @media (min-width: 780px) {
            .profile-grid { grid-template-columns: 260px 1fr; gap: 24px; }
          }

          .glass-card {
            background: rgba(255,255,255,0.82);
            backdrop-filter: blur(24px) saturate(180%);
            -webkit-backdrop-filter: blur(24px) saturate(180%);
            border: 1px solid rgba(0,0,0,0.06);
            border-radius: 20px; overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.05);
          }

          .dark .glass-card {
            background: rgba(28,28,30,0.88); border-color: rgba(255,255,255,0.07);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 12px 40px rgba(0,0,0,0.2);
          }

          .identity-card { padding: 32px 24px; text-align: center; }

          .avatar-circle-skeleton { width: 88px; height: 88px; border-radius: 50%; margin: 0 auto 20px; }

          .divider { height: 1px; background: rgba(0,0,0,0.06); margin: 24px 0; }

          .dark .divider { background: rgba(255,255,255,0.06); }

          .meta-row { display: flex; align-items: center; gap: 12px; text-align: left; }

          .meta-icon-skeleton { width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0; }

          .section-header {
            padding: 24px 24px 20px; border-bottom: 1px solid rgba(0,0,0,0.05);
            display: flex; align-items: center; gap: 16px;
          }

          .dark .section-header { border-bottom-color: rgba(255,255,255,0.05); }

          .section-icon-skeleton { width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0; }

          .form-body { padding: 24px; }

          .field-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 24px; }

          @media (min-width: 580px) { .field-grid { grid-template-columns: 1fr 1fr; } }

          .premium-input-skeleton { height: 48px; border-radius: 12px; width: 100%; }

          .btn-accent-skeleton { height: 44px; border-radius: 12px; width: 120px; margin-left: auto; }
        `}</style>
        <div className="profile-root">
          <div className="profile-inner">
            <div className="page-header space-y-2 animate-pulse">
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-4 w-80 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>

            <div className="profile-grid">
              <div>
                <div className="glass-card identity-card flex flex-col items-center">
                  <div className="avatar-circle-skeleton bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-3" />
                  <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                  <div className="divider w-full" />
                  <div className="meta-row w-full px-2">
                    <div className="meta-icon-skeleton bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-2.5 w-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="w-full mt-4 h-11 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                </div>
              </div>

              <div className="right-col space-y-6">
                <div className="glass-card">
                  <div className="section-header">
                    <div className="section-icon-skeleton bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="space-y-1.5 flex-grow">
                      <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                      <div className="h-3 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="form-body space-y-6">
                    <div className="field-grid">
                      <div className="space-y-2">
                        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="premium-input-skeleton bg-slate-200 dark:bg-slate-800 animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="premium-input-skeleton bg-slate-200 dark:bg-slate-800 animate-pulse" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="btn-accent-skeleton bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="glass-card">
                  <div className="section-header">
                    <div className="section-icon-skeleton bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    <div className="space-y-1.5 flex-grow">
                      <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                      <div className="h-3 w-60 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="form-body space-y-6">
                    <div className="field-grid">
                      <div className="space-y-2">
                        <div className="h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="premium-input-skeleton bg-slate-200 dark:bg-slate-800 animate-pulse" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                        <div className="premium-input-skeleton bg-slate-200 dark:bg-slate-800 animate-pulse" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="btn-accent-skeleton bg-slate-200 dark:bg-slate-800 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        .profile-root {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          min-height: 100vh;
          background: #f5f5f7;
          padding: 48px 24px 80px;
          -webkit-font-smoothing: antialiased;
        }

        .dark .profile-root { background: #09090b; }

        .profile-inner { max-width: 860px; margin: 0 auto; }

        .page-eyebrow {
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: #6e6e73; margin-bottom: 6px;
        }

        .page-title {
          font-size: clamp(20px, 4vw, 34px); font-weight: 700;
          letter-spacing: -0.03em; line-height: 1.1; color: #1d1d1f; margin: 0 0 6px;
        }

        .page-sub { font-size: 14px; color: #6e6e73; font-weight: 400; margin: 0; }

        .dark .page-title { color: #f5f5f7; }
        .dark .page-sub { color: #8d8d92; }

        .page-header { margin-bottom: 40px; }

        .profile-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }

        @media (min-width: 780px) {
          .profile-grid { grid-template-columns: 260px 1fr; gap: 24px; }
        }

        .glass-card {
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.05);
          transition: box-shadow 0.3s ease;
        }

        .dark .glass-card {
          background: rgba(28,28,30,0.88); border-color: rgba(255,255,255,0.07);
          box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 12px 40px rgba(0,0,0,0.2);
        }

        .identity-card { padding: 32px 24px; text-align: center; }

        .avatar-wrap { position: relative; display: inline-block; margin-bottom: 20px; }

        .avatar-circle {
          width: 88px; height: 88px; border-radius: 50%;
          background: linear-gradient(145deg, #e8f4fd, #dbeafe);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto; border: 3px solid rgba(255,255,255,0.9);
          box-shadow: 0 4px 20px rgba(59,130,246,0.15);
        }

        .dark .avatar-circle {
          background: linear-gradient(145deg, #1e3a5f, #1e3a8a);
          border-color: rgba(255,255,255,0.08);
        }

        .avatar-edit-btn {
          position: absolute; bottom: 0; right: 0;
          width: 28px; height: 28px; border-radius: 50%;
          background: #1d1d1f; border: 2px solid #f5f5f7;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: transform 0.2s ease;
        }

        .avatar-edit-btn:hover { transform: scale(1.1); }

        .dark .avatar-edit-btn { background: #f5f5f7; border-color: #1c1c1e; }
        .dark .avatar-edit-btn svg { color: #1d1d1f; }

        .identity-name {
          font-size: 18px; font-weight: 700; letter-spacing: -0.02em;
          color: #1d1d1f; margin: 0 0 6px;
        }

        .dark .identity-name { color: #f5f5f7; }

        .role-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 12px; border-radius: 100px;
          background: rgba(59,130,246,0.08); color: #1d6fb4;
          font-size: 10.5px; font-weight: 700;
          letter-spacing: 0.09em; text-transform: uppercase;
        }

        .dark .role-pill { background: rgba(59,130,246,0.15); color: #60a5fa; }

        .divider { height: 1px; background: rgba(0,0,0,0.06); margin: 24px 0; }

        .dark .divider { background: rgba(255,255,255,0.06); }

        .meta-row { display: flex; align-items: center; gap: 12px; text-align: left; }

        .meta-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(0,0,0,0.04);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .dark .meta-icon { background: rgba(255,255,255,0.05); }

        .meta-label {
          font-size: 10px; font-weight: 600; color: #8e8e93;
          letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 2px;
        }

        .meta-value { font-size: 13px; font-weight: 500; color: #1d1d1f; word-break: break-all; }

        .dark .meta-value { color: #f5f5f7; }

        /* ── Trips button ── */
        .trips-btn-card {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; margin-top: 20px; padding: 12px 0;
          border-radius: 14px;
          border: 1.5px solid rgba(59,130,246,0.2);
          background: rgba(59,130,246,0.05);
          color: #1d6fb4;
          font-family: inherit; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
        }

        .trips-btn-card:hover {
          background: rgba(59,130,246,0.1);
          border-color: rgba(59,130,246,0.35);
          transform: translateY(-1px);
        }

        .trips-btn-card:active { transform: translateY(0); }

        .dark .trips-btn-card {
          border-color: rgba(59,130,246,0.25);
          background: rgba(59,130,246,0.08);
          color: #60a5fa;
        }
        .dark .trips-btn-card:hover {
          background: rgba(59,130,246,0.15);
          border-color: rgba(59,130,246,0.4);
        }

        /* ── Right col ── */
        .right-col { display: flex; flex-direction: column; gap: 20px; }

        .section-header {
          display: flex; align-items: center; gap: 12px;
          padding: 20px 24px; border-bottom: 1px solid rgba(0,0,0,0.05);
          background: rgba(0,0,0,0.01);
        }

        .dark .section-header {
          border-bottom-color: rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.01);
        }

        .section-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: #1d1d1f;
          display: flex; align-items: center; justify-content: center;
        }

        .dark .section-icon { background: rgba(255,255,255,0.1); }

        .section-title { font-size: 15px; font-weight: 700; letter-spacing: -0.01em; color: #1d1d1f; }

        .dark .section-title { color: #f5f5f7; }

        .section-desc { font-size: 12px; color: #8e8e93; margin-top: 1px; }

        .form-body { padding: 24px; }

        .field-grid { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 24px; }

        @media (min-width: 560px) { .field-grid { grid-template-columns: 1fr 1fr; } }

        .field-label {
          display: block; font-size: 11.5px; font-weight: 600; color: #6e6e73;
          letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 8px;
        }

        .premium-input {
          width: 100%; box-sizing: border-box; height: 48px; padding: 0 16px;
          border-radius: 12px; border: 1.5px solid rgba(0,0,0,0.09);
          background: rgba(255,255,255,0.7); font-family: inherit;
          font-size: 14px; font-weight: 500; color: #1d1d1f; outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          -webkit-appearance: none;
        }

        .premium-input::placeholder { color: #b0b0b5; font-weight: 400; }

        .premium-input:focus {
          border-color: #1d1d1f; background: #fff;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
        }

        .dark .premium-input {
          border-color: rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04); color: #f5f5f7;
        }
        .dark .premium-input:focus {
          border-color: rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.04);
        }
        .dark .premium-input::placeholder { color: #48484a; }

        .form-footer { display: flex; justify-content: flex-end; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 0 22px; height: 44px; border-radius: 100px; border: none;
          background: #1d1d1f; color: #f5f5f7; font-family: inherit;
          font-size: 13.5px; font-weight: 600; letter-spacing: -0.01em;
          cursor: pointer; transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.14);
        }

        .btn-primary:hover {
          background: #3a3a3c; transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(0,0,0,0.18);
        }

        .btn-primary:active { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.45; cursor: default; transform: none; }

        .dark .btn-primary {
          background: #f5f5f7; color: #1d1d1f;
          box-shadow: 0 2px 12px rgba(255,255,255,0.06);
        }
        .dark .btn-primary:hover {
          background: #e8e8ed;
          box-shadow: 0 4px 20px rgba(255,255,255,0.08);
        }

        .btn-accent {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 0 22px; height: 44px; border-radius: 100px; border: none;
          background: linear-gradient(135deg, #3b82f6, #1d6fb4); color: #fff;
          font-family: inherit; font-size: 13.5px; font-weight: 600; letter-spacing: -0.01em;
          cursor: pointer; transition: opacity 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
          box-shadow: 0 2px 16px rgba(59,130,246,0.35);
        }

        .btn-accent:hover {
          opacity: 0.9; transform: translateY(-1px);
          box-shadow: 0 4px 24px rgba(59,130,246,0.45);
        }

        .btn-accent:active { transform: translateY(0); }
        .btn-accent:disabled { opacity: 0.4; cursor: default; transform: none; }
      `}</style>

      <div ref={containerRef as React.RefObject<HTMLDivElement>} className="profile-root">
        <div className="profile-inner">

          <div className="page-header">
            <p className="page-eyebrow">Account</p>
            <h1 className="page-title">Your Profile</h1>
            <p className="page-sub">Manage your personal information and security.</p>
          </div>

          <div className="profile-grid">

            {/* ── Identity card ── */}
            <div>
              <div className="glass-card identity-card">
                <div className="avatar-wrap">
                  <div className="avatar-circle">
                    <User size={38} strokeWidth={1.4} color="#3b82f6" />
                  </div>
                  <button className="avatar-edit-btn" aria-label="Change photo">
                    <Camera size={12} color="#f5f5f7" />
                  </button>
                </div>

                <p className="identity-name">{fullName || "Your Name"}</p>

                <span className="role-pill">
                  <Shield size={10} />
                  {user?.role || "Guest"}
                </span>

                <div className="divider" />

                <div className="meta-row">
                  <div className="meta-icon">
                    <Mail size={16} color="#8e8e93" strokeWidth={1.6} />
                  </div>
                  <div>
                    <p className="meta-label">Email</p>
                    <p className="meta-value">{user?.email || "—"}</p>
                  </div>
                </div>

                <button className="trips-btn-card" onClick={handleViewTrips}>
                  <Compass size={15} strokeWidth={1.8} />
                  View My Trips
                </button>
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="right-col">

              <div className="glass-card">
                <div className="section-header">
                  <div className="section-icon">
                    <User size={17} color="#f5f5f7" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="section-title">Personal Information</p>
                    <p className="section-desc">Update your name and contact details</p>
                  </div>
                </div>
                <form onSubmit={handleSaveProfile} className="form-body">
                  <div className="field-grid">
                    <div>
                      <label className="field-label">Full Name</label>
                      <input
                        className="premium-input"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="field-label">Phone Number</label>
                      <input
                        className="premium-input"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                  <div className="form-footer">
                    <button type="submit" disabled={saving} className="btn-accent">
                      {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="glass-card">
                <div className="section-header">
                  <div className="section-icon">
                    <Lock size={17} color="#f5f5f7" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="section-title">Password & Security</p>
                    <p className="section-desc">Choose a strong password, at least 6 characters</p>
                  </div>
                </div>
                <form onSubmit={handleUpdatePassword} className="form-body">
                  <div className="field-grid">
                    <div>
                      <label className="field-label">New Password</label>
                      <input
                        type="password"
                        className="premium-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className="field-label">Confirm Password</label>
                      <input
                        type="password"
                        className="premium-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div className="form-footer">
                    <button type="submit" disabled={updatingPassword} className="btn-primary">
                      {updatingPassword ? <><Loader2 size={15} className="animate-spin" /> Updating…</> : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientProfile;