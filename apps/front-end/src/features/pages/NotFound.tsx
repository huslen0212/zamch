"use client";
import { Home, Search, MapPin, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8 relative">
          <div className="text-[150px] md:text-[200px] leading-none text-blue-200 select-none">
            404
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <MapPin className="size-24 md:size-32 text-blue-600 animate-bounce" />
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-4xl mb-4 text-gray-900">
          Хуудас олдсонгүй
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Уучлаарай, таны хайж байгаа хуудас олдсонгүй. Магадгүй устгагдсан эсвэл 
          хаяг буруу байж болох юм.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Home className="size-5" />
            Нүүр хуудас руу буцах
          </button>
          <button className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <Search className="size-5" />
            Нийтлэл хайх
          </button>
        </div>

        {/* Popular Links */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl mb-6 text-gray-900">Алдартай хуудсууд</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="#"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <Home className="size-5 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <div className="group-hover:text-blue-600 transition-colors">
                    Нүүр хуудас
                  </div>
                  <div className="text-sm text-gray-500">
                    Онцлох нийтлэлүүд
                  </div>
                </div>
              </div>
            </a>

            <a
              href="#"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-600 transition-colors">
                  <MapPin className="size-5 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <div className="group-hover:text-blue-600 transition-colors">
                    Газрууд
                  </div>
                  <div className="text-sm text-gray-500">
                    Аяллын газрууд
                  </div>
                </div>
              </div>
            </a>

            <a
              href="#"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-600 transition-colors">
                  <Search className="size-5 text-green-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <div className="group-hover:text-blue-600 transition-colors">
                    Бүх нийтлэл
                  </div>
                  <div className="text-sm text-gray-500">
                    200+ нийтлэл
                  </div>
                </div>
              </div>
            </a>

            <a
              href="#"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-600 transition-colors">
                  <ArrowLeft className="size-5 text-orange-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <div className="group-hover:text-blue-600 transition-colors">
                    Бидний тухай
                  </div>
                  <div className="text-sm text-gray-500">
                    Багийн танилцуулга
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-gray-500">
          Тусламж хэрэгтэй юу?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Бидэнтэй холбогдох
          </a>
        </p>
      </div>
    </div>
  );
}
