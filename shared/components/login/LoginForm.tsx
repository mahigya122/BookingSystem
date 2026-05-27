import { useState } from "react";
import { useLogin } from "../../auth_hooks";

type Props = {
    role?: 'admin' | 'user';
    onLoginSuccess?: () => void;
};

const LoginForm = ({ role = 'admin', onLoginSuccess }: Props) => {
    const { login, isPending } = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please enter both email and password");
            return;
        }

        login(
            { email, password },
            {
                onError: (err: unknown) => {
                    setError(err instanceof Error ? err.message : "Login failed");
                },
                onSuccess: () => {
                    // Delegate redirect to parent via callback so routing decisions
                    // (admin vs guest) live in the page component.
                    onLoginSuccess?.();
                },
            }
        );
    };

    const isUser = role === 'user';

    return (
        <div className="w-full max-w-md">
            <div className="mb-8 space-y-3">
                <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                    {isUser ? 'Guest access' : 'Admin access'}
                </div>
                <div>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{isUser ? 'Welcome back' : 'Manage everything in one place'}</h2>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {isUser
                            ? 'Sign in to see your bookings, personal details, and stay history.'
                            : 'Sign in to handle bookings, guests, cabins, and operations from a single dashboard.'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 animate-shake">
                        {error}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="ml-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Email Address
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isUser ? 'hello@delisas.com' : 'admin@hotelflow.com'}
                        className="w-full"
                    />
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-4">
                        <label className="ml-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                            Password
                        </label>

                        <button
                            type="button"
                            className="text-[11px] font-semibold text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-200"
                            onClick={() => setError('')}
                        >
                            Forgot password?
                        </button>
                    </div>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={isUser ? 'Enter password' : 'Enter password'}
                        className="w-full"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full rounded-2xl bg-emerald-700 py-3.5 font-semibold text-white shadow-lg shadow-emerald-900/15 transition-all duration-300 hover:bg-emerald-800 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isPending ? "Signing you in..." : isUser ? 'Sign in' : 'Sign in'}
                </button>
            </form>

            <div className="mt-8 border-t border-slate-200/70 pt-6 text-center dark:border-slate-800">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {isUser ? 'Need help? Contact support or create an account.' : 'Admin access is restricted to authorized staff.'}
                </p>
            </div>
        </div>
    );
};

export default LoginForm;