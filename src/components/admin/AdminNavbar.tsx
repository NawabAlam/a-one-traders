"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useState } from "react";  // ← ADD THIS

const navItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Categories", href: "/admin/categories" },
  { label: "Hero Slider", href: "/admin/hero" },
  { label: "About Page", href: "/admin/about" },
  { label: "Contact Page", href: "/admin/contact" },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);  // ← ADD STATE

  const logout = async () => {
    const ok = confirm("Logout from admin?");
    if (!ok) return;

    await signOut(auth);
    router.replace("/admin/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* LEFT: Brand + Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/admin"
            className="font-bold text-lg text-(--text-primary)"
          >
            A-One Admin
          </Link>

          {/* DESKTOP NAV - HIDE ON MOBILE */}
          <nav className="hidden md:flex gap-6">  {/* ← ADD hidden md:flex */}
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition
                    ${
                      active
                        ? "text-(--primary) border-b-2 border-(--primary)"
                        : "text-(--text-secondary) hover:text-(--text-primary)"
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">  {/* ← WRAP BUTTONS */}
          {/* MOBILE HAMBURGER - SHOW ON MOBILE */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}  // ← ADD TOGGLE
            className="md:hidden p-1"  // ← ADD md:hidden
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* RIGHT: Logout */}
          <button
            onClick={logout}
            className="text-sm px-3 py-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileOpen && (  // ← ADD MOBILE MENU
        <div className="md:hidden bg-white border-b px-4 py-2">  {/* ← SLIDE DOWN */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}  // ← CLOSE ON CLICK
                  className={`text-sm font-medium py-2 transition block
                    ${
                      active
                        ? "text-(--primary) border-b-2 border-(--primary)"
                        : "text-(--text-secondary) hover:text-(--text-primary)"
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
