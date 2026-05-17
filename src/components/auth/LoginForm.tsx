import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/useAuth";

const LoginForm = () => {
    const {login} = useAuth();
    const navigate = useNavigate();

    const[username, setUsername]= useState("");
    const[password, setPassword]= useState("");
    const[error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Please enter both username and password");
            return;
        }

    const success = login(username, password);
    
    if (success) {
        navigate("/dashboard");
    }
};

return(
    <div className="w-full max-w-md">
     <div className="mb-10">
        <h2 className="text-4xl font-bold text-gray-900">Welcome Back</h2>
        <p className="text-gray-500 mt-3">Please login to your account</p>
     </div>

     <form onSubmit ={handleSubmit} className="space-y-5">
        {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-3 rounded-xl">
                {error}
            </div>
        )}

      <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Username
          </label>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-semibold py-3 rounded-xl"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;  