"use client";

import { Header } from "./Header";
import { Footer } from "./Footer";

export function Shell({ children }: { children: React.ReactNode }) {
  // const pathname = usePathname() || "/";
  // const isAuth = pathname.startsWith("/login") || pathname.startsWith("/register");

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/*{!isAuth && <Header />}*/}
      {/*{!isAuth && <PageNav />}*/}
      {/*{!isAuth && pathname !== "/" && <Breadcrumb />}*/}
      <main>{children}</main>
      {/*{!isAuth && <Footer />}*/}
      <Footer />
    </div>
  );
}
