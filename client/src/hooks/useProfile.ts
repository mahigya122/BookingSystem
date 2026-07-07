import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useUser } from "@shared/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile as fetchProfile, saveProfile as updateProfile, uploadAvatar } from "@shared/services/profileStorage";
import { updatePassword } from "@shared/services/apiAuth";
import type { Profile } from "@shared/types/profile";

export const useProfile = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: loading } = useQuery<Profile | null>({
    queryKey: ["guest-profile", user?.id],
    queryFn: () => (user?.id ? (fetchProfile(user.id) as Promise<Profile>) : null),
    enabled: !!user?.id,
  });

  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhoneNo(profile.phone_no || "");
    }
  }, [profile]);

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
        avatar_url: profile?.avatar_url,
      });
      
      toast.success("Profile saved successfully!", {
        style: {
          background: "var(--app-surface-elevated, #fff)",
          color: "var(--app-text-main, #0f172a)",
          border: "1px solid var(--app-border, #e2e8f0)",
          borderRadius: "1rem",
          fontWeight: "bold",
          fontSize: "14px",
        },
        iconTheme: {
          primary: "var(--app-primary, #0284c7)",
          secondary: "#fff",
        },
      });
      
      await queryClient.invalidateQueries({ queryKey: ["guest-profile", user.id] });
      return true;
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "Failed to save profile.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const uploadPhoto = async (file: File): Promise<boolean> => {
    if (!user?.id) {
      toast.error("No authenticated user found.");
      return false;
    }

    try {
      setIsUploadingAvatar(true);
      const url = await uploadAvatar(user.id, file);
      await updateProfile({
        id: user.id,
        email: user.email ?? "",
        full_name: fullName.trim(),
        phone_no: phoneNo.trim(),
        role: user.role ?? "guest",
        avatar_url: url,
      });
      
      toast.success("Avatar updated successfully!", {
        style: {
          background: "var(--app-surface-elevated, #fff)",
          color: "var(--app-text-main, #0f172a)",
          border: "1px solid var(--app-border, #e2e8f0)",
          borderRadius: "1rem",
          fontWeight: "bold",
          fontSize: "14px",
        },
        iconTheme: {
          primary: "var(--app-primary, #0284c7)",
          secondary: "#fff",
        },
      });

      await queryClient.invalidateQueries({ queryKey: ["guest-profile", user.id] });
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload photo.");
      return false;
    } finally {
      setIsUploadingAvatar(false);
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
      toast.success("Password changed successfully!", {
        style: {
          background: "var(--app-surface-elevated, #fff)",
          color: "var(--app-text-main, #0f172a)",
          border: "1px solid var(--app-border, #e2e8f0)",
          borderRadius: "1rem",
          fontWeight: "bold",
          fontSize: "14px",
        },
        iconTheme: {
          primary: "var(--app-primary, #0284c7)",
          secondary: "#fff",
        },
      });
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
    isUploadingAvatar,
    updatingPassword,
    save,
    uploadPhoto,
    updatePass
  };
};
