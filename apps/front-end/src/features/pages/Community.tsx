'use client';
import { Globe, Instagram, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Traveler {
  id: string;
  name: string;
  avatar: string;
  title: string;
  countriesVisited: number;
  postsCount: number;
  followers: number;
  bio: string;
  recentPhoto: string;
}

export function Community() {
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/community/travelers')
      .then((res) => res.json())
      .then((data) => setTravelers(data))
      .finally(() => setLoading(false));
  }, []);

  const handleFollow = (id: string) => {
    setFollowing((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Ачаалж байна...
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
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-blue-600/80" />
        <div className="relative z-10 text-white text-center">
          <h1 className="text-5xl mb-4">Аялагчдын нийгэмлэг</h1>
          <p className="text-xl">Дэлхий даяарх аялагч нартай холбогдоорой</p>
        </div>
      </section>

      {/* Travelers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {travelers.map((traveler) => (
            <article
              key={traveler.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={traveler.recentPhoto}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative px-6">
                <img
                  src={traveler.avatar}
                  className="size-20 rounded-full border-4 border-white -mt-10"
                />
              </div>

              <div className="p-6 pt-2">
                <h3 className="text-xl">{traveler.name}</h3>
                <p className="text-blue-600 text-sm mb-2">{traveler.title}</p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {traveler.bio}
                </p>

                <div className="grid grid-cols-3 text-center border-y py-4 mb-4">
                  <div>
                    <div className="text-xl">{traveler.countriesVisited}</div>
                    <div className="text-xs text-gray-500">Орон</div>
                  </div>
                  <div>
                    <div className="text-xl">{traveler.postsCount}</div>
                    <div className="text-xs text-gray-500">Нийтлэл</div>
                  </div>
                  <div>
                    <div className="text-xl">
                      {(traveler.followers / 1000).toFixed(1)}K
                    </div>
                    <div className="text-xs text-gray-500">Дагагч</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleFollow(traveler.id)}
                    className={`flex-1 px-4 py-2 rounded-lg ${
                      following.includes(traveler.id)
                        ? 'bg-gray-200'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {following.includes(traveler.id) ? 'Дагаж байна' : 'Дагах'}
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg">
                    <MessageCircle className="size-5" />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-lg">
                    <Instagram className="size-5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center">
        <Globe className="size-16 mx-auto mb-6" />
        <h2 className="text-4xl mb-4">Та ч нийгэмлэгт нэгдэх үү?</h2>
        <button className="px-8 py-3 bg-white text-blue-600 rounded-full">
          Бүртгүүлэх
        </button>
      </section>
    </div>
  );
}
