import { supabase } from "./supabase";
import type { AuthRole, AuthUser } from "../types/auth";

async function getUserProfileRole(user: AuthUser): Promise<AuthRole> {
  const userId = user.id;
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data?.role === "admin" || data?.role === "guest") {
    return data.role;
  }

  const userEmail = user.email;

  if (userEmail) {
    const { data: emailData, error: emailError } = await supabase
      .from("profiles")
      .select("role")
      .eq("email", userEmail)
      .maybeSingle();

    if (emailError) {
      throw new Error(emailError.message);
    }

    if (emailData?.role === "admin" || emailData?.role === "guest") {
      return emailData.role;
    }

    if (userEmail.toLowerCase() === "admin@g.com") {
      return "admin";
    }

    if (userEmail.toLowerCase() === "user@g.com") {
      return "guest";
    }
  }

  throw new Error(
    `No matching admin or guest profile found for this account (${userEmail ?? userId})`
  );
}

export const updatePassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("No authenticated user returned from Supabase");
  }

  const role = await getUserProfileRole(data.user as AuthUser);

  return {
    ...data,
    user: {
      ...data.user,
      role,
    } satisfies AuthUser,
  };
};

export const logout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data, error } = await supabase.auth.getUser();

  if (error && !data.user) {
    return null;
  }

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    return null;
  }

  const role = await getUserProfileRole(data.user as AuthUser);

  return {
    ...data.user,
    role,
  } satisfies AuthUser;
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/login`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};