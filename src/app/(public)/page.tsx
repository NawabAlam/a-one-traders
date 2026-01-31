"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroCarousel from "@/components/shared/HeroCarousel";
import { getActiveCategoriesWithProducts } from "@/lib/category";

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    getActiveCategoriesWithProducts().then((data) => {
      setCategories(data);
      setLoadingCategories(false);
    });
  }, []);

  return (
    <div>
      {/* HERO CAROUSEL */}
      <HeroCarousel />
      
      {/* INTRO SECTION */}
      <section className="py-12 sm:py-16 px-4 bg-(--background)">
        <div className="relative max-w-6xl mx-auto">
          {/* Glow halo (softer on mobile) */}
          <div
            className="absolute -inset-1 sm:-inset-2
              rounded-3xl sm:rounded-[3rem]
              bg-gradient-to-r from-[#C8A165]/30 via-transparent to-[#C8A165]/30
              blur-xl sm:blur-2xl opacity-60"
          />

          {/* Main card */}
          <div
            className="
              relative
              mx-auto
              max-w-[95%] sm:max-w-full
              px-6 sm:px-10
              py-4 sm:py-14
              text-center
              rounded-3xl sm:rounded-[3rem]
              bg-gradient-to-br from-[#6B3E26] via-[#5A321F] to-[#6B3E26]
              text-white
              border border-[#C8A165]/40
              shadow-[0_20px_50px_rgba(0,0,0,0.25)]
            "
          >
            {/* Accent */}
            <div className="mx-auto mb-5 h-1 w-16 sm:w-24 rounded-full bg-[#C8A165]" />

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Premium Garment Packaging
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-lg text-white/90 leading-relaxed">
              Crafted packaging solutions for lehengas, gowns, and premium
              apparel — designed to protect, present, and elevate your clothes.
            </p>

            <p className="mt-3 text-sm sm:text-base text-white/75">
              Trusted by retailers, boutiques, and wholesalers across India.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCT CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-10 text-center text-(--text-primary)">
          Our Product Categories
        </h2>

        {loadingCategories ? (
          <div className="text-center text-(--text-secondary)">
            Loading categories…
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-(--text-secondary)">
            No categories available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="border rounded-xl p-6 text-center hover:shadow-md transition bg-white block"
              >
                {/* SINGLE IMAGE FOR ALL CATEGORIES */}
                <div className="aspect-auto mb-4 rounded-lg overflow-hidden border bg-white">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-100 w-full object-cover"
                    />
                  ) : category.images && category.images.length > 0 ? (
                    <img
                      src={category.images[0]}  // Use first image from others array
                      alt={category.name}
                      className="h-100 w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm text-gray-400 bg-gray-100">
                      No Image
                    </div>
                  )}
                </div>

                <h3 className="font-semibold text-lg text-(--text-primary)">
                  {category.name}
                </h3>

                <span className="inline-block mt-3 text-sm text-(--primary)">
                  View Products →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-white border-t border-b border-(--border)">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-10 text-center text-(--text-primary)">
            Why Choose A-One Traders
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              "Bulk Order Friendly",
              "Custom Sizes & Materials",
              "Competitive Pricing",
              "Trusted by Wholesalers",
            ].map((point) => (
              <div
                key={point}
                className="p-6 border rounded-xl bg-(--background)"
              >
                <h4 className="font-semibold text-(--text-primary)">{point}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-(--primary)">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Looking for Custom Garment Packaging?
          </h2>

          <p className="mb-6">
            Get the best price for bulk orders. Contact us today.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="tel:+919999701686"
              className="px-6 py-3 rounded-lg bg-white text-(--primary)"
            >
              Call Now
            </a>

            <a
              href="https://wa.me/919999701686"
              className="px-6 py-3 rounded-lg border border-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
