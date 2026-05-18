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
                onError: (err: any) => {
                    setError(err.message || "Login failed");
                },
            }
        );
    };

    return (
        <div className="w-full max-w-md">
            <div className="mb-10">
                <h2 className="text-4xl font-bold text-gray-900">Welcome Back</h2>
                <p className="text-gray-500 mt-3">Please login to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors text-white font-semibold py-3 rounded-xl"
                >
                    {isPending ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;