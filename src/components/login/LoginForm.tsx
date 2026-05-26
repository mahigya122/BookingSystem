import { useState } from "react";
import { useLogin } from "../../authentication/useLogin";

const LoginForm = () => {
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
            }
        );
    };

    return (
        <div className="w-full max-w-md">
            <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Login</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Access your management dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 px-4 py-3 rounded-lg text-xs font-bold animate-shake">
                        {error}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 ml-0.5">
                        Email Address
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@hotel-flow.com"
                        className="w-full"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 ml-0.5">
                        Security Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full btn btn-primary py-3 rounded-xl shadow-lg shadow-primary-500/20"
                >
                    {isPending ? "Validating Credentials..." : "Access Dashboard"}
                </button>
            </form>
            
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">
                    Enterprise Edition • v2.4.0
                </p>
            </div>
        </div>
    );
};

export default LoginForm;