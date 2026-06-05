import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { logout as logoutApi } from "@shared/services/apiAuth";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isAdminApp = window.location.pathname.startsWith("/admin");

  const logoutRedirect = isAdminApp ? "/login" : "/";

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutApi,

    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });

      // Success notification
      toast.success("Logged out successfully");

      // Redirect
      navigate(logoutRedirect, { replace: true });
    },

    onError: (err: Error) => {
      console.error("Logout error:", err.message);
      toast.error("Failed to logout");
    },
  });

  return { logout, isPending };
}