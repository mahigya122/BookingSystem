import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { logout as logoutApi } from "@shared/services/apiAuth";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const loginPath = location.pathname.startsWith("/admin") ? "/admin/login" : "/user/login";

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutApi,

    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      navigate(loginPath, { replace: true });
    },

    onError: (err: Error) => {
      console.error("Logout error:", err.message);
    },
  });

  return { logout, isPending };
}