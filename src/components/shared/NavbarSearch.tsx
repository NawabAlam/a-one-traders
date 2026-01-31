"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";

type Product = {
  id: string;
  name: string;
};

export default function NavbarSearch() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);

  // load once
  useEffect(() => {
    getAllProducts().then((data: any[]) => {
      setProducts(
        data.map((p) => ({
          id: p.id,
          name: p.name,
        }))
      );
    });
  }, []);

  // search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(q)
    );

    setResults(filtered.slice(0, 5)); // limit results
  }, [query, products]);

  return (
    <div className="relative w-full max-w-xs">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search products…"
        className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--primary)"
      />

      {/* DROPDOWN */}
      {open && query && (
        <div className="absolute z-50 mt-2 w-full bg-white border rounded-xl shadow-lg overflow-hidden">
          {results.length > 0 ? (
            results.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                🔍 {p.name}
              </Link>
            ))
          ) : (
            <div className="p-4 text-sm text-(--text-secondary)">
              <p className="font-medium mb-1">
                No product found
              </p>
              <p className="text-xs">
                Didn’t find what you’re looking for?
              </p>
              <a
                href="https://wa.me/919999701686"
                className="inline-block mt-2 text-(--primary) font-medium"
              >
                Message us for your requirement →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
