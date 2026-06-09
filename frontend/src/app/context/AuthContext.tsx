import { createContext, useContext, useState, type ReactNode } from "react";

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
  login: (userData: User, token?: string) => void;
  logout: () => void;
}

// Teknik Generics diterapkan menggunakan TypeScript
// untuk membuat authentication state menjadi type-safe
// dan reusable.
//
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = "telkom-in-competition:user";
const AUTH_TOKEN_KEY = "telkom-in-competition:token";

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
  const isAdmin = user?.role === "admin";

  // Teknik Authentication diterapkan dengan menyediakan fungsi login dan logout
  const login = (userData: User, token?: string) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
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
