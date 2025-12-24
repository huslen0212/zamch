"use client";
import {createContext, type ReactNode, useContext, useState} from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  countriesVisited: number;
  postsCount: number;
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
  followers: number;
  following: number;
  totalLikes: number;
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, location?: { name: string; lat: number; lng: number }) => Promise<boolean>;
  logout: () => void;
  updateUserStats: (stats: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUser: User = {
  id: 1,
  name: "Сарантуяа",
  email: "sarantuya@example.com",
  avatar: "https://images.unsplash.com/photo-1585624196654-d78397524a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB0cmF2ZWwlMjBibG9nZ2VyfGVufDF8fHx8MTc2NjM0NzY1OHww&ixlib=rb-4.1.0&q=80&w=1080",
  bio: "Аяллын блогер, гэрэл зурагчин. Дэлхийн гайхамшгийг хайж байна.",
  countriesVisited: 25,
  postsCount: 12,
  location: { name: "Улаанбаатар", lat: 47.8864, lng: 106.9057 },
  followers: 1250,
  following: 345,
  totalLikes: 5430,
  joinDate: "2023-01-15",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - в реальном приложении здесь будет API запрос
    if (email && password.length >= 6) {
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    location?: { name: string; lat: number; lng: number }
  ): Promise<boolean> => {
    // Mock register
    if (name && email && password.length >= 6) {
      const newUser: User = {
        ...mockUser,
        name,
        email,
        postsCount: 0,
        countriesVisited: 0,
        location: location || undefined,
        followers: 0,
        following: 0,
        totalLikes: 0,
        joinDate: new Date().toISOString().split("T")[0],
      };
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUserStats = (stats: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...stats });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUserStats,
      }}
    >
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