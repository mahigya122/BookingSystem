import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { supabase } from "../../services/supabase";
import FlippingBook from "./FlippingBook";

type Props = {
  forcedRole?: "admin" | "user";
};

const LoginWrapper = ({ forcedRole }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminApp = window.location.pathname.startsWith("/admin");
  const role = forcedRole || (isAdminApp ? "admin" : "user");

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

      // If we're in the admin app (basename /admin), we should stay there
      if (isAdminApp) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    };

    void restoreSession();
  }, [navigate, isAdminApp]);

  const handleLoginSuccess = (result: any) => {
    const resolvedRole = result?.user?.role;

    if (resolvedRole === 'guest') {
      const from = (location.state as any)?.from || '/';
      navigate(from, { replace: true });
      return;
    }

    if (resolvedRole === 'admin') {
      // If we're already in the admin app (basename /admin), use root /dashboard
      navigate(isAdminApp ? '/dashboard' : '/admin/dashboard', { replace: true });
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
        navigate('/admin/login'); // This will hit the loader in router.tsx
      } else {
        navigate('/login'); // Within admin app basename
      }
    }
  };

  return <FlippingBook role={role} onRoleChange={handleRoleChange} onLoginSuccess={handleLoginSuccess} hideToggle={!!forcedRole} />;
};

export default LoginWrapper;
