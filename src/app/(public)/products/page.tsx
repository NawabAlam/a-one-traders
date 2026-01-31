"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { slugifyCategory } from "@/lib/category";

type Product = {
  id: string;
  name: string;
  category: string;
  priceType: "starting" | "fixed" | "on_request";
  price?: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts().then((data: any[]) => {
      setProducts(data);
      setFiltered(data);

      // derive unique categories from DB
      const uniqueCategories = Array.from(
        new Set(data.map((p) => p.category).filter(Boolean)),
      );

      setCategories(uniqueCategories);
      setLoading(false);
    });
  }, []);

  const filterByCategory = (category: string) => {
    setActiveCategory(category);

    if (category === "All") {
      setFiltered(products);
    } else {
      setFiltered(products.filter((p) => p.category === category));
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-(--text-secondary)">
        Loading products…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center text-(--text-primary)">
        Our Products
      </h1>

      {/* CATEGORY FILTER */}
<div className="flex flex-wrap gap-3 justify-center mb-10">
  {/* ALL BUTTON */}
  <button
    onClick={() => filterByCategory("All")}
    className={`px-4 py-2 rounded-full text-sm border
      ${
        activeCategory === "All"
          ? "bg-(--primary) text-white border-(--primary)"
          : "border-(--border)"
      }`}
  >
    All
  </button>

  {/* CATEGORY FILTERS (NO LINKS) */}
  {categories.map((cat) => (
    <button
      key={cat}
      onClick={() => filterByCategory(cat)}
      className={`px-4 py-2 rounded-full text-sm border
        ${
          activeCategory === cat
            ? "bg-(--primary) text-white border-(--primary)"
            : "border-(--border)"
        }`}
    >
      {cat}
    </button>
  ))}
</div>


      {/* PRODUCT GRID */}
      {filtered.length === 0 ? (
        <div className="text-center text-(--text-secondary)">
          No products in this category
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className=" 
    group
    border border-(--border)
    rounded-2xl
    bg-white
    p-4
    transition
    hover:shadow-lg
    hover:-translate-y-0.5
  "
            >
              {/* IMAGE */}
              <div
                className="
    aspect-square
    w-full
    bg-white
    rounded-xl
    border
    mb-4
    flex
    items-center
    justify-center
    p-3
  "
              >
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="
        max-h-full
        max-w-full
        object-contain
        transition
        group-hover:scale-[1.03]
      "
                />
              </div>

              {/* CONTENT */}
              <div className="space-y-1">
                <h3
                  className="
      font-semibold
      text-base
      text-(--text-primary)
      leading-snug
      line-clamp-2
    "
                >
                  {product.name}
                </h3>

                {product.priceType !== "on_request" ? (
                  <p className="text-sm text-(--primary) font-medium">
                    ₹{product.price}{" "}
                    <span className="text-xs text-(--text-secondary)">
                      / Piece
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-(--text-secondary)">
                    Price on request
                  </p>
                )}
              </div>

              {/* CTA HINT */}
              <div className="mt-3 text-sm text-(--primary) opacity-0 group-hover:opacity-100 transition">
                View details →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
