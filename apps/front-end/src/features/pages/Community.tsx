'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Globe, Instagram, MessageCircle, MapPin, UserPlus, UserCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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

  // backend-ээс аль нь ч ирж магадгүй тул хоёуланг нь дэмжив
  followers?: number;
  followersCount?: number;

  bio: string;
  recentPhoto: string;

  // backend-ээс token-оор шүүж ирж болно
  followedByMe?: boolean;

  // optional
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
  const router = useRouter();

  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // follow request давхар дарах хамгаалалт
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
      router.push('/login');
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
    if (pendingFollow.current[idStr]) return; // давхар request явуулахгүй
    pendingFollow.current[idStr] = true;

    // optimistic update
    let prevFollowed = false;
    let prevFollowers = 0;

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

      // серверээс бодит төлөв/тоо ирвэл sync хийнэ
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
      // revert
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow p-6 max-w-md w-full text-center">
          <p className="text-red-600 font-medium mb-2">Алдаа гарлаа</p>
          <p className="text-gray-600">{errorMsg}</p>
          <button
            onClick={() => location.reload()}
            className="mt-5 px-5 py-2.5 bg-gray-900 text-white rounded-lg"
          >
            Дахин оролдох
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1756228808949-34a47cd1b457"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Community hero"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-blue-600/80" />
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-5xl mb-4">Аялагч</h1>
          <p className="text-xl">Монгол даяарх аялагч нартай холбогдоорой</p>
        </div>
      </section>

      {/* Travelers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {travelers.map((traveler) => {
            const followersNum = getFollowersNumber(traveler);
            const isFollowed = Boolean(traveler.followedByMe);

            return (
              <article
                key={String(traveler.id)}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={toProfileHref(traveler.id)} className="block">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={traveler.recentPhoto}
                      className="w-full h-full object-cover"
                      alt={traveler.name}
                    />
                  </div>
                </Link>

                <div className="relative px-6">
                  <Link href={toProfileHref(traveler.id)} className="inline-block">
                    <img
                      src={traveler.avatar}
                      className="size-20 rounded-full border-4 border-white -mt-10 object-cover hover:scale-[1.02] transition-transform"
                      alt={traveler.name}
                    />
                  </Link>
                </div>

                <div className="p-6 pt-2">
                  <Link href={toProfileHref(traveler.id)} className="block">
                    <h3 className="text-xl hover:text-blue-600 transition-colors">
                      {traveler.name}
                    </h3>
                  </Link>

                  <p className="text-blue-600 text-sm mb-2">{traveler.title}</p>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{traveler.bio}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 text-center border-y py-4 mb-4">
                    <div>
                      <div className="text-xl">{traveler.countriesVisited ?? 0}</div>
                      <div className="text-xs text-gray-500">Орон</div>
                    </div>
                    <div>
                      <div className="text-xl">{traveler.postsCount ?? 0}</div>
                      <div className="text-xs text-gray-500">Нийтлэл</div>
                    </div>
                    <div>
                      <div className="text-xl">{formatK(followersNum)}</div>
                      <div className="text-xs text-gray-500">Дагагч</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleFollow(traveler.id)}
                      className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        isFollowed
                          ? 'bg-gray-200 text-gray-800'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isFollowed ? <UserCheck className="size-5" /> : <UserPlus className="size-5" />}
                      {isFollowed ? 'Дагаж байна' : 'Дагах'}
                    </button>

                    <button
                      onClick={() => router.push(toProfileHref(traveler.id))}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      aria-label="Профайл"
                      title="Профайл"
                    >
                      <MapPin className="size-5" />
                    </button>

                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" aria-label="Мессеж">
                      <MessageCircle className="size-5" />
                    </button>
                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors" aria-label="Instagram">
                      <Instagram className="size-5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center">
        <Globe className="size-16 mx-auto mb-6" />
        <h2 className="text-4xl mb-4">Та ч Аялагчидт нэгдэх үү?</h2>
        <button
          onClick={() => router.push('/register')}
          className="px-8 py-3 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-colors"
        >
          Бүртгүүлэх
        </button>
      </section>
    </div>
  );
}
