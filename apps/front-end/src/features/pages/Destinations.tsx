'use client';

import { MapPin, Compass, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TravelBlogLoader } from '@/components/Loader';

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
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/posts/categories/list').then((r) => r.json()),
      fetch('http://localhost:3001/posts/popular-destinations').then((r) => r.json()),
    ])
      .then(([cats, popular]) => {
        setCategories(cats);
        setPopularDestinations(popular);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <TravelBlogLoader />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Enhanced */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse delay-700"></div>
          </div>
        </div>

        <div className="relative text-center text-white px-4 max-w-4xl mx-auto">
          <div className="mb-6 inline-block">
            <div className="relative">
              <MapPin className="w-20 h-20 mx-auto animate-bounce" strokeWidth={1.5} />
              <div className="absolute -inset-4 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Газрууд
          </h1>
          <p className="text-xl md:text-2xl text-blue-50 leading-relaxed">
            Дэлхийн өнцөг булан бүрээс сонирхолтой газрууд
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-blue-100">
            <Compass className="w-5 h-5" />
            <span className="text-sm">Аялалын шинэ туршлага эхэлцгээе</span>
          </div>
        </div>
      </section>

      {/* Categories Section - Enhanced */}
      <section className="py-20 -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ангиллууд
            </h2>
            <p className="text-gray-600 text-lg">
              Таны сонирхолд тохирсон ангиллыг сонгоно уу
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((c, index) => (
              <div
                key={c.name}
                className="group relative h-[350px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
                  <div className="transform group-hover:-translate-y-2 transition-transform duration-500">
                    <h3 className="text-3xl font-bold mb-3">{c.name}</h3>
                    <p className="text-gray-200 mb-4 leading-relaxed">{c.description}</p>
                    <span className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                      {c.count} нийтлэл
                    </span>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-2xl transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations - Enhanced */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-4 font-medium">
              <TrendingUp className="w-4 h-4" />
              <span>Эрэлттэй</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Алдартай Газрууд
            </h2>
            <p className="text-gray-600 text-lg">
              Хамгийн их үзэгчдэд таалагдсан аялалын цэгүүд
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDestinations.map((d, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:-translate-y-2"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="w-full aspect-[4/3] object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-blue-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{d.country}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {d.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
