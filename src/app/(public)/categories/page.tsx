"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getActiveCategoriesWithProducts } from "@/lib/category";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActiveCategoriesWithProducts().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold text-center text-(--text-primary) mb-12">
        Product Categories
      </h1>

      {/* LOADING */}
      {loading && (
        <div className="text-center text-(--text-secondary)">
          Loading categories…
        </div>
      )}

      {/* EMPTY */}
      {!loading && categories.length === 0 && (
        <div className="text-center text-(--text-secondary)">
          No categories available
        </div>
      )}

      {/* CATEGORY GRID */}
      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="
                group
                bg-white
                border
                rounded-2xl
                p-6
                text-center
                transition
                hover:shadow-lg
                hover:-translate-y-1
              "
            >
              {/* IMAGE */}
              <div className="aspect-square mb-4 rounded-xl overflow-hidden border bg-white">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="
                      h-full w-full object-cover
                      transition group-hover:scale-105
                    "
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm text-gray-400 bg-gray-100">
                    No Image
                  </div>
                )}
              </div>

              {/* NAME */}
              <h3 className="text-lg font-semibold text-(--text-primary)">
                {category.name}
              </h3>

              {/* CTA */}
              <p className="mt-2 text-sm text-(--primary)">
                View Products →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
