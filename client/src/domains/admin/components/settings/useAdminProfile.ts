import { useState, useEffect } from "react";
import { useUser } from "@shared/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { saveProfile, uploadAvatar } from "@shared/services/profileStorage";
import { updatePassword } from "@shared/services/apiAuth";
import { supabase } from "@shared/services/supabase";
import type { ProfileRow } from "@shared/services/profileStorage";

export function useAdminProfile() {
    const { user } = useUser();
    const queryClient = useQueryClient();

    const { data: profile, isLoading } = useQuery<ProfileRow | null>({
        queryKey: ["admin-profile", user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            const { data, error } = await supabase
                .from("profiles")
                .select("id, email, full_name, phone_no, role, avatar_url, created_at")
                .eq("id", user.id)
                .single();
            if (error) throw error;
            return data as ProfileRow;
        },
        enabled: !!user?.id,
    });

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isSaving, setIsSaving] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name ?? "");
            setEmail(profile.email ?? "");
            setAvatarUrl(profile.avatar_url ?? null);
        }
    }, [profile]);

    const save = async () => {
        if (!user) return;
        setIsSaving(true);
        setError(null);
        try {
            await saveProfile({
                id: user.id,
                email,
                full_name: fullName.trim(),
                avatar_url: avatarUrl ?? undefined,
            } as ProfileRow);
            await queryClient.invalidateQueries({ queryKey: ["admin-profile", user.id] });
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
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to save profile");
        } finally {
            setIsSaving(false);
        }
    };

    const uploadPhoto = async (file: File) => {
        if (!user) return;
        setIsUploadingAvatar(true);
        setError(null);
        try {
            const url = await uploadAvatar(user.id, file);
            await saveProfile({
                id: user.id,
                email,
                full_name: fullName,
                avatar_url: url,
            } as ProfileRow);
            setAvatarUrl(url);
            await queryClient.invalidateQueries({ queryKey: ["admin-profile", user.id] });
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
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to upload photo");
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const updatePass = async () => {
        setError(null);
        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsUpdatingPassword(true);
        try {
            await updatePassword(password);
            setPassword("");
            setConfirmPassword("");
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
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to update password");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return {
        fullName, setFullName,
        email,
        avatarUrl,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        isLoading, isSaving, isUploadingAvatar, isUpdatingPassword,
        error,
        save, uploadPhoto, updatePass,
    };
}