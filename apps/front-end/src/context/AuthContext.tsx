'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

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
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    fetch('http://localhost:3001/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then((data) => {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          location: data.location,
          joinDate: new Date().toISOString().split('T')[0],
        });
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('LOGIN FAILED:', data);
        return false;
      }

      localStorage.setItem('token', data.token);

      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        location: data.user.location,
        joinDate: new Date().toISOString().split('T')[0],
      });

      return true;
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      return false;
    }
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
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
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
