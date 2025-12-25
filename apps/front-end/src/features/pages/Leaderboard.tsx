"use client";

import {
  Trophy,
  Heart,
  Users,
  BookOpen,
  Globe,
  Medal,
  Crown,
  Award,
  MapPin,
  AlertTriangle,
  RefreshCw,
  Star,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TravelBlogLoader } from '@/components/Loader';

type SortBy = "likes" | "followers" | "posts";

const API_URL = "http://localhost:3001";

type LeaderboardUser = {
  id: string | number;
  name: string | null;
  avatar: string | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  totalLikes: number | null;
  followersCount: number | null;
  postsCount: number | null;
  countriesVisited: number | null;
};

const FALLBACK_AVATAR = "/avatar.png";

function safeNum(v: unknown, fallback = 0) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function SortLabel({ sortBy }: { sortBy: SortBy }) {
  if (sortBy === "likes") return "Таалагдсаны жагсаалт";
  if (sortBy === "followers") return "Дагагчийн жагсаалт";
  return "Нийтлэлийн жагсаалт";
}


export function Leaderboard() {
  const [sortBy, setSortBy] = useState<SortBy>("likes");
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const ac = new AbortController();

    setLoading(true);
    setErrorMsg(null);

    (async () => {
      try {
        const res = await fetch(`${API_URL}/leaderboard?sortBy=${sortBy}`, {
          signal: ac.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || `Request failed (${res.status})`);
        }

        const data = (await res.json()) as LeaderboardUser[];
        if (!alive) return;

        const normalized = (Array.isArray(data) ? data : []).map((u) => ({
          ...u,
          name: (u.name ?? "").trim() || "Нэргүй",
          avatar: (u.avatar ?? "").trim() || null,
          location: (u.location ?? "").trim() || null,
          lat: Number.isFinite(u.lat as number) ? (u.lat as number) : null,
          lng: Number.isFinite(u.lng as number) ? (u.lng as number) : null,
          totalLikes: safeNum(u.totalLikes, 0),
          followersCount: safeNum(u.followersCount, 0),
          postsCount: safeNum(u.postsCount, 0),
          countriesVisited: safeNum(u.countriesVisited, 0),
        }));

        setUsers(normalized);
      } catch (e: any) {
        if (!alive) return;
        if (e?.name === "AbortError") return;
        setErrorMsg(e?.message || "Алдаа гарлаа");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
      ac.abort();
    };
  }, [sortBy]);

  const sortedUsers = useMemo(() => {
    const arr = [...users];
    arr.sort((a, b) => {
      if (sortBy === "likes") return safeNum(b.totalLikes) - safeNum(a.totalLikes);
      if (sortBy === "followers")
        return safeNum(b.followersCount) - safeNum(a.followersCount);
      return safeNum(b.postsCount) - safeNum(a.postsCount);
    });
    return arr;
  }, [users, sortBy]);

  const stats = useMemo(() => {
    return {
      totalBloggers: sortedUsers.length,
      totalPosts: sortedUsers.reduce((s, u) => s + safeNum(u.postsCount), 0),
      totalLikes: sortedUsers.reduce((s, u) => s + safeNum(u.totalLikes), 0),
      totalCountries: sortedUsers.reduce((s, u) => s + safeNum(u.countriesVisited), 0),
    };
  }, [sortedUsers]);

  if (loading) {
    return <TravelBlogLoader />;
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto size-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle className="size-8 text-red-600" />
          </div>
          <p className="text-gray-900 font-bold text-xl mb-2">Алдаа гарлаа</p>
          <p className="text-gray-600 mb-6">{errorMsg}</p>
          <button
            onClick={() => setSortBy((s) => s)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all transform hover:scale-105"
          >
            <RefreshCw className="size-5" />
            Дахин оролдох
          </button>
        </div>
      </div>
    );
  }

  if (!sortedUsers.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <Trophy className="size-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-900 font-bold text-xl mb-2">Өгөгдөл алга</p>
          <p className="text-gray-600">Одоогоор leaderboard хоосон байна.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section - Enhanced */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-yellow-500 via-orange-600 to-red-600">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative text-center text-white px-4 max-w-4xl mx-auto">
          <div className="mb-6 inline-block">
            <div className="relative">
              <Trophy className="w-20 h-20 mx-auto animate-bounce" strokeWidth={1.5} />
              <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl"></div>
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-300 animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Тэргүүлэгчид
          </h1>
          <p className="text-xl md:text-2xl text-yellow-100 leading-relaxed mb-4">
            Шилдэг аяллын блогерууд
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
            <TrendingUp className="w-4 h-4" />
            <span>{sortedUsers.length} идэвхтэй хэрэглэгч</span>
          </div>
        </div>
      </section>

      {/* Sort Tabs - Enhanced */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-lg backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center gap-3 overflow-x-auto">
            <button
              onClick={() => setSortBy("likes")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 font-medium ${
                sortBy === "likes"
                  ? "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/30 scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
              }`}
            >
              <Heart className="size-5" />
              <span>Таалагдсан</span>
            </button>

            <button
              onClick={() => setSortBy("followers")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 font-medium ${
                sortBy === "followers"
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30 scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
              }`}
            >
              <Users className="size-5" />
              <span>Дагагч</span>
            </button>

            <button
              onClick={() => setSortBy("posts")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all duration-300 font-medium ${
                sortBy === "posts"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
              }`}
            >
              <BookOpen className="size-5" />
              <span>Нийтлэл</span>
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-yellow-500 via-orange-600 to-red-600 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Star className="w-6 h-6" />
                  <SortLabel sortBy={sortBy} />
                </h2>
              </div>

              {/* Top 3 Podium - Enhanced */}
              <div className="p-8 bg-gradient-to-b from-yellow-50 via-orange-50 to-white">
                <div className="flex items-end justify-center gap-6">
                  {/* 2nd Place */}
                  {sortedUsers[1] && (
                    <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
                      <div className="relative mb-3">
                        <div className="absolute inset-0 bg-gray-400 rounded-full blur-xl opacity-30"></div>
                        <img
                          src={sortedUsers[1].avatar || FALLBACK_AVATAR}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_AVATAR;
                          }}
                          alt={sortedUsers[1].name || "user"}
                          className="relative size-20 rounded-full border-4 border-gray-300 object-cover ring-4 ring-gray-100 shadow-xl"
                        />
                        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                          <Medal className="size-7 text-gray-400" />
                        </div>
                      </div>
                      <div className="text-center mb-3">
                        <div className="font-semibold mb-1">{sortedUsers[1].name}</div>
                        <div className="text-2xl font-bold text-gray-700">
                          {sortBy === "likes" && safeNum(sortedUsers[1].totalLikes).toLocaleString()}
                          {sortBy === "followers" &&
                            safeNum(sortedUsers[1].followersCount).toLocaleString()}
                          {sortBy === "posts" && safeNum(sortedUsers[1].postsCount)}
                        </div>
                      </div>
                      <div className="w-32 h-24 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-xl shadow-xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10"></div>
                        <span className="text-4xl font-bold text-white relative z-10">2</span>
                      </div>
                    </div>
                  )}

                  {/* 1st Place */}
                  {sortedUsers[0] && (
                    <div className="flex flex-col items-center transform hover:scale-110 transition-transform duration-300">
                      <div className="relative mb-3">
                        <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                        <img
                          src={sortedUsers[0].avatar || FALLBACK_AVATAR}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_AVATAR;
                          }}
                          alt={sortedUsers[0].name || "user"}
                          className="relative size-28 rounded-full border-4 border-yellow-400 object-cover ring-4 ring-yellow-100 shadow-2xl"
                        />
                        <div className="absolute -top-4 -right-3 bg-white rounded-full p-1 shadow-lg animate-bounce">
                          <Crown className="size-9 text-yellow-500" />
                        </div>
                      </div>
                      <div className="text-center mb-3">
                        <div className="font-bold text-lg mb-1">{sortedUsers[0].name}</div>
                        <div className="text-3xl font-bold text-yellow-600">
                          {sortBy === "likes" && safeNum(sortedUsers[0].totalLikes).toLocaleString()}
                          {sortBy === "followers" &&
                            safeNum(sortedUsers[0].followersCount).toLocaleString()}
                          {sortBy === "posts" && safeNum(sortedUsers[0].postsCount)}
                        </div>
                      </div>
                      <div className="w-36 h-36 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/20"></div>
                        <Sparkles className="absolute top-2 right-2 w-6 h-6 text-white/50 animate-pulse" />
                        <span className="text-5xl font-bold text-white relative z-10">1</span>
                      </div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {sortedUsers[2] && (
                    <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
                      <div className="relative mb-3">
                        <div className="absolute inset-0 bg-orange-400 rounded-full blur-xl opacity-30"></div>
                        <img
                          src={sortedUsers[2].avatar || FALLBACK_AVATAR}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_AVATAR;
                          }}
                          alt={sortedUsers[2].name || "user"}
                          className="relative size-20 rounded-full border-4 border-orange-300 object-cover ring-4 ring-orange-100 shadow-xl"
                        />
                        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                          <Award className="size-7 text-orange-600" />
                        </div>
                      </div>
                      <div className="text-center mb-3">
                        <div className="font-semibold mb-1">{sortedUsers[2].name}</div>
                        <div className="text-2xl font-bold text-orange-700">
                          {sortBy === "likes" && safeNum(sortedUsers[2].totalLikes).toLocaleString()}
                          {sortBy === "followers" &&
                            safeNum(sortedUsers[2].followersCount).toLocaleString()}
                          {sortBy === "posts" && safeNum(sortedUsers[2].postsCount)}
                        </div>
                      </div>
                      <div className="w-32 h-20 bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-xl shadow-xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10"></div>
                        <span className="text-4xl font-bold text-white relative z-10">3</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Rest of List - Enhanced */}
              <div className="divide-y divide-gray-100">
                {sortedUsers.slice(3).map((user, idx) => {
                  const rank = idx + 4;
                  const metric =
                    sortBy === "likes"
                      ? safeNum(user.totalLikes).toLocaleString()
                      : sortBy === "followers"
                        ? safeNum(user.followersCount).toLocaleString()
                        : String(safeNum(user.postsCount));

                  const metricLabel =
                    sortBy === "likes" ? "таалагдсан" : sortBy === "followers" ? "дагагч" : "нийтлэл";

                  return (
                    <a
                      key={String(user.id)}
                      href={`/profile/${encodeURIComponent(String(user.id))}`}
                      className="p-5 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-300 flex items-center gap-4 group"
                    >
                      <div className="size-12 flex items-center justify-center text-xl font-bold text-gray-400 group-hover:text-gray-600 transition-colors">
                        #{rank}
                      </div>

                      <div className="relative">
                        <img
                          src={user.avatar || FALLBACK_AVATAR}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_AVATAR;
                          }}
                          alt={user.name || "user"}
                          className="size-16 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-4 group-hover:ring-blue-200 transition-all"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
                          {user.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                          {user.location ? (
                            <div className="flex items-center gap-1">
                              <MapPin className="size-4" />
                              <span className="truncate max-w-[220px]">{user.location}</span>
                            </div>
                          ) : null}

                          <div className="flex items-center gap-1">
                            <Globe className="size-4" />
                            <span>{safeNum(user.countriesVisited)} Аймаг</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-2xl font-bold mb-1 text-gray-900 group-hover:text-blue-600 transition-colors">
                          {metric}
                        </div>
                        <div className="text-sm text-gray-500">{metricLabel}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar - Enhanced */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Нийт статистик
              </h3>

              <div className="space-y-5">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="size-5 text-blue-600" />
                    </div>
                    <span className="font-medium">Нийт блогер</span>
                  </div>
                  <span className="text-gray-900 text-2xl font-bold">{stats.totalBloggers}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-transparent rounded-xl">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BookOpen className="size-5 text-green-600" />
                    </div>
                    <span className="font-medium">Нийт нийтлэл</span>
                  </div>
                  <span className="text-gray-900 text-2xl font-bold">{stats.totalPosts}</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-transparent rounded-xl">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Heart className="size-5 text-red-600" />
                    </div>
                    <span className="font-medium">Нийт таалагдсан</span>
                  </div>
                  <span className="text-gray-900 text-2xl font-bold">
                    {stats.totalLikes.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-transparent rounded-xl">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Globe className="size-5 text-purple-600" />
                    </div>
                    <span className="font-medium">Нийт аймаг</span>
                  </div>
                  <span className="text-gray-900 text-2xl font-bold">{stats.totalCountries}</span>
                </div>
              </div>
            </div>

            {/* CTA Card - Enhanced */}
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white text-center overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <div className="mb-4 inline-block">
                  <Trophy className="size-14 mx-auto animate-bounce" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Та ч нэгдээрэй!</h3>
                <p className="text-blue-100 mb-6 leading-relaxed">
                  Аяллынхаа түүхийг хуваалцаж, хэрэглэгчдийн жагсаалтад орцгооё
                </p>

                <a
                  href="/register"
                  className="inline-flex items-center justify-center w-full py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 font-semibold shadow-lg"
                >
                  Бүртгүүлэх
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
