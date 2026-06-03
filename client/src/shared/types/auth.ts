import type { User } from "@supabase/supabase-js";

export type AuthRole = "admin" | "guest";

export type AuthUser = User & {
  role?: AuthRole;
};
