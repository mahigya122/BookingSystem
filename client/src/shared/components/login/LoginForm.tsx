import { useState } from "react";
import { useLogin, useGoogleLogin } from "../../auth_hooks";

import type { AuthUser } from "../../types/auth";

type Props = {
    role?: 'admin' | 'user';
    onLoginSuccess?: (result: { user: AuthUser }) => void;
};

const LoginForm = ({ role = 'admin', onLoginSuccess }: Props) => {
    const { login, isPending } = useLogin();
    const { googleLogin, isGooglePending } = useGoogleLogin();
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
                onSuccess: (data) => {
                    // Delegate redirect to parent via callback so routing decisions
                    // (admin vs guest) live in the page component. Pass the full login result.
                    onLoginSuccess?.(data);
                },
            }
        );
    };

    const isUser = role === 'user';

    return (
        <div className="w-full max-w-md">
            <div className="mb-8 space-y-3">
                <div className="inline-flex rounded-full bg-sky-55/70 dark:bg-sky-950/30 px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-sky-600 dark:text-sky-450 border border-sky-100/40 dark:border-sky-900/20">
                    {isUser ? 'Guest Access ✨' : 'Admin Access ⚙️'}
                </div>
                <div>
                    <p className="text-sky-400 text-lg font-bold" style={{ fontFamily: "'Dancing Script', cursive" }}>
                        {isUser ? 'Your sanctuary awaits...' : 'Welcome back, operator'}
                    </p>
                    <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
                        {isUser ? 'Sign In' : 'Dashboard Control'}
                    </h2>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-650 dark:text-slate-350 font-medium">
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
                    <label className="ml-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                        Email Address
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={isUser ? 'hello@delisas.com' : 'admin@hotelflow.com'}
                        className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-5 py-3.5 text-sm font-semibold outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50 dark:focus:ring-sky-950/20 transition-all duration-200"
                    />
                </div>

                <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-4">
                        <label className="ml-0.5 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                            Password
                        </label>

                        <button
                            type="button"
                            className="text-[11px] font-bold text-sky-500 hover:text-sky-600 transition"
                            onClick={() => setError('')}
                        >
                            Forgot password?
                        </button>
                    </div>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-5 py-3.5 text-sm font-semibold outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-50 dark:focus:ring-sky-950/20 transition-all duration-200"
                    />
                </div>

                <div className="space-y-4">
                    <button
                        type="submit"
                        disabled={isPending || isGooglePending}
                        className="w-full rounded-full bg-gradient-to-r from-sky-400 to-sky-500 py-3.5 font-bold text-white shadow-lg shadow-sky-200 dark:shadow-none hover:-translate-y-0.5 transition-all duration-300 hover:shadow-xl hover:shadow-sky-300/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
                    >
                        {isPending ? "Signing you in..." : isUser ? 'Sign In ✈️' : 'Enter Dashboard ⚙️'}
                    </button>

                    {isUser && (
                        <div className="space-y-4">
                            <div className="relative flex items-center justify-center">
                                <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                                <span className="absolute bg-white px-4 text-[10px] font-black uppercase tracking-widest text-slate-300 dark:bg-slate-950 dark:text-slate-600">
                                    or continue with
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() => googleLogin()}
                                disabled={isPending || isGooglePending}
                                className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-slate-100 bg-white py-3.5 px-5 text-sm font-black text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-100 hover:bg-sky-50/30 hover:text-sky-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-sky-900/50 dark:hover:bg-sky-900/10 dark:hover:text-sky-400 disabled:opacity-50 cursor-pointer"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                {isGooglePending ? "Connecting..." : "Google Account"}
                            </button>
                        </div>
                    )}
                </div>
            </form>

            <div className="mt-8 border-t border-slate-200/50 pt-6 text-center dark:border-slate-800">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wide">
                    {isUser ? 'Need help? Contact support or create an account.' : 'Admin access is restricted to authorized staff.'}
                </p>
            </div>
        </div>
    );
};

export default LoginForm;