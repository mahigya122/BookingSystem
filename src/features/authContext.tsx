//THIS is the REAL auth system. stores current user in React state,shares it globally and updates UI everywhere
import { createContext, useContext, useState } from "react";
import { getUser, saveUser, logoutUser } from "./authStorage";

type User = {
  username: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
};

export const authContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(getUser());

  const login = (username: string, password: string) => {
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

  return (
    <authContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(authContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};