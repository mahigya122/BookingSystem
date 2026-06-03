import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

import { supabase } from "../../services/supabase";
import FlippingBook from "./FlippingBook";

const LoginWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isUserPath = location.pathname.includes("/user");
  const role = isUserPath ? "user" : "admin";

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

      navigate('/user/explore', { replace: true });
    };

    void restoreSession();
  }, [navigate]);

  const handleLoginSuccess = (result: any) => {
    const resolvedRole = result?.user?.role;

    if (resolvedRole === 'guest') {
      const from = (location.state as any)?.from || '/user/explore';
      navigate(from, { replace: true });
      return;
    }

    if (resolvedRole === 'admin') {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    toast.error("Could not determine the account role. Please check the profile role in Supabase.");
  };

  const handleRoleChange = (nextRole: 'admin' | 'user') => {
    if (nextRole === 'user') {
      navigate('/user/login');
    } else {
      navigate('/admin/login');
    }
  };

  return <FlippingBook role={role} onRoleChange={handleRoleChange} onLoginSuccess={handleLoginSuccess} />;
};

export default LoginWrapper;
