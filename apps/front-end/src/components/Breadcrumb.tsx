"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { blogPosts } from "../data/blogPosts";

const slugToCategory: Record<string, string> = {
  dalai: "Далай",
  uul: "Уул",
  soyl: "Соёл",
  hot: "Хот",
  adal: "Адал явдал",
  baigal: "Байгаль",
};

const staticLabels: Record<string, string> = {
  blogs: "Бүх нийтлэл",
  destinations: "Газрууд",
  community: "Нийгэмлэг",
  "travel-map": "Аяллын газрын зураг",
  "create-post": "Нийтлэл бичих",
  profile: "Профайл",
  leaderboard: "Эрхлэгчдийн самбар",
  about: "Бидний тухай",
  contact: "Холбоо барих",
  login: "Нэвтрэх",
  register: "Бүртгүүлэх",
  category: "Ангилал",
  blog: "Блог",
};

export function Breadcrumb() {
  const pathname = usePathname() || "/";
  const params = useParams();

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  const crumbs: { href: string; label: string }[] = [{ href: "/", label: "Нүүр" }];

  // Special cases
  if (segments[0] === "blog" && segments[1]) {
    const id = Number(Array.isArray(params?.id) ? params?.id[0] : params?.id);
    const post = blogPosts.find((p) => p.id === id);
    crumbs.push({ href: "/blogs", label: "Блог" });
    crumbs.push({ href: pathname, label: post?.title || `Нийтлэл #${segments[1]}` });
  } else if (segments[0] === "category" && segments[1]) {
    const slug = String(segments[1]);
    crumbs.push({ href: "/blogs", label: "Блог" });
    crumbs.push({ href: "/blogs", label: "Ангилал" });
    crumbs.push({ href: pathname, label: slugToCategory[slug] || slug });
  } else {
    // Generic mapping
    let current = "";
    for (const seg of segments) {
      current += `/${seg}`;
      const label = staticLabels[seg] || decodeURIComponent(seg);
      crumbs.push({ href: current, label });
    }
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ol className="flex items-center gap-2 text-sm text-gray-600">
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={`${c.href}-${i}`} className="flex items-center gap-2">
                {i === 0 ? <Home className="size-4" /> : <ChevronRight className="size-4 text-gray-400" />}
                {isLast ? (
                  <span className="text-gray-900">{c.label}</span>
                ) : (
                  <Link href={c.href} className="hover:text-blue-600 transition-colors">
                    {c.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
