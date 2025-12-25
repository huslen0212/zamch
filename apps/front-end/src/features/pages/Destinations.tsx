'use client';

import { MapPin, Compass, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TravelBlogLoader } from '@/components/Loader';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface Category {
  name: string;
  description: string;
  image: string;
  count: number;
}

interface PostApi {
  id: number;
  image?: string;
  category?: string;
  title?: string;
  excerpt?: string;
  author?: string;
  createdAt?: string;
  readTime?: string;
  location?: string; // destination name
}

interface DestinationUi {
  name: string; // location
  country: string; // category name
  image: string;
  count: number;
}

function safeNum(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function safeImg(url?: string) {
  const u = String(url || '').trim();
  // энгийн хамгаалалт (хоосон / буруу string бол fallback)
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

export function Destinations() {
  const router = useRouter();

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

        // /posts нь шууд array эсвэл {data: []} байж магадгүй
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

  // ✅ Categories-г posts-оос category-гаар нь group хийнэ
  const safeCategories = useMemo<Category[]>(() => {
    const map = new Map<
      string,
      {
        name: string;
        count: number;
        image: string;
        latest: number;
        locFreq: Map<string, number>;
      }
    >();

    for (const p of posts) {
      const cat = parseDisplayName(p.category);
      if (!cat) continue;

      const created = toTime(p.createdAt);
      const img = safeImg(p.image);
      const loc = parseDisplayName(p.location);

      if (!map.has(cat)) {
        map.set(cat, {
          name: cat,
          count: 0,
          image: img,
          latest: created,
          locFreq: new Map(),
        });
      }

      const row = map.get(cat)!;
      row.count += 1;

      // хамгийн сүүлийн постын зургийг category cover болгож ашиглая
      if (created >= row.latest) {
        row.latest = created;
        row.image = img;
      }

      if (loc) {
        row.locFreq.set(loc, (row.locFreq.get(loc) || 0) + 1);
      }
    }

    const result: Category[] = Array.from(map.values()).map((c) => {
      const locs = Array.from(c.locFreq.entries()).sort((a, b) => b[1] - a[1]);
      const uniqueLoc = c.locFreq.size;

      const top = locs.slice(0, 2).map(([name]) => name);
      const topText =
        top.length > 0 ? ` (ихэвчлэн: ${top.join(', ')})` : '';

      return {
        name: c.name,
        count: safeNum(c.count),
        image: safeImg(c.image),
        description: `${uniqueLoc} байршил • ${c.count.toLocaleString()} нийтлэл${topText}`,
      };
    });

    // category нэрээр эрэмбэлэх
    result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [posts]);

  // ✅ Popular Destinations-г category+location-аар group хийнэ (count ихтэйг нь дээр гаргана)
  const safePopular = useMemo<DestinationUi[]>(() => {
    const map = new Map<
      string,
      {
        name: string; // location
        country: string; // category
        image: string;
        count: number;
        latest: number;
      }
    >();

    for (const p of posts) {
      const cat = parseDisplayName(p.category);
      const loc = parseDisplayName(p.location);
      if (!cat || !loc) continue;

      const key = `${cat}|||${loc}`;
      const created = toTime(p.createdAt);
      const img = safeImg(p.image);

      if (!map.has(key)) {
        map.set(key, {
          name: loc,
          country: cat,
          image: img,
          count: 0,
          latest: created,
        });
      }

      const row = map.get(key)!;
      row.count += 1;

      // хамгийн сүүлийн постын зургийг destination cover болгож ашиглая
      if (created >= row.latest) {
        row.latest = created;
        row.image = img;
      }
    }

    const arr = Array.from(map.values())
      .sort((a, b) => b.count - a.count || b.latest - a.latest)
      .slice(0, 9) // UI дээр 3x3
      .map((d) => ({
        ...d,
        image: safeImg(d.image),
      }));

    return arr;
  }, [posts]);

  const goCategory = (categoryName: string) => {
    router.push(`/destinations/${encodeURIComponent(categoryName)}`);
  };

  const goDestination = (categoryName: string, destinationName: string) => {
    const qs = new URLSearchParams({
      category: categoryName,
      destination: destinationName,
    });
    router.push(`/blogs?${qs.toString()}`);
  };

  if (loading) return <TravelBlogLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-700" />
          </div>
        </div>

        <div className="relative text-center text-white px-4 max-w-4xl mx-auto">
          <div className="mb-6 inline-block">
            <div className="relative">
              <MapPin className="w-20 h-20 mx-auto animate-bounce" strokeWidth={1.5} />
              <div className="absolute -inset-4 bg-white/10 rounded-full blur-xl" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Газрууд</h1>
          <p className="text-xl md:text-2xl text-blue-50 leading-relaxed">
            Дэлхийн өнцөг булан бүрээс сонирхолтой газрууд
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-blue-100">
            <Compass className="w-5 h-5" />
            <span className="text-sm">Аялалын шинэ туршлага эхэлцгээе</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ангиллууд</h2>
            <p className="text-gray-600 text-lg">Таны сонирхолд тохирсон ангиллыг сонгоно уу</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safeCategories.map((c, index) => (
              <button
                key={c.name}
                type="button"
                onClick={() => goCategory(c.name)}
                className="group relative h-[350px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer text-left"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={c.image}
                  alt={c.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1501785888041-af3ef285b470';
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
                  <div className="transform group-hover:-translate-y-2 transition-transform duration-500">
                    <h3 className="text-3xl font-bold mb-3">{c.name}</h3>
                    <p className="text-gray-200 mb-4 leading-relaxed">{c.description}</p>
                    <span className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                      {c.count.toLocaleString()} нийтлэл
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-2xl transition-all duration-500" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-4 font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Эрэлттэй</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Алдартай Газрууд</h2>
            <p className="text-gray-600 text-lg">Хамгийн олон нийтлэлтэй аялалын цэгүүд</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safePopular.map((d, i) => (
              <button
                key={`${d.country}-${d.name}-${i}`}
                type="button"
                onClick={() => goDestination(d.country, d.name)}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2 text-left"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1501785888041-af3ef285b470';
                    }}
                    className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 text-blue-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium">{d.country}</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      {d.count} нийтлэл
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {d.name}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
