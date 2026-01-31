"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

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

  const logout = async () => {
    const ok = confirm("Logout from admin?");
    if (!ok) return;

    await signOut(auth);
    router.replace("/admin/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* LEFT: Brand + Nav */}
        <div className="flex items-center gap-8">
          <Link
            href="/admin"
            className="font-bold text-lg text-(--text-primary)"
          >
            A-One Admin
          </Link>

          <nav className="flex gap-6">
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

        {/* RIGHT: Logout */}
        <button
          onClick={logout}
          className="text-sm px-3 py-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
