"use client";
import { MapPin, Users, Target, Heart } from "lucide-react";

export function About() {
  const team = [
    {
      name: "Сарантуяа",
      role: "Үүсгэн байгуулагч & Аяллын зохион байгуулагч",
      image: "https://images.unsplash.com/photo-1585624196654-d78397524a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB0cmF2ZWwlMjBibG9nZ2VyfGVufDF8fHx8MTc2NjM0NzY1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "45 орныг аялсан туршлагатай",
    },
    {
      name: "Батбаяр",
      role: "Гэрэл зурагчин",
      image: "https://images.unsplash.com/photo-1633457896836-f8d6025c85d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwbWVldGluZyUyMG9mZmljZXxlbnwxfHx8fDE3NjYzNDc2NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "10 жил гэрэл зурагчин",
    },
    {
      name: "Оюунчимэг",
      role: "Контент бүтээгч",
      image: "https://images.unsplash.com/photo-1585624196654-d78397524a51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB0cmF2ZWwlMjBibG9nZ2VyfGVufDF8fHx8MTc2NjM0NzY1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Соёл, түүх судлаач",
    },
  ];

  const stats = [
    { label: "Аялсан орон", value: "50+" },
    { label: "Нийтлэл", value: "200+" },
    { label: "Уншигчид", value: "100K+" },
    { label: "Гэрэл зураг", value: "5000+" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1642009071428-119813340e22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBtYXAlMjB3b3JsZHxlbnwxfHx8fDE3NjYzNDc2NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="About us"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4">Бидний тухай</h1>
          <p className="text-xl text-gray-200">
            Дэлхийг хамтдаа нээх аялал
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-6">Бидний түүх</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              2018 онд эхэлсэн "Аялал Нүүдэл" бол зөвхөн блог биш, харин аялах 
              дуртай хүмүүсийн нийгэмлэг юм. Бид дэлхийн өнцөг булан бүрээс 
              түүх, туршлага хуваалцаж, хүмүүст шинэ газар нээх урам зориг өгдөг.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <MapPin className="size-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl mb-2">Бидний эрхэм зорилго</h3>
              <p className="text-gray-600">
                Хүн бүрт дэлхийн гайхамшгийг харах боломж олгох
              </p>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Target className="size-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl mb-2">Бидний зорилт</h3>
              <p className="text-gray-600">
                Үнэн зөв мэдээлэл, туршлагаар хүмүүсийг дэмжих
              </p>
            </div>

            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Heart className="size-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl mb-2">Бидний үнэт зүйлс</h3>
              <p className="text-gray-600">
                Соёлыг хүндэтгэх, байгаль орчныг хамгаалах
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Users className="size-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl mb-4">Бидний баг</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Аялах дуртай, туршлагатай мэргэжилтнүүдийн баг
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="text-center bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl mb-2">{member.name}</h3>
                  <p className="text-blue-600 mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-4">
            Бидэнтэй нэгдээрэй!
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Сар бүр шинэ аяллын түүх, зөвлөмж авахыг хүсвэл бидэнтэй холбогдоорой
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition-colors">
            И-мэйл бүртгүүлэх
          </button>
        </div>
      </section>
    </div>
  );
}
