import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { login as loginApi } from "../../../src/services/apiAuth";

type LoginResponse = Awaited<ReturnType<typeof loginApi>>;

export function useLogin() {
    const queryClient = useQueryClient();

    const { mutate: login, isPending } = useMutation({
        mutationFn: loginApi,

        onSuccess: (data: LoginResponse) => {
            // Only set the user data here. Navigation is delegated to the
            // caller so the page can decide where to route (admin vs guest).
            queryClient.setQueryData(["user"], data.user);
        },

        onError: (err: Error) => {
            console.error("Login error:", err.message);
        },
    });

    return { login, isPending };
}