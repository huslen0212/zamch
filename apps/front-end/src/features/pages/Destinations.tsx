"use client";
import {MapPin} from "lucide-react";
import {blogPosts} from "../../data/blogPosts";

export function Destinations() {
  
  const categories = [
    {
      name: "Далай",
      description: "Халуун орны диваажин газрууд",
      image: "https://images.unsplash.com/photo-1714412192114-61dca8f15f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzY2MjkzMTc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: blogPosts.filter((p) => p.category === "Далай").length,
    },
    {
      name: "Уул",
      description: "Өндөр уулс, гайхалтай байгаль",
      image: "https://images.unsplash.com/photo-1635351261340-55f437000b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMHN1bnNldHxlbnwxfHx8fDE3NjYzMzU5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: blogPosts.filter((p) => p.category === "Уул").length,
    },
    {
      name: "Соёл",
      description: "Түүх, соёлын баялаг газрууд",
      image: "https://images.unsplash.com/photo-1712244876693-a89f6172178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbiUyMHRlbXBsZSUyMGNoZXJyeSUyMGJsb3Nzb218ZW58MXx8fHwxNzY2MzQ3Mjg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: blogPosts.filter((p) => p.category === "Соёл").length,
    },
    {
      name: "Хот",
      description: "Дэлхийн том хотууд",
      image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc2NjI1NTI3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: blogPosts.filter((p) => p.category === "Хот").length,
    },
    {
      name: "Адал явдал",
      description: "Экстрим спорт, адал явдал",
      image: "https://images.unsplash.com/photo-1650911563224-0c843a6d843e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW55b24lMjBkZXNlcnQlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzY2MzQ3Mjg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: blogPosts.filter((p) => p.category === "Адал явдал").length,
    },
    {
      name: "Байгаль",
      description: "Байгалийн гайхамшиг",
      image: "https://images.unsplash.com/photo-1488415032361-b7e238421f1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0cyUyMGljZWxhbmR8ZW58MXx8fHwxNzY2MjQxMzAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      count: blogPosts.filter((p) => p.category === "Байгаль").length,
    },
  ];

  const popularDestinations = [
    {
      name: "Мальдив",
      country: "Энэтхэг далай",
      image: "https://images.unsplash.com/photo-1714412192114-61dca8f15f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwcGFyYWRpc2V8ZW58MXx8fHwxNzY2MjkzMTc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      name: "Швейцарийн Альп",
      country: "Швейцар",
      image: "https://images.unsplash.com/photo-1635351261340-55f437000b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMHN1bnNldHxlbnwxfHx8fDE3NjYzMzU5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      name: "Киото",
      country: "Япон",
      image: "https://images.unsplash.com/photo-1712244876693-a89f6172178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbiUyMHRlbXBsZSUyMGNoZXJyeSUyMGJsb3Nzb218ZW58MXx8fHwxNzY2MzQ3Mjg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      name: "Парис",
      country: "Франц",
      image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc2NjI1NTI3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      name: "Гранд Каньон",
      country: "АНУ",
      image: "https://images.unsplash.com/photo-1650911563224-0c843a6d843e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW55b24lMjBkZXNlcnQlMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzY2MzQ3Mjg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      name: "Исланд",
      country: "Исланд",
      image: "https://images.unsplash.com/photo-1488415032361-b7e238421f1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0cyUyMGljZWxhbmR8ZW58MXx8fHwxNzY2MjQxMzAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="text-center text-white px-4">
          <MapPin className="size-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4">Газрууд</h1>
          <p className="text-xl text-blue-100">
            Дэлхийн өнцөг булан бүрээс сонирхолтой газрууд
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Ангилал сонгох</h2>
            <p className="text-gray-600">
              Таны сонирхлын дагуу аялах газар сонгоорой
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group relative h-[300px] rounded-xl overflow-hidden cursor-pointer"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                  <h3 className="text-2xl mb-2">{category.name}</h3>
                  <p className="text-gray-200 mb-2">{category.description}</p>
                  <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                    {category.count} нийтлэл
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">Алдартай газрууд</h2>
            <p className="text-gray-600">
              Хамгийн их сонирхогдсон аяллын газрууд
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDestinations.map((destination, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-blue-600 mb-2">
                    <MapPin className="size-4" />
                    <span className="text-sm">{destination.country}</span>
                  </div>
                  <h3 className="text-xl group-hover:text-blue-600 transition-colors">
                    {destination.name}
                  </h3>
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
            Та ямар газар аялахыг хүсч байна вэ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Бидэнтэй хуваалцаарай, бид танд зөвлөмж өгье
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-full hover:bg-gray-100 transition-colors">
            Санал илгээх
          </button>
        </div>
      </section>
    </div>
  );
}