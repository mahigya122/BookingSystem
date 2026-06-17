import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { supabase } from "../../services/supabase";
import { useUser } from "../../hooks";
import type { AuthUser } from "../../types/auth";
import FlippingBook from "./FlippingBook";

type Props = {
  forcedRole?: "admin" | "user";
};

type LocationState = {
  from?: string;
};

const LoginWrapper = ({ forcedRole }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useUser();

  const isAdminApp = window.location.pathname.startsWith("/admin");
  const role = forcedRole || (isAdminApp ? "admin" : "user");

  // 1. Handle OAuth/Hash session restoration
  useEffect(() => {
    const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";

    if (!hash) {
      return;
    }

    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) {
      return;
    }

    const restoreSession = async () => {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      window.history.replaceState(null, document.title, window.location.pathname + window.location.search);

      if (error) {
        toast.error(error.message);
        return;
      }

      // After session restore, we'll let the second useEffect handle redirection
    };

    void restoreSession();
  }, [navigate, isAdminApp]);

  // 2. Redirect if already authenticated
  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    const resolvedRole = user.role;

    if (resolvedRole === 'admin') {
      // If we are in the root app, we need a full reload to the admin app
      if (!isAdminApp) {
        window.location.href = "/admin/dashboard";
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else if (resolvedRole === 'guest') {
      // If we are in the admin app, we need a full reload to the root app
      if (isAdminApp) {
        window.location.href = "/";
      } else {
        const from = (location.state as LocationState)?.from || '/';
        navigate(from, { replace: true });
      }
    }
  }, [user, isAuthenticated, isLoading, isAdminApp, navigate, location]);

  const handleLoginSuccess = (result: { user: AuthUser }) => {
    const resolvedRole = result?.user?.role;

    if (resolvedRole === 'guest') {
      if (isAdminApp) {
        window.location.href = "/";
      } else {
        const from = (location.state as LocationState)?.from || '/';
        navigate(from, { replace: true });
      }
      return;
    }

    if (resolvedRole === 'admin') {
      if (!isAdminApp) {
        window.location.href = "/admin/dashboard";
      } else {
        navigate('/dashboard', { replace: true });
      }
      return;
    }

    toast.error("Could not determine the account role. Please check the profile role in Supabase.");
  };

  const handleRoleChange = (nextRole: 'admin' | 'user') => {
    if (forcedRole) return;
    if (nextRole === 'user') {
      if (isAdminApp) {
        window.location.href = "/login";
      } else {
        navigate('/login');
      }
    } else {
      if (!isAdminApp) {
        window.location.href = "/admin/login";
      } else {
        navigate('/login');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
          <p className="text-sm font-bold text-slate-500 animate-pulse">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <FlippingBook role={role} onRoleChange={handleRoleChange} onLoginSuccess={handleLoginSuccess} hideToggle={!!forcedRole} />
      
      {/* Session Recovery Tool - Hidden unless manually triggered or for troubleshooting */}
      <button 
        onClick={async () => {
          localStorage.clear();
          await supabase.auth.signOut();
          window.location.reload();
        }}
        className="fixed bottom-4 right-4 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-sky-500 transition-colors opacity-50 hover:opacity-100"
      >
        Troubleshoot: Reset Session
      </button>
    </div>
  );
};

export default LoginWrapper;
