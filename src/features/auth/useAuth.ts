import { useState } from "react";
import { getUser, saveUser, logoutUser } from "./authStorage";
import type { LocalUser } from "./authStorage";

export const useAuth = () => {
  const [user, setUser] = useState<LocalUser | null>(getUser());

  const login = (username: string, password: string) => {
    // fake auth check
    if (!username || !password) return false;

    const newUser = { username };
    saveUser(newUser);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };
};