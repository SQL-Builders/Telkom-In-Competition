import { createContext, useContext, useState, type ReactNode } from "react";
import { appConfig } from "../config/appConfig";
import { ROLES } from "../constants/roles";

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

// Teknik Generics diterapkan menggunakan TypeScript
// untuk membuat authentication state menjadi type-safe
// dan reusable.
//
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY =
  appConfig.authStorageKey;

export function AuthProvider({ children }: { children: ReactNode }) { // Teknik State Management diterapkan menggunakan React's useState
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  }); // State untuk menyimpan informasi user yang sedang login

  const isLoggedIn = user !== null;
  const isAdmin = user?.role === ROLES.ADMIN;

  // Teknik Authentication diterapkan dengan menyediakan fungsi login dan logout
  const login = (userData: User) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
