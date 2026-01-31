"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById } from "@/lib/products";
import ProductImageCarousel from "@/components/shared/ProductImageCarousel";
import { getAllProducts } from "@/lib/products";
import Link from "next/link";

type Attribute = {
  label: string;
  value: string;
};

type Product = {
  id: string;
  name: string;
  priceType: "starting" | "fixed" | "on_request";
  price?: number;
  minimumOrderQty?: number;
  description?: string;
  attributes?: Attribute[];
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const current = await getProductById(id as string);
      if (!current) {
        setLoading(false);
        return;
      }

      setProduct(current);

      // fetch all products
      const all = await getAllProducts();

      // related = same category, exclude current
      const relatedProducts = all
        .filter(
          (p: any) => p.category === current.category && p.id !== current.id,
        )
        .slice(0, 4);

      setRelated(relatedProducts);
      setLoading(false);
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-(--text-secondary)">
        Loading product…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center text-(--text-secondary)">
        Product not found
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="border rounded-xl p-4 bg-white">
          {/* IMAGE GALLERY */}
          <div className="space-y-3">
            {/* IMAGE CAROUSEL */}
            <ProductImageCarousel
              images={product.images || []}
              alt={product.name}
            />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-(--text-primary)">
            {product.name}
          </h1>

          {product.priceType !== "on_request" && (
            <p className="text-xl text-(--primary) font-semibold">
              Starting Price: ₹{product.price} / Piece
            </p>
          )}

          {product.minimumOrderQty && (
            <p className="text-sm text-(--text-secondary)">
              Minimum Order Quantity: {product.minimumOrderQty}
            </p>
          )}

          {/* Attributes */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              {product.attributes.map((attr, index) => (
                <div
                  key={index}
                  className="flex justify-between px-4 py-2 border-b last:border-none text-sm"
                >
                  <span className="text-(--text-secondary)">{attr.label}</span>
                  <span className="font-medium">{attr.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-(--text-secondary)">{product.description}</p>
          )}

          {/* CTA */}
          <div className="flex gap-3 pt-4">
            <a
              href="tel:+919999 701686"
              className="flex-1 text-center py-3 rounded-lg border border-(--primary) text-(--primary)"
            >
              Call Us
            </a>

            <a
              href={`https://wa.me/919999701686?text=I am interested in ${product.name}`}
              className="flex-1 text-center py-3 rounded-lg bg-(--primary) text-white"
            >
              Get Best Price
            </a>
            {/* RELATED PRODUCTS */}
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-8 text-(--text-primary)">
            Related Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
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
                    src={p.images?.[0] || "/placeholder.png"}
                    alt={p.name}
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
                <h3
                  className="
            font-semibold
            text-base
            text-(--text-primary)
            leading-snug
            line-clamp-2
          "
                >
                  {p.name}
                </h3>

                {p.priceType !== "on_request" ? (
                  <p className="text-sm text-(--primary) font-medium">
                    ₹{p.price}{" "}
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
        </div>
      )}
    </div>
  );
}
