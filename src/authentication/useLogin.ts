import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { login as loginApi } from "../services/apiAuth";

export function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: login, isPending } = useMutation({
        mutationFn: loginApi,

        onSuccess: (data: any) => {
            queryClient.setQueryData(["user"], data.user);
            navigate("/dashboard", { replace: true });
        },
        
        onError: (err: Error) => {
            console.error("Login error:", err.message);
        },
    });

    return { login, isPending };
}