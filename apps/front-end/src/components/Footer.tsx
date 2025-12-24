"use client";
import { MapPin, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="size-8 text-blue-600" />
              <span className="text-xl text-white">Аялал Нүүдэл</span>
            </div>
            <p className="text-gray-400 max-w-md">
              Дэлхийн хамгийн үзэсгэлэнтэй газруудыг нээх таны хаалга.
              Дэлхий даяар мартагдашгүй аялалд бидэнтэй нэгдээрэй.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-blue-600 rounded-full transition-colors"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-blue-600 rounded-full transition-colors"
              >
                <Facebook className="size-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 hover:bg-blue-600 rounded-full transition-colors"
              >
                <Twitter className="size-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Холбоосууд</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Бидний тухай
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Газрууд
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Аяллын зөвлөмжүүд
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Холбоо барих
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white mb-4">Ангилалууд</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Далай
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Уул
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Соёл
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Адал явдал
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 Аялал Нүүдэл. Бүх эрх хуулиар хамгаалагдсан.</p>
        </div>
      </div>
    </footer>
  );
}