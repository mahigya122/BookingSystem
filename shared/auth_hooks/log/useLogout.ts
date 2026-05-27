import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { logout as logoutApi } from "../../../src/services/apiAuth";

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutApi,

    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      navigate("/login", { replace: true });
    },
    
    onError: (err: Error) => {
      console.error("Logout error:", err.message);
    },
  });

  return { logout, isPending };
}