'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, ArrowLeft } from 'lucide-react';
import { TravelBlogLoader } from '@/components/Loader';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface PostApi {
  id: number;
  image?: string;
  category?: string;
  title?: string;
  excerpt?: string;
  author?: string;
  createdAt?: string;
  readTime?: string;
  location?: string;
}

function safeImg(url?: string) {
  const u = String(url || '').trim();
  if (!u || (!u.startsWith('http://') && !u.startsWith('https://'))) {
    return 'https://images.unsplash.com/photo-1501785888041-af3ef285b470';
  }
  return u;
}

function parseDisplayName(v: any) {
  const s = String(v ?? '').trim();
  if (!s) return '';
  if (s.startsWith('{') && s.endsWith('}')) {
    try {
      const obj = JSON.parse(s);
      if (obj && typeof obj.name === 'string') return obj.name;
    } catch {
      //
    }
  }
  return s;
}

function toTime(v?: string) {
  const t = Date.parse(String(v || ''));
  return Number.isFinite(t) ? t : 0;
}

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams<{ category: string }>();

  const categoryName = useMemo(() => {
    try {
      return decodeURIComponent(params?.category ?? '');
    } catch {
      return String(params?.category ?? '');
    }
  }, [params?.category]);

  const [posts, setPosts] = useState<PostApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const r = await fetch(`${API_URL}/posts`, { signal: ac.signal });
        const json = await r.json();

        const arr: PostApi[] = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
            ? json.data
            : [];

        if (!alive) return;
        setPosts(arr);
      } catch {
        if (!alive) return;
        setPosts([]);
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

  // ✅ тухайн category-н постууд
  const categoryPosts = useMemo(() => {
    const target = parseDisplayName(categoryName);
    return posts
      .map((p) => ({
        ...p,
        category: parseDisplayName(p.category),
        location: parseDisplayName(p.location),
        image: safeImg(p.image),
        title: String(p.title || '').trim(),
        excerpt: String(p.excerpt || '').trim(),
      }))
      .filter((p) => p.category === target);
  }, [posts, categoryName]);

  // ✅ location-оор бүлэглэх
  const groups = useMemo(() => {
    const map = new Map<
      string,
      { location: string; count: number; image: string; latest: number; items: PostApi[] }
    >();

    for (const p of categoryPosts) {
      const loc = parseDisplayName(p.location);
      if (!loc) continue;

      const created = toTime(p.createdAt);
      if (!map.has(loc)) {
        map.set(loc, { location: loc, count: 0, image: safeImg(p.image), latest: created, items: [] });
      }

      const row = map.get(loc)!;
      row.count += 1;
      row.items.push(p);

      if (created >= row.latest) {
        row.latest = created;
        row.image = safeImg(p.image);
      }
    }

    const arr = Array.from(map.values());

    // location доторх постуудыг шинэ нь эхэнд
    for (const g of arr) {
      g.items.sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt));
    }

    // location-уудыг count/шинэчлэлтээр эрэмбэлэх
    arr.sort((a, b) => b.count - a.count || b.latest - a.latest);
    return arr;
  }, [categoryPosts]);

  const goBlogs = (location: string) => {
    const qs = new URLSearchParams({ category: categoryName, destination: location });
    router.push(`/blogs?${qs.toString()}`);
  };

  if (loading) return <TravelBlogLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-blue-700 to-purple-700" />
        <div className="relative max-w-7xl mx-auto px-4 py-14 text-white">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Буцах
          </button>

          <h1 className="text-4xl md:text-5xl font-bold">{categoryName}</h1>
          <p className="text-white/90 mt-3">
            Нийт {categoryPosts.length.toLocaleString()} нийтлэл • {groups.length.toLocaleString()} байршил
          </p>
        </div>
      </section>

      {/* Locations + Posts */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {groups.length === 0 ? (
          <div className="bg-white rounded-2xl border p-10 text-center">
            <p className="text-gray-700 font-medium">Энэ ангилалд одоогоор нийтлэл алга байна.</p>
            <button
              type="button"
              onClick={() => router.push('/destinations')}
              className="mt-5 px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
            >
              Ангиллууд руу буцах
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {groups.map((g) => (
              <div key={g.location} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                {/* Location cover */}
                <div className="relative h-56">
                  <img src={g.image} alt={g.location} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                    <div className="text-white">
                      <div className="flex items-center gap-2 text-white/90">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{categoryName}</span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold mt-1">{g.location}</h2>
                      <p className="text-white/90 text-sm mt-1">{g.count} нийтлэл</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => goBlogs(g.location)}
                      className="shrink-0 px-4 py-2 rounded-xl bg-white/15 border border-white/25 text-white hover:bg-white/20 backdrop-blur"
                    >
                      Бүгдийг харах
                    </button>
                  </div>
                </div>

                {/* Posts list */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {g.items.slice(0, 6).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => goBlogs(g.location)}
                        className="text-left group rounded-2xl border overflow-hidden hover:shadow-lg transition"
                      >
                        <div className="relative">
                          <img src={safeImg(p.image)} alt={p.title} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">{p.title || 'Untitled'}</h3>
                          {p.excerpt ? (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{p.excerpt}</p>
                          ) : null}
                          <div className="text-xs text-gray-500 mt-3 flex items-center justify-between gap-2">
                            <span>{p.author || ''}</span>
                            <span>{p.readTime || ''}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {g.items.length > 6 ? (
                    <div className="mt-6 text-center">
                      <button
                        type="button"
                        onClick={() => goBlogs(g.location)}
                        className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800"
                      >
                        Дахиад {g.items.length - 6} нийтлэл үзэх
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
