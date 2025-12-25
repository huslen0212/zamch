'use client';

import {
  Globe,
  Instagram,
  MessageCircle,
  MapPin,
  UserPlus,
  UserCheck,
  Users,
  Sparkles,
  TrendingUp,
  Award,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { TravelBlogLoader } from '@/components/Loader';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type TravelerId = string | number;

interface Traveler {
  id: TravelerId;
  name: string;
  avatar: string;
  title: string;
  countriesVisited: number;
  postsCount: number;
  followers?: number;
  followersCount?: number;
  bio: string;
  recentPhoto: string;
  followedByMe?: boolean;
  location?: { name: string; lat?: number; lng?: number } | string | null;
}

function getTokenSafe() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') ?? '';
}

function formatK(n: number) {
  if (!Number.isFinite(n)) return '0';
  if (n < 1000) return String(n);
  const v = n / 1000;
  return `${v.toFixed(v >= 10 ? 0 : 1)}K`;
}


export function Community() {
  const { user } = useAuth();
  const myId = user?.id != null ? String(user.id) : null;

  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pendingFollow = useRef<Record<string, boolean>>({});

  useEffect(() => {
    let alive = true;
    const ac = new AbortController();

    setLoading(true);
    setErrorMsg(null);

    const token = getTokenSafe();
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    (async () => {
      try {
        const res = await fetch(`${API_URL}/community/travelers`, {
          headers,
          signal: ac.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.message || `Request failed (${res.status})`);
        }

        const data = (await res.json()) as Traveler[];
        if (!alive) return;

        setTravelers(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!alive) return;
        if (e?.name === 'AbortError') return;
        setErrorMsg(e?.message || 'Алдаа гарлаа');
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
      ac.abort();
    };
  }, []);

  const requireAuth = () => {
    const token = getTokenSafe();
    if (!token) {
      window.location.href = '/login';
      return false;
    }
    return true;
  };

  const toProfileHref = (id: TravelerId) => `/profile/${encodeURIComponent(String(id))}`;

  const getFollowersNumber = (t: Traveler) => {
    const a = typeof t.followersCount === 'number' ? t.followersCount : undefined;
    const b = typeof t.followers === 'number' ? t.followers : undefined;
    return a ?? b ?? 0;
  };

  const handleFollow = async (travelerId: TravelerId) => {
    if (!requireAuth()) return;

    const idStr = String(travelerId);

    // ✅ ӨӨРИЙГӨӨ ДАГАХЫГ ХОРИГЛОНО
    if (myId && idStr === myId) return;

    if (pendingFollow.current[idStr]) return;
    pendingFollow.current[idStr] = true;

    let prevFollowed = false;
    let prevFollowers = 0;

    // optimistic update
    setTravelers((prev) =>
      prev.map((t) => {
        if (String(t.id) !== idStr) return t;

        prevFollowed = Boolean(t.followedByMe);
        prevFollowers = getFollowersNumber(t);

        const nextFollowed = !prevFollowed;
        const nextFollowers = Math.max(0, prevFollowers + (nextFollowed ? 1 : -1));

        return {
          ...t,
          followedByMe: nextFollowed,
          followersCount: nextFollowers,
          followers: nextFollowers,
        };
      }),
    );

    try {
      const res = await fetch(`${API_URL}/users/${encodeURIComponent(idStr)}/follow`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getTokenSafe()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || 'follow failed');
      }

      const data = await res.json().catch(() => ({} as any));

      setTravelers((prev) =>
        prev.map((t) => {
          if (String(t.id) !== idStr) return t;

          const serverFollowed =
            typeof data?.followed === 'boolean' ? Boolean(data.followed) : Boolean(t.followedByMe);

          const serverFollowers =
            typeof data?.followersCount === 'number'
              ? data.followersCount
              : typeof data?.followers === 'number'
                ? data.followers
                : getFollowersNumber(t);

          return {
            ...t,
            followedByMe: serverFollowed,
            followersCount: serverFollowers,
            followers: serverFollowers,
          };
        }),
      );
    } catch {
      // rollback
      setTravelers((prev) =>
        prev.map((t) => {
          if (String(t.id) !== idStr) return t;
          return {
            ...t,
            followedByMe: prevFollowed,
            followersCount: prevFollowers,
            followers: prevFollowers,
          };
        }),
      );
    } finally {
      pendingFollow.current[idStr] = false;
    }
  };

  if (loading) return <TravelBlogLoader />;

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mx-auto size-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-red-600 font-bold text-xl mb-2">Алдаа гарлаа</p>
          <p className="text-gray-600 mb-6">{errorMsg}</p>
          <button
            onClick={() => location.reload()}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all transform hover:scale-105"
          >
            Дахин оролдох
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero - Enhanced */}
      <section className="relative h-[480px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1756228808949-34a47cd1b457"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Community hero"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700/85 via-blue-700/75 to-indigo-700/85" />

        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="relative z-10 text-white text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
            <Users className="size-4 animate-pulse" />
            <span className="text-sm font-medium">{travelers.length} идэвхтэй гишүүн</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Аялагчид</h1>
          <p className="text-xl md:text-2xl text-purple-100 leading-relaxed">
            Монгол даяарх аялагч нартай холбогдоорой
          </p>
        </div>
      </section>

      {/* Travelers Grid - Enhanced */}
      <section className="py-20 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {travelers.map((traveler) => {
              const followersNum = getFollowersNumber(traveler);
              const isFollowed = Boolean(traveler.followedByMe);
              const isMe = myId && String(traveler.id) === myId;

              return (
                <article
                  key={String(traveler.id)}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                >
                  {/* Cover Image */}
                  <a href={toProfileHref(traveler.id)} className="block relative">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={traveler.recentPhoto}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        alt={traveler.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </a>

                  {/* Avatar */}
                  <div className="relative px-6">
                    <a href={toProfileHref(traveler.id)} className="inline-block">
                      <div className="relative">
                        <img
                          src={traveler.avatar}
                          className="size-20 rounded-full border-4 border-white -mt-10 object-cover hover:scale-110 transition-transform shadow-xl ring-4 ring-gray-100"
                          alt={traveler.name}
                        />
                        {traveler.countriesVisited > 10 && (
                          <div className="absolute -bottom-1 -right-1 p-1.5 bg-yellow-500 rounded-full border-2 border-white">
                            <Award className="size-3 text-white" />
                          </div>
                        )}
                      </div>
                    </a>
                  </div>

                  {/* Content */}
                  <div className="p-6 pt-2">
                    <a href={toProfileHref(traveler.id)} className="block">
                      <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mb-1">
                        {traveler.name}
                      </h3>
                    </a>

                    <p className="text-blue-600 text-sm font-medium mb-3 flex items-center gap-1">
                      <Sparkles className="size-3" />
                      {traveler.title}
                    </p>

                    <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
                      {traveler.bio}
                    </p>

                    {/* Stats - Enhanced */}
                    <div className="grid grid-cols-3 gap-4 mb-5">
                      <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-transparent rounded-xl">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Globe className="size-4 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{traveler.countriesVisited ?? 0}</div>
                        <div className="text-xs text-gray-500 font-medium">Орон</div>
                      </div>

                      <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-transparent rounded-xl">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="size-4 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{traveler.postsCount ?? 0}</div>
                        <div className="text-xs text-gray-500 font-medium">Нийтлэл</div>
                      </div>

                      <div className="text-center p-3 bg-gradient-to-br from-green-50 to-transparent rounded-xl">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="size-4 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{formatK(followersNum)}</div>
                        <div className="text-xs text-gray-500 font-medium">Дагагч</div>
                      </div>
                    </div>

                    {/* Actions - Enhanced */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFollow(traveler.id)}
                        disabled={Boolean(isMe)}
                        title={isMe ? 'Өөрийгөө дагах боломжгүй' : undefined}
                        className={`flex-1 px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all transform ${
                          isMe
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'hover:scale-105'
                        } ${
                          !isMe && isFollowed
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : !isMe
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-600/30'
                              : ''
                        }`}
                      >
                        {isMe ? (
                          <UserCheck className="size-5" />
                        ) : isFollowed ? (
                          <UserCheck className="size-5" />
                        ) : (
                          <UserPlus className="size-5" />
                        )}
                        {isMe ? 'Дагах' : isFollowed ? 'Дагаж байна' : 'Дагах'}
                      </button>

                      <a
                        href={toProfileHref(traveler.id)}
                        className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all hover:scale-110"
                        aria-label="Профайл"
                        title="Профайл"
                      >
                        <MapPin className="size-5 text-gray-600" />
                      </a>

                      <button
                        className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all hover:scale-110"
                        aria-label="Мессеж"
                        title="Мессеж"
                      >
                        <MessageCircle className="size-5 text-gray-600" />
                      </button>

                      <button
                        className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl hover:from-pink-200 hover:to-purple-200 transition-all hover:scale-110"
                        aria-label="Instagram"
                        title="Instagram"
                      >
                        <Instagram className="size-5 text-pink-600" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA - Enhanced */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700" />

        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="relative z-10 text-white text-center px-4 max-w-3xl mx-auto">
          <div className="mb-6 inline-block">
            <div className="relative">
              <Globe className="size-20 mx-auto animate-bounce" strokeWidth={1.5} />
              <div className="absolute -inset-4 bg-white/20 rounded-full blur-xl" />
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Та бидэнтэй нэгдэх үү?</h2>
          <p className="text-xl text-purple-100 mb-8 leading-relaxed">
            Аяллынхаа түүхийг хуваалцаж, шинэ найзуудтай танилцаарай
          </p>

          <button
            onClick={() => (window.location.href = '/register')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-2xl hover:bg-blue-50 transition-all transform hover:scale-105 font-semibold text-lg shadow-2xl"
          >
            <UserPlus className="size-5" />
            Бүртгүүлэх
          </button>
        </div>
      </section>
    </div>
  );
}
