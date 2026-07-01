import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useUser } from "@shared/hooks";
import { getProfile as fetchProfile, saveProfile as updateProfile } from "@shared/services/profileStorage";
import { updatePassword } from "@shared/services/apiAuth";
import type { Profile } from "@shared/types/profile";

export const useProfile = () => {
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchProfile(user.id);

        if (!cancelled) {
          setProfile(data);
          setFullName(data.full_name || "");
          setPhoneNo(data.phone_no || "");
        }
      } catch {
        if (!cancelled) {
          toast.error("Unable to load profile details right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const save = async (): Promise<boolean> => {
    if (!user?.id) {
      toast.error("No authenticated user found.");
      return false;
    }

    try {
      setSaving(true);
      await updateProfile({
        id: user.id,
        email: user.email ?? "",
        full_name: fullName.trim(),
        phone_no: phoneNo.trim(),
        role: user.role ?? "guest",
      });
      toast.success("Profile saved successfully.");
      
      // Update local profile state
      setProfile((prev) => prev ? ({
         ...prev,
         full_name: fullName.trim(),
         phone_no: phoneNo.trim()
      }) : null);
      return true;
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "Failed to save profile.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updatePass = async () => {
    if (!password) {
      toast.error("Please enter a new password.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      setUpdatingPassword(true);
      await updatePassword(password);
      toast.success("Password updated successfully.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return {
    user,
    profile,
    fullName,
    setFullName,
    phone: phoneNo,
    setPhone: setPhoneNo,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    saving,
    updatingPassword,
    save,
    updatePass
  };
};
