import { useNavigate } from "react-router-dom";
import { useState } from "react";

import FlippingBook from "../../shared/components/login/FlippingBook";

const Login = () => {
  const [role, setRole] = useState<'admin' | 'user'>('admin');
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    // Client-side demo redirects. Replace with server-verified role checks later.
    if (role === 'admin') navigate('/dashboard', { replace: true });
    else navigate('/dashboard/profile', { replace: true });
  };

  return <FlippingBook role={role} onRoleChange={setRole} onLoginSuccess={handleLoginSuccess} />;
};

export default Login;