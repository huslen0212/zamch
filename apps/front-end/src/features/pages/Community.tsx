"use client";
import {Globe, Instagram, MessageCircle} from "lucide-react";
import {useState} from "react";

export function Community() {
  const travelers = [
    {
      id: 1,
      name: "Сарантуяа",
      avatar: "https://images.unsplash.com/photo-1585624196654-d78397524a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB0cmF2ZWwlMjBibG9nZ2VyfGVufDF8fHx8MTc2NjM0NzY1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Аялагч & Гэрэл зурагчин",
      countriesVisited: 45,
      postsCount: 23,
      followers: 12500,
      bio: "Дэлхийн гоо үзэсгэлэнг хайж байгаа монгол аялагч. Миний зураг, түүхээр дамжуулан танай амьдралд өнгө нэмье.",
      recentPhoto: "https://images.unsplash.com/photo-1714412192114-61dca8f15f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzY2MjkzMTc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 2,
      name: "Батбаяр",
      avatar: "https://images.unsplash.com/photo-1633457896836-f8d6025c85d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMG9mZmljZXxlbnwxfHx8fDE3NjYzNDc2NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Уулын адал явдалчин",
      countriesVisited: 32,
      postsCount: 18,
      followers: 8900,
      bio: "Өндөр уулс минь гэр орон. Альпын адал явдал, уулын гэрэл зургийн мэргэжилтэн.",
      recentPhoto: "https://images.unsplash.com/photo-1635351261340-55f437000b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMHN1bnNldHxlbnwxfHx8fDE3NjYzMzU5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 3,
      name: "Оюунчимэг",
      avatar: "https://images.unsplash.com/photo-1585624196654-d78397524a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB0cmF2ZWwlMjBibG9nZ2VyfGVufDF8fHx8MTc2NjM0NzY1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Соёлын аялагч",
      countriesVisited: 38,
      postsCount: 31,
      followers: 15200,
      bio: "Соёл, түүх, урлагийг судалж аялдаг. Дэлхийн өв соёлыг хадгалах нь миний зорилго.",
      recentPhoto: "https://images.unsplash.com/photo-1712244876693-a89f6172178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbiUyMHRlbXBsZSUyMGNoZXJyeSUyMGJsb3Nzb218ZW58MXx8fHwxNzY2MzQ3Mjg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 4,
      name: "Болормаа",
      avatar: "https://images.unsplash.com/photo-1756228808949-34a47cd1b457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBjb21tdW5pdHklMjBwZW9wbGV8ZW58MXx8fHwxNzY2MzQ3OTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Хотын судлаач",
      countriesVisited: 41,
      postsCount: 27,
      followers: 11800,
      bio: "Дэлхийн том хотуудын түүх, архитектур, амьдралыг судалж, түүхээр хуваалцдаг.",
      recentPhoto: "https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc2NjI1NTI3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 5,
      name: "Эрдэнэбат",
      avatar: "https://images.unsplash.com/photo-1633457896836-f8d6025c85d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMG9mZmljZXxlbnwxfHx8fDE3NjYzNDc2NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Экстрим адал явдалчин",
      countriesVisited: 29,
      postsCount: 19,
      followers: 9500,
      bio: "Адреналин, адал явдал хайж байгаа монгол залуу. Canyon, сэлж, зулзага бол миний хобби.",
      recentPhoto: "https://images.unsplash.com/photo-1650911563224-0c843a6d843e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW55b24lMjBkZXNlcnQlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzY2MzQ3Mjg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 6,
      name: "Номин",
      avatar: "https://images.unsplash.com/photo-1585624196654-d78397524a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB0cmF2ZWwlMjBibG9nZ2VyfGVufDF8fHx8MTc2NjM0NzY1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      title: "Байгалийн гэрэл зурагчин",
      countriesVisited: 36,
      postsCount: 25,
      followers: 13600,
      bio: "Байгалийн гайхамшиг, нарны жаргалт, Aurora гэрлийг мөнхжүүлж байна.",
      recentPhoto: "https://images.unsplash.com/photo-1488415032361-b7e238421f1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0cyUyMGljZWxhbmR8ZW58MXx8fHwxNzY2MjQxMzAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  const [following, setFollowing] = useState<number[]>([]);

  const handleFollow = (id: number) => {
    if (following.includes(id)) {
      setFollowing(following.filter((fId) => fId !== id));
    } else {
      setFollowing([...following, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1756228808949-34a47cd1b457?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBjb21tdW5pdHklMjBwZW9wbGV8ZW58MXx8fHwxNzY2MzQ3OTY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Community"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-blue-600/80" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4">
            Аялагчдын нийгэмлэг
          </h1>
          <p className="text-xl text-purple-100">
            Дэлхий даяарх аялагч нартай холбогдоорой
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl text-blue-600 mb-2">1,250+</div>
              <div className="text-gray-600">Аялагчид</div>
            </div>
            <div className="text-center">
              <div className="text-4xl text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Орнууд</div>
            </div>
            <div className="text-center">
              <div className="text-4xl text-blue-600 mb-2">5,800+</div>
              <div className="text-gray-600">Нийтлэл</div>
            </div>
            <div className="text-center">
              <div className="text-4xl text-blue-600 mb-2">25K+</div>
              <div className="text-gray-600">Зураг</div>
            </div>
          </div>
        </div>
      </section>

      {/* Travelers Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Манай аялагчид</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Дэлхий даяар аялж буй, өөрийн туршлагаа хуваалцдаг монгол аялагчид
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {travelers.map((traveler) => (
              <article
                key={traveler.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                {/* Recent Photo */}
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={traveler.recentPhoto}
                    alt={traveler.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Avatar */}
                <div className="relative px-6">
                  <img
                    src={traveler.avatar}
                    alt={traveler.name}
                    className="size-20 rounded-full border-4 border-white object-cover -mt-10 relative z-10"
                  />
                </div>

                {/* Info */}
                <div className="p-6 pt-2">
                  <h3 className="text-xl mb-1">{traveler.name}</h3>
                  <p className="text-blue-600 text-sm mb-3">{traveler.title}</p>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {traveler.bio}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-gray-200">
                    <div className="text-center">
                      <div className="text-xl text-gray-900">
                        {traveler.countriesVisited}
                      </div>
                      <div className="text-xs text-gray-500">Орон</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl text-gray-900">
                        {traveler.postsCount}
                      </div>
                      <div className="text-xs text-gray-500">Нийтлэл</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl text-gray-900">
                        {(traveler.followers / 1000).toFixed(1)}K
                      </div>
                      <div className="text-xs text-gray-500">Дагагчид</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFollow(traveler.id)}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                        following.includes(traveler.id)
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {following.includes(traveler.id) ? "Дагаж байна" : "Дагах"}
                    </button>
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <MessageCircle className="size-5 text-gray-600" />
                    </button>
                    <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                      <Instagram className="size-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Globe className="size-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl mb-4">
            Та ч нийгэмлэгт нэгдэх үү?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Өөрийн аяллын түүхээ хуваалцаж, олон аялагчидтай танилцаарай
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition-colors">
            Бүртгүүлэх
          </button>
        </div>
      </section>
    </div>
  );
}
