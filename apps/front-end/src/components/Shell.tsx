"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Breadcrumb } from "./Breadcrumb";
import { Footer } from "./Footer";
import { PageNav } from "./PageNav";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const isAuth = pathname.startsWith("/login") || pathname.startsWith("/register");

  return (
    <div className="min-h-screen bg-white">
      {!isAuth && <Header />}
      {!isAuth && <PageNav />}
      {!isAuth && pathname !== "/" && <Breadcrumb />}
      <main>{children}</main>
      {!isAuth && <Footer />}
    </div>
  );
}
