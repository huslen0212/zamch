'use client';

import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Category {
  name: string;
  description: string;
  image: string;
  count: number;
}

interface Destination {
  name: string;
  country: string;
  image: string;
}

export function Destinations() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/posts/categories/list').then((r) =>
        r.json(),
      ),
      fetch('http://localhost:3001/posts/popular-destinations').then((r) =>
        r.json(),
      ),
    ])
      .then(([cats, popular]) => {
        setCategories(cats);
        setPopularDestinations(popular);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Ачаалж байна...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="text-center text-white px-4">
          <MapPin className="size-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl mb-4">Газрууд</h1>
          <p className="text-xl text-blue-100">
            Дэлхийн өнцөг булан бүрээс сонирхолтой газрууд
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => (
              <div
                key={c.name}
                className="group relative h-[300px] rounded-xl overflow-hidden"
              >
                <img
                  src={c.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                  <h3 className="text-2xl mb-2">{c.name}</h3>
                  <p className="mb-2">{c.description}</p>
                  <span className="px-4 py-1 bg-white/20 rounded-full text-sm">
                    {c.count} нийтлэл
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDestinations.map((d, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md">
                <img src={d.image} className="aspect-[4/3] object-cover" />
                <div className="p-6">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <MapPin className="size-4" />
                    {d.country}
                  </div>
                  <h3 className="text-xl">{d.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
