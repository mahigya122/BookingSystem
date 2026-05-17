//This file ONLY talks to browser localStorage.
const AUTH_KEY = "booking_user";

export type LocalUser = {
  username: string;
};

export const saveUser = (user: LocalUser) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

export const getUser = (): LocalUser | null => {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
};

export const logoutUser = () => {
  localStorage.removeItem(AUTH_KEY);
};