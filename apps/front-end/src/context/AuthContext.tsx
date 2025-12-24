'use client';

import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/* ================= USER TYPE ================= */

// Backend-ээс ирдэг user минимал байх боломжтой тул
// stats талбаруудыг optional (эсвэл default=0) болгож хамгааллаа.
export interface User {
  id: string;
  name: string;
  email: string;

  avatar?: string;
  bio?: string;

  // backend дээр location string байж болно
  location?: {
    name: string;
    lat?: number;
    lng?: number;
  };

  postsCount?: number;
  totalLikes?: number;
  followers?: number;
  following?: number;
  countriesVisited?: number;

  joinDate?: string; // createdAt байхгүй үед хоосон/undefined байж болно
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

  refreshMe: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ================= CONFIG ================= */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
}

function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
}

/* ================= MAPPERS ================= */

function mapUser(raw: any): User {
  if (!raw) {
    // хамгаалалт
    return {
      id: '',
      name: '',
      email: '',
    };
  }

  // location: "Улаанбаатар" эсвэл {name,lat,lng} байж болно
  const loc =
    raw.location == null
      ? undefined
      : typeof raw.location === 'string'
        ? {
          name: raw.location,
          lat: raw.lat ?? undefined,
          lng: raw.lng ?? undefined,
        }
        : {
          name: raw.location.name ?? raw.location,
          lat: raw.location.lat ?? raw.lat ?? undefined,
          lng: raw.location.lng ?? raw.lng ?? undefined,
        };

  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,

    avatar: raw.avatar ?? undefined,
    bio: raw.bio ?? undefined,
    location: loc,

    postsCount: raw.postsCount ?? 0,
    totalLikes: raw.totalLikes ?? 0,
    followers: raw.followers ?? 0,
    following: raw.following ?? 0,
    countriesVisited: raw.countriesVisited ?? 0,

    joinDate: raw.createdAt ?? raw.joinDate ?? undefined,
  };
}

async function fetchMe(token: string): Promise<User> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Unauthorized');
  }

  const data = await res.json();
  // /auth/me нь {user:{...}} эсвэл {...} хэлбэрээр буцахыг хоёуланг нь дэмжинэ
  return mapUser(data.user ?? data);
}

/* ================= PROVIDER ================= */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useMemo(() => !!user, [user]);

  const refreshMe = async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const me = await fetchMe(token);
      setUser(me);
    } catch {
      clearToken();
      setUser(null);
    }
  };

  /* ========== RESTORE SESSION ========== */
  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshMe();
      setLoading(false);
    })();

    // (сонголтоор) өөр tab дээр logout/login хийгдвэл sync хийх
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'token') {
        refreshMe().finally(() => setLoading(false));
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= LOGIN ================= */

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('LOGIN FAILED:', data);
        return false;
      }

      // login response: { token, user }
      if (data?.token) setToken(data.token);

      // ✅ 1) боломжтой бол /auth/me-ээр бүрэн user татаж setUser хийнэ
      try {
        const me = await fetchMe(data.token);
        setUser(me);
      } catch {
        // ✅ 2) /auth/me ажиллахгүй бол login response-ийн user-ээр fallback
        if (data?.user) setUser(mapUser(data.user));
        else setUser(null);
      }

      return true;
    } catch (error) {
      console.error('LOGIN ERROR:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */

  const register = async (
    name: string,
    email: string,
    password: string,
    location?: { name: string; lat: number; lng: number },
  ): Promise<RegisterResult> => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, location }),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || 'Бүртгэл амжилтгүй боллоо',
        };
      }

      return { success: true };
    } catch (error) {
      console.error('REGISTER ERROR:', error);
      return {
        success: false,
        message: 'Сервертэй холбогдож чадсангүй',
      };
    }
  };

  /* ================= LOGOUT ================= */

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        refreshMe,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
