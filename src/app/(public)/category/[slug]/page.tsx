"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { unslugifyCategory } from "@/lib/category";

type Product = {
  id: string;
  name: string;
  category: string;
  priceType: "starting" | "fixed" | "on_request";
  price?: number;
  images?: string[];
};

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const categoryName = unslugifyCategory(slug as string);

    getAllProducts().then((all: any[]) => {
      const filtered = all.filter(
        (p) => p.category === categoryName
      );

      setProducts(filtered);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center text-(--text-secondary)">
        Loading products…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-10 text-center text-(--text-primary)">
        {unslugifyCategory(slug as string)}
      </h1>

      {products.length === 0 ? (
        <div className="text-center text-(--text-secondary)">
          No products found in this category
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
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
              <div className="
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
              ">
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

              <h3 className="
                font-semibold
                text-base
                text-(--text-primary)
                leading-snug
                line-clamp-2
              ">
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
