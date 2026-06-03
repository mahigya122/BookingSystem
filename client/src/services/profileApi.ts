import { getProfile, saveProfile as sharedSaveProfile } from "@shared/services/profileStorage";
import type { Profile } from "@shared/types/profile";

export const fetchProfile = async (userId: string): Promise<Profile> => {
  return await getProfile(userId);
};

export const updateProfile = async (profile: Profile): Promise<void> => {
  await sharedSaveProfile(profile);
};
