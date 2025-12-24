'use client';
import { createContext, type ReactNode, useContext, useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  location?: {
    name: string;
    lat: number;
    lng: number;
  };
  joinDate: string;
}

type RegisterResult = { success: true } | { success: false; message: string };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    password: string,
    location?: { name: string; lat: number; lng: number },
  ) => Promise<RegisterResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (): Promise<boolean> => {
    return false;
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    location?: { name: string; lat: number; lng: number },
  ): Promise<RegisterResult> => {
    try {
      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          location,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 🔥 BACKEND-ийн алдааг frontend-д дамжуулна
        return {
          success: false,
          message: data.message || 'Бүртгэл амжилтгүй боллоо',
        };
      }

      setUser({
        id: crypto.randomUUID(),
        name,
        email,
        location,
        joinDate: new Date().toISOString().split('T')[0],
      });

      return { success: true };
    } catch (error) {
      console.error('REGISTER ERROR:', error);
      return {
        success: false,
        message: 'Сервертэй холбогдож чадсангүй',
      };
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
