import { useMutation } from "@tanstack/react-query";
import { signInWithGoogle as googleLoginApi } from "@shared/services/apiAuth";

export function useGoogleLogin() {
    const { mutate: googleLogin, isPending: isGooglePending } = useMutation({
        mutationFn: googleLoginApi,
        onError: (err: Error) => {
            console.error("Google Login error:", err.message);
        },
    });

    return { googleLogin, isGooglePending };
}
