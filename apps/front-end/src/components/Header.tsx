"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, X, Globe, PenSquare, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push("/");
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Globe className="size-8 text-blue-600" />
            <span className="text-2xl">Wanderlust</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Нүүр
            </Link>
            <Link href="/destinations" className="text-gray-700 hover:text-blue-600 transition-colors">
              Газрууд
            </Link>
            <Link href="/blogs" className="text-gray-700 hover:text-blue-600 transition-colors">
              Блог
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-blue-600 transition-colors">
              Нийгэмлэг
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              Бидний тухай
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Холбоо барих
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Search">
              <Search className="size-5 text-gray-600" />
            </button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/create-post"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <PenSquare className="size-4" />
                  <span>Бичих</span>
                </Link>

                <div className="relative group">
                  <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Profile menu">
                    <img src={user?.avatar} alt={user?.name} className="size-8 rounded-full object-cover" />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <div className="p-3 border-b border-gray-200">
                      <div className="text-sm">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <Link
                      href="/profile"
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
                    >
                      <UserIcon className="size-4" />
                      Профайл
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-red-600"
                    >
                      <LogOut className="size-4" />
                      Гарах
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                  Нэвтрэх
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Бүртгүүлэх
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="size-6 text-gray-600" /> : <Menu className="size-6 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              <Link href="/" onClick={closeMenu} className="text-gray-700 hover:text-blue-600 transition-colors text-left">
                Нүүр
              </Link>
              <Link
                href="/destinations"
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-600 transition-colors text-left"
              >
                Газрууд
              </Link>
              <Link href="/blogs" onClick={closeMenu} className="text-gray-700 hover:text-blue-600 transition-colors text-left">
                Блог
              </Link>
              <Link
                href="/community"
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-600 transition-colors text-left"
              >
                Нийгэмлэг
              </Link>
              <Link href="/about" onClick={closeMenu} className="text-gray-700 hover:text-blue-600 transition-colors text-left">
                Бидний тухай
              </Link>
              <Link
                href="/contact"
                onClick={closeMenu}
                className="text-gray-700 hover:text-blue-600 transition-colors text-left"
              >
                Холбоо барих
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    href="/create-post"
                    onClick={closeMenu}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PenSquare className="size-4" />
                    <span>Нийтлэл бичих</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="size-4" />
                    <span>Гарах</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Нэвтрэх
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Бүртгүүлэх
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
