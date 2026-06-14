import type { AuthRole } from "./auth";

export interface UserProfile {
  id: string;
  full_name: string;
  phone_no: string;
  updated_at?: string;
}

export type Profile = UserProfile & {
  email: string;
  role: AuthRole;
  created_at?: string;
};
