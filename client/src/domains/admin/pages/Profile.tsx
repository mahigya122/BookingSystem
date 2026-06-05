import React, { useState } from "react";
import { useUser } from "@shared/auth_hooks";
import { supabase } from "@shared/services/supabase";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useUser();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim() || !confirmPassword.trim()) {
      toast.error("Please enter both fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      toast.error(updateError.message);
    } else {
      toast.success("Password changed successfully!");
      setPassword("");
      setConfirmPassword("");
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--app-text-main)" }}>My Profile</h1>

      {/* USER INFO */}
      <div className="card p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--app-text-muted)" }}>Email</label>
            <p className="font-bold text-base" style={{ color: "var(--app-text-main)" }}>{user?.email || "N/A"}</p>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "var(--app-text-muted)" }}>Role</label>
            <p className="font-bold text-base capitalize" style={{ color: "var(--app-text-main)" }}>{user?.role || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* CHANGE PASSWORD */}
      <div className="card p-6">
        <h2 className="text-xl font-black mb-5" style={{ color: "var(--app-text-main)" }}>Change Password</h2>

        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--app-text-muted)" }}>
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider" style={{ color: "var(--app-text-muted)" }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-3.5"
          >
            {isLoading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
