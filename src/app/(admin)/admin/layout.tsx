"use client";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";

const ADMIN_EMAILS = [
  "mohammaddaniyal79@gmail.com",
  "fahad.fahadi666@gmail.com",
  "m.mohsin9525@gmail.com"
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsub = onAuthStateChanged(auth, (user) => {
    const pathname = window.location.pathname;
    const isAuthPage = pathname.includes('/login') || pathname.includes('/forgot-password');
    
    // AUTH PAGES - Skip ALL checks
    if (isAuthPage) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // DASHBOARD PAGES - Check auth
    if (!user) {
      setIsAuthenticated(false);
      router.replace("/admin/login");
    } else if (!ADMIN_EMAILS.includes(user.email ?? "")) {
      auth.signOut();
      setIsAuthenticated(false);
      router.replace("/admin/login");
    } else {
      setIsAuthenticated(true);  // ✅ Triggers navbar IMMEDIATELY
    }
    setLoading(false);
  });

  return () => unsub();
}, [router]);



  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-(--text-secondary)">
        Checking admin access…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--background)">
      {/* Navbar ONLY for authenticated dashboard pages */}
      {isAuthenticated && <AdminNavbar />}
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
