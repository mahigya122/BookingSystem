import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { login as loginApi } from "@shared/services/apiAuth";
import type { AuthUser } from "@shared/types/auth";

type LoginResponse = Awaited<ReturnType<typeof loginApi>>;

export function useLogin() {
    const queryClient = useQueryClient();

    const { mutate: login, isPending } = useMutation({
        mutationFn: loginApi,

        onSuccess: (data: LoginResponse) => {
            // Only set the user data here. Navigation is delegated to the
            // caller so the page can decide where to route (admin vs guest).
            queryClient.setQueryData<AuthUser | null>(["user"], data.user);
        },

        onError: (err: Error) => {
            console.error("Login error:", err.message);
        },
    });

    return { login, isPending };
}