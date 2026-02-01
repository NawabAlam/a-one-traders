"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import NavbarSearch from "../shared/NavbarSearch";
//import Image from "@/app/(public)/images/logo.png";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const linkClass = (href: string) =>
    `transition ${
      isActive(href)
        ? "text-(--primary) font-semibold"
        : "text-(--text-secondary) hover:text-(--primary)"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-(--border)">
      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-(--primary)"
        >
          <Image
            src="/images/logo.png"
            alt="A-One Traders"
            width={120}
            height={120}
            quality={100} // ↑ Max quality (default 75)
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg" // ↑ rounded-lg sharper
            priority
          />
          A-One Traders
        </Link>

        {/* 🔍 SEARCH — DESKTOP */}
        <div className="hidden md:block flex-1 max-w-xs">
          <NavbarSearch />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>
          <Link href="/products" className={linkClass("/products")}>
            Products
          </Link>
          <Link href="/categories" className={linkClass("/categories")}>
            Categories
          </Link>
          <Link href="/about" className={linkClass("/about")}>
            About
          </Link>
          <Link href="/contact" className={linkClass("/contact")}>
            Contact
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Call Us – DESKTOP */}
          <a
            href="tel:+919999701686"
            className="hidden md:inline-block px-4 py-2 text-sm rounded-lg border border-(--primary) text-(--primary)"
          >
            Call Us
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919999701686"
            className="px-4 py-2 text-sm rounded-lg bg-(--primary) text-white"
          >
            WhatsApp
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-(--text-primary)"
            aria-label="Toggle menu"
          >
            {open ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>
      </div>

      {/* 🔍 SEARCH — MOBILE (ALWAYS VISIBLE) */}
      <div className="md:hidden px-4 pb-3">
        <NavbarSearch />
      </div>

      {/* 📱 MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-(--border) bg-white">
          <nav className="flex flex-col px-4 py-4 gap-4 text-sm font-medium">
            <Link
              onClick={() => setOpen(false)}
              href="/"
              className={linkClass("/")}
            >
              Home
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/products"
              className={linkClass("/products")}
            >
              Products
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/categories"
              className={linkClass("/categories")}
            >
              Categories
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/about"
              className={linkClass("/about")}
            >
              About
            </Link>
            <Link
              onClick={() => setOpen(false)}
              href="/contact"
              className={linkClass("/contact")}
            >
              Contact
            </Link>

            <a
              href="tel:+919999701686"
              className="mt-2 text-center py-2 rounded-lg border border-(--primary) text-(--primary)"
            >
              Call Us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
