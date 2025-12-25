"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Menu,
  X,
  Globe,
  PenSquare,
  LogOut,
  User,
  ChevronDown,
  Trophy,
} from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { user, isAuthenticated, loading, logout } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    router.push("/");
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  // ✅ Leaderboard нэмсэн
  const navLinks = useMemo(
    () => [
      { href: "/", label: "Нүүр" },
      { href: "/destinations", label: "Газрууд" },
      { href: "/blogs", label: "Блог" },
      { href: "/leaderboard", label: "Leaderboard", icon: Trophy }, // ✅ NEW
      { href: "/community", label: "Аялагчид" },
      { href: "/about", label: "Бидний тухай" },
      { href: "/contact", label: "Холбоо барих" },
    ],
    []
  );

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  const AuthSkeleton = () => (
    <div className="hidden md:flex items-center gap-2 lg:gap-3">
      <div className="h-9 w-28 rounded-full bg-gray-100 animate-pulse" />
      <div className="h-9 w-28 rounded-full bg-gray-100 animate-pulse" />
    </div>
  );

  const MobileAuthSkeleton = () => (
    <div className="px-4 pt-2 pb-1 flex flex-col gap-2 border-t border-gray-200 mt-2">
      <div className="h-11 rounded-lg bg-gray-100 animate-pulse" />
      <div className="h-11 rounded-lg bg-gray-100 animate-pulse" />
    </div>
  );

  return (
    <header
      className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
            onClick={closeMenu}
          >
            <Globe className="size-6 sm:size-7 lg:size-8 text-blue-600" />
            <span className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
              Замч
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm xl:text-base rounded-lg transition-all font-medium flex items-center gap-2 ${
                    active
                      ? "text-blue-700 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {Icon ? <Icon className="size-4" /> : null}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Хайх"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="size-4 sm:size-5 text-gray-600" />
            </button>

            {/* Desktop Auth Actions */}
            {loading ? (
              <AuthSkeleton />
            ) : isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2 lg:gap-3">
                <Link
                  href="/create-post"
                  className="flex items-center gap-1.5 px-3 lg:px-4 py-1.5 lg:py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all text-sm lg:text-base font-medium shadow-sm hover:shadow"
                >
                  <PenSquare className="size-3.5 lg:size-4" />
                  <span className="hidden lg:inline">Бичих</span>
                  <span className="lg:hidden">Пост</span>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-1.5 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Профайл цэс"
                  >
                    <img
                      src={user?.avatar || "/default-avatar.png"}
                      alt={user?.name || "User"}
                      className="size-7 lg:size-8 rounded-full object-cover border-2 border-gray-200"
                    />
                    <ChevronDown
                      className={`size-3.5 text-gray-600 transition-transform ${
                        isProfileOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      <div className="p-3 border-b border-gray-100 bg-gray-50">
                        <div className="text-sm font-semibold text-gray-900">
                          {user?.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 truncate">
                          {user?.email}
                        </div>
                      </div>

                      {/* ✅ profile нь өөрийн профайл: /profile эсвэл /profile/{id} байж болно */}
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2.5 text-gray-700"
                      >
                        <User className="size-4" />
                        Профайл
                      </Link>

                      {/* ✅ leaderboard shortcut */}
                      <Link
                        href="/leaderboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-2.5 text-gray-700"
                      >
                        <Trophy className="size-4" />
                        Leaderboard
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 transition-colors flex items-center gap-2.5 text-red-600 border-t border-gray-100"
                      >
                        <LogOut className="size-4" />
                        Гарах
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 lg:gap-3">
                <Link
                  href="/login"
                  className="px-3 lg:px-4 py-1.5 lg:py-2 text-sm lg:text-base text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-all font-medium"
                >
                  Нэвтрэх
                </Link>
                <Link
                  href="/register"
                  className="px-3 lg:px-4 py-1.5 lg:py-2 text-sm lg:text-base bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow"
                >
                  Бүртгүүлэх
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Цэс"
            >
              {isMenuOpen ? (
                <X className="size-5 sm:size-6 text-gray-600" />
              ) : (
                <Menu className="size-5 sm:size-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        {isSearchOpen && (
          <div className="hidden md:block py-3 border-t border-gray-200 animate-slideDown">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                placeholder="Хайх..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Tablet Navigation (md-lg) */}
        <nav className="hidden md:flex lg:hidden items-center gap-1 py-2 border-t border-gray-100 overflow-x-auto">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm rounded-lg transition-all font-medium whitespace-nowrap flex items-center gap-2 ${
                  active
                    ? "text-blue-700 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {Icon ? <Icon className="size-4" /> : null}
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 animate-slideDown">
            <nav className="flex flex-col py-3 gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`px-4 py-2.5 transition-all rounded-lg font-medium flex items-center gap-2 ${
                      active
                        ? "text-blue-700 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {Icon ? <Icon className="size-4" /> : null}
                    {link.label}
                  </Link>
                );
              })}

              {/* Search Bar (Mobile) */}
              <div className="px-4 py-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Хайх..."
                    className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Mobile Auth Actions */}
              {loading ? (
                <MobileAuthSkeleton />
              ) : (
                <div className="px-4 pt-2 pb-1 flex flex-col gap-2 border-t border-gray-200 mt-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/create-post"
                        onClick={closeMenu}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm"
                      >
                        <PenSquare className="size-4" />
                        <span>Нийтлэл бичих</span>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={closeMenu}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                      >
                        <User className="size-4" />
                        <span>Профайл</span>
                      </Link>

                      {/* ✅ mobile shortcut */}
                      <Link
                        href="/leaderboard"
                        onClick={closeMenu}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                      >
                        <Trophy className="size-4" />
                        <span>Leaderboard</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all font-medium"
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
                        className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-center font-medium"
                      >
                        Нэвтрэх
                      </Link>
                      <Link
                        href="/register"
                        onClick={closeMenu}
                        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-center font-medium shadow-sm"
                      >
                        Бүртгүүлэх
                      </Link>
                    </>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
}
