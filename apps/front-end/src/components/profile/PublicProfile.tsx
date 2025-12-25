"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  BookOpen,
  Calendar,
  Globe,
  Heart,
  MapPin,
  Users,
  Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type LocationDto = { name: string; lat?: number | null; lng?: number | null };

type UserProfile = {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  location?: string | null;
  lat?: number | null;
  lng?: number | null;

  postsCount: number;
  totalLikes: number;
  followersCount: number;
  followingCount: number;
  countriesVisited: number;

  joinDate?: string; // backend joinDate өгвөл
  createdAt?: string; // эсвэл createdAt өгвөл
  followedByMe?: boolean;
  isMe?: boolean;
};

type PostCard = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image?: string | null;
  createdAt: string;
  readTime?: string;

  author?: string | null;
  authorAvatar?: string | null;

  location?: LocationDto | null;
};

type PostsByUserResponse = {
  userId: string;
  total: number;
  take: number;
  skip: number;
  posts: PostCard[];
};

function getTokenSafe() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") ?? "";
}

function formatDateMN(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("mn-MN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function estimateReadTime(text?: string) {
  const t = (text ?? "").trim();
  if (!t) return "1 мин";
  const words = t.split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} мин`;
}

export function PublicProfile({ userId }: { userId: string }) {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);

  const [posts, setPosts] = useState<PostCard[]>([]);
  const [postsTotal, setPostsTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);

  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState<string | null>(null);

  const [profileError, setProfileError] = useState<string | null>(null);
  const [postsError, setPostsError] = useState<string | null>(null);

  const safeAvatar = user?.avatar ?? "/default-avatar.png";
  const safeBio = user?.bio ?? "Танилцуулга алга байна.";

  const joinDateStr = useMemo(() => {
    const raw = user?.joinDate || user?.createdAt;
    return raw ? formatDateMN(raw) : "";
  }, [user?.joinDate, user?.createdAt]);

  const isFollowed = Boolean(user?.followedByMe);

  // ---------- USER PROFILE ----------
  useEffect(() => {
    if (!userId) return;

    const ac = new AbortController();
    setLoading(true);
    setProfileError(null);

    const token = getTokenSafe();
    const headers: Record<string, string> = token
      ? { Authorization: `Bearer ${token}` }
      : {};

    fetch(`${API_URL}/usersInfo/${userId}`, { headers})
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({} as any));
          throw new Error(err?.message ?? "Хэрэглэгч олдсонгүй");
        }
        return (await r.json()) as UserProfile;
      })
      .then((data) => {
        // өөрийн профайл бол /profile руу чиглүүлэх (хүсвэл)
        if (data?.isMe) {
          router.push("/profile");
          return;
        }
        setUser(data);
      })
      .catch((e: any) => {
        setUser(null);
        setProfileError(e?.message ?? "Алдаа гарлаа");
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [userId, router]);

  // ---------- USER POSTS ----------
  useEffect(() => {
    if (!userId) return;

    const ac = new AbortController();
    setPostsLoading(true);
    setPostsError(null);

    fetch(`${API_URL}/posts/user/${userId}?take=20&skip=0`, {
      signal: ac.signal,
    })
      .then(async (r) => {
        if (!r.ok) {
          const err = await r.json().catch(() => ({} as any));
          throw new Error(err?.message ?? "Нийтлэл татахад алдаа гарлаа");
        }
        return (await r.json()) as PostsByUserResponse;
      })
      .then((data) => {
        const list = Array.isArray(data?.posts) ? data.posts : [];
        setPosts(list);
        setPostsTotal(typeof data?.total === "number" ? data.total : list.length);
      })
      .catch((e: any) => {
        setPosts([]);
        setPostsTotal(0);
        setPostsError(e?.message ?? "Нийтлэл татахад алдаа гарлаа");
      })
      .finally(() => setPostsLoading(false));

    return () => ac.abort();
  }, [userId]);

  // ---------- FOLLOW (✅ optimistic биш: зөвхөн амжилттай үед update) ----------
  const toggleFollow = async () => {
    if (!user) return;

    // ✅ өөрийгөө дагахгүй
    if (user.isMe) {
      setFollowError("Өөрийгөө дагах боломжгүй.");
      return;
    }

    const token = getTokenSafe();
    if (!token) {
      router.push("/login");
      return;
    }
    if (followLoading) return;

    setFollowLoading(true);
    setFollowError(null);

    const prevFollowed = Boolean(user.followedByMe);
    const prevFollowers = Number.isFinite(user.followersCount)
      ? user.followersCount
      : 0;

    try {
      const res = await fetch(`${API_URL}/users/${user.id}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({} as any));

      // ❌ Амжилтгүй бол UI-г өөрчлөхгүй
      if (!res.ok) {
        setFollowError(data?.message ?? "Дагах хүсэлт амжилтгүй.");
        return;
      }

      const followed = Boolean(data?.followed);

      // Хэрвээ backend followersCount буцаавал тэрийг ашиглана
      let nextFollowers = prevFollowers;
      if (typeof data?.followersCount === "number") {
        nextFollowers = data.followersCount;
      } else {
        if (!prevFollowed && followed) nextFollowers = prevFollowers + 1;
        if (prevFollowed && !followed)
          nextFollowers = Math.max(0, prevFollowers - 1);
      }

      setUser((p) =>
        p
          ? {
            ...p,
            followedByMe: followed,
            followersCount: nextFollowers,
          }
          : p
      );
    } catch (e) {
      console.error(e);
      setFollowError("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setFollowLoading(false);
    }
  };

  // ---------- STATES ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="size-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow p-6 text-center max-w-md w-full">
          <div className="text-red-600 font-semibold mb-2">
            {profileError ?? "Хэрэглэгч олдсонгүй"}
          </div>
          <button
            onClick={() => router.back()}
            className="mt-3 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition font-medium"
          >
            Буцах
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover */}
      <div className="relative h-48 sm:h-64 lg:h-80 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
          alt="Cover"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10">
        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <img
              src={safeAvatar}
              alt={user.name}
              className="size-24 sm:size-28 lg:size-32 rounded-full border-4 border-white shadow-lg object-cover"
            />

            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                    {user.name}
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">{safeBio}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.back()}
                    className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition font-medium"
                  >
                    Буцах
                  </button>

                  <button
                    onClick={toggleFollow}
                    disabled={followLoading || Boolean(user.isMe)}
                    className={`px-4 py-2 rounded-lg transition font-medium shadow ${
                      isFollowed
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    } ${
                      followLoading || user.isMe
                        ? "opacity-60 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {user.isMe
                      ? "Өөрийн профайл"
                      : isFollowed
                        ? "Дагаж байна"
                        : "Дагах"}
                  </button>
                </div>
              </div>

              {followError ? (
                <div className="mb-3 text-sm text-red-600">{followError}</div>
              ) : null}

              {user.location ? (
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="size-5 text-blue-600" />
                  <span>{user.location}</span>
                </div>
              ) : null}

              {/* Stats */}
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 sm:gap-6 mb-4">
                <Stat
                  icon={<BookOpen className="size-5 text-blue-600" />}
                  label="Нийтлэл"
                  value={user.postsCount}
                />
                <Stat
                  icon={<Heart className="size-5 text-red-600" />}
                  label="Таалагдсан"
                  value={user.totalLikes}
                />
                <Stat
                  icon={<Users className="size-5 text-green-600" />}
                  label="Дагагч"
                  value={user.followersCount}
                />
                <Stat
                  icon={<Globe className="size-5 text-purple-600" />}
                  label="Улс/Аймаг"
                  value={user.countriesVisited}
                />
              </div>

              {joinDateStr ? (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Calendar className="size-4" />
                  <span>Нэгдсэн: {joinDateStr}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="grid grid-cols-1 gap-6 pb-12">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold">
                Нийтлэлүүд ({postsTotal})
              </h2>
              <Link
                href="/blogs"
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition font-medium"
              >
                Бүх нийтлэл
              </Link>
            </div>

            {postsLoading ? (
              <div className="bg-white rounded-xl p-10 text-center text-gray-600">
                <Loader2 className="size-6 animate-spin mx-auto mb-3 text-blue-600" />
                Ачаалж байна...
              </div>
            ) : postsError ? (
              <div className="bg-white rounded-xl p-6 text-center text-red-600">
                {postsError}
              </div>
            ) : posts.length ? (
              posts.map((p) => (
                <Link
                  key={String(p.id)}
                  href={`/blog/${p.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all block group"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/3 bg-gray-100 relative overflow-hidden h-48 sm:h-auto">
                      <img
                        src={p.image || "/placeholder.jpg"}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-4 sm:p-6 sm:w-2/3">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                          {p.category}
                        </span>

                        {p.location?.name ? (
                          <div className="flex items-center gap-1 text-gray-500 text-xs">
                            <MapPin className="size-3" />
                            <span>{p.location.name}</span>
                          </div>
                        ) : null}
                      </div>

                      <h3 className="text-lg sm:text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {p.title}
                      </h3>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {p.excerpt}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{formatDateMN(p.createdAt)}</span>
                        <span>•</span>
                        <span>
                          {p.readTime
                            ? p.readTime
                            : `${estimateReadTime(p.excerpt)} унших`}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="bg-white rounded-xl p-10 text-center text-gray-600">
                Нийтлэл алга байна
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({
                icon,
                label,
                value,
              }: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      <div>
        <div className="text-lg font-semibold text-gray-900">
          {Number.isFinite(value) ? value.toLocaleString() : 0}
        </div>
        <div className="text-xs text-gray-600">{label}</div>
      </div>
    </div>
  );
}
