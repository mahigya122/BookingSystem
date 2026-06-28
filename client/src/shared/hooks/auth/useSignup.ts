import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "@shared/services/apiAuth";

export function useSignup() {
    const { mutate: signup, isPending } = useMutation({
        mutationFn: signupApi,
        onError: (err: Error) => {
            console.error("Signup error:", err.message);
        },
    });

    return { signup, isPending };
}