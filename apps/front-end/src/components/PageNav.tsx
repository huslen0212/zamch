"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems: Array<{ href: string; label: string; match?: "exact" | "prefix" }> = [
  { href: "/", label: "Нүүр", match: "exact" },
  { href: "/blogs", label: "Бүх нийтлэл", match: "exact" },
  { href: "/blog/1", label: "Нийтлэл", match: "prefix" },
  { href: "/create-post", label: "Нийтлэл бичих", match: "exact" },
  { href: "/destinations", label: "Газрууд", match: "exact" },
  { href: "/travel-map", label: "Газрын зураг", match: "exact" },
  { href: "/community", label: "Аялагчид", match: "exact" },
  { href: "/profile", label: "Профайл", match: "exact" },
  { href: "/leaderboard", label: "Leaderboard", match: "exact" },
  { href: "/login", label: "Нэвтрэх", match: "exact" },
];

function isActive(pathname: string, href: string, match: "exact" | "prefix" = "exact") {
  if (match === "exact") return pathname === href;
  // prefix match
  if (href === "/blog/1") return pathname.startsWith("/blog");
  return pathname.startsWith(href);
}

export function PageNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 py-4">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href, item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
