"use client";

import Link from "next/link";
import { Clock, Tag, TrendingUp, User } from "lucide-react";
import { blogPosts } from "../../data/blogPosts";

interface CategoryPageProps {
  category: string;
}

const categoryToSlug: Record<string, string> = {
  "Далай": "dalai",
  "Уул": "uul",
  "Соёл": "soyl",
  "Хот": "hot",
  "Адал явдал": "adal",
  "Байгаль": "baigal",
};

export function CategoryPage({ category }: CategoryPageProps) {
  const filteredPosts = blogPosts.filter((post) => post.category === category);

  const categoryInfo: Record<string, { description: string; color: string; icon: string }> = {
    "Далай": {
      description: "Халуун орны диваажин далай, тунгалаг ус, цэвэр элсэн эрэг",
      color: "from-blue-500 to-cyan-500",
      icon: "🏖️",
    },
    "Уул": {
      description: "Өндөр уулс, гайхалтай байгаль, уулын адал явдал",
      color: "from-green-600 to-blue-600",
      icon: "⛰️",
    },
    "Соёл": {
      description: "Эртний соёл, түүх, урлаг, уламжлалт зан заншил",
      color: "from-purple-600 to-pink-600",
      icon: "🏛️",
    },
    "Хот": {
      description: "Дэлхийн том хотууд, орчин үеийн архитектур, хотын амьдрал",
      color: "from-gray-700 to-gray-900",
      icon: "🏙️",
    },
    "Адал явдал": {
      description: "Экстрим спорт, явган аялал, адреналин",
      color: "from-orange-600 to-red-600",
      icon: "🎒",
    },
    "Байгаль": {
      description: "Байгалийн гайхамшиг, хойд гэрэл, гайхалтай үзэсгэлэн",
      color: "from-teal-600 to-green-600",
      icon: "🌿",
    },
  };

  const info = categoryInfo[category] || categoryInfo["Далай"];

  // Get related categories (exclude current)
  const relatedCategories = Object.keys(categoryInfo).filter((cat) => cat !== category);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section
        className={`relative h-[400px] flex items-center justify-center bg-gradient-to-r ${info.color}`}
      >
        <div className="text-center text-white px-4">
          <div className="text-6xl mb-4">{info.icon}</div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4">{category}</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">{info.description}</p>
          <div className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
            <Tag className="size-5" />
            <span>{filteredPosts.length} нийтлэл</span>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-2xl text-gray-900 mb-1">{filteredPosts.length}</div>
              <div className="text-sm text-gray-600">Нийтлэл</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-gray-900 mb-1">
                {new Set(filteredPosts.map((p) => p.author)).size}
              </div>
              <div className="text-sm text-gray-600">Зохиогч</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-gray-900 mb-1">
                {filteredPosts.reduce((sum, p) => sum + parseInt(p.readTime), 0)}
              </div>
              <div className="text-sm text-gray-600">Нийт минут</div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl">Бүх нийтлэлүүд</h2>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none">
              <option>Шинээс хуучин</option>
              <option>Хуучнаас шинэ</option>
              <option>Алдартай</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      <User className="size-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl text-gray-600 mb-2">Одоогоор нийтлэл байхгүй байна</h3>
              <p className="text-gray-500">Удахгүй шинэ нийтлэлүүд нэмэгдэх болно</p>
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl mb-8 text-center">Бусад ангилал</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {relatedCategories.map((cat) => {
              const catInfo = categoryInfo[cat];
              const catPosts = blogPosts.filter((p) => p.category === cat);
              const slug = categoryToSlug[cat] || encodeURIComponent(cat);
              return (
                <Link
                  key={cat}
                  href={`/category/${slug}`}
                  className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-all group text-center"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {catInfo.icon}
                  </div>
                  <h3 className="mb-2 group-hover:text-blue-600 transition-colors">{cat}</h3>
                  <p className="text-sm text-gray-500">{catPosts.length} нийтлэл</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className={`py-16 bg-gradient-to-r ${info.color} text-white`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TrendingUp className="size-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl mb-4">{category} ангиллын шинэ нийтлэл хүлээн авах уу?</h2>
          <p className="text-xl opacity-90 mb-8">Сар бүр шинэ түүх, зөвлөмж таны и-мэйл рүү ирнэ</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="И-мэйл хаяг"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 outline-none"
            />
            <button className="px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap">
              Бүртгүүлэх
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
