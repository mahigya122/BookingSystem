import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useUser } from "@shared/auth_hooks";
import { fetchProfile, updateProfile } from "../services/profileApi";

export const useProfile = () => {
  const { user } = useUser();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await fetchProfile(user.id);

        if (!cancelled) {
          setFullName(profile.full_name || "");
          setPhone(profile.phone || "");
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

  const save = async () => {
    if (!user?.id) {
      toast.error("No authenticated user found.");
      return;
    }

    try {
      setSaving(true);
      await updateProfile({
        id: user.id,
        email: user.email ?? "",
        full_name: fullName.trim(),
        phone: phone.trim(),
        role: user.role ?? "guest",
      });
      toast.success("Profile saved successfully.");
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return {
    user,
    fullName,
    setFullName,
    phone,
    setPhone,
    loading,
    saving,
    save
  };
};
