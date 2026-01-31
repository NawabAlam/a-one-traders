import Link from "next/link";
import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="border border-[color:var(--border)] rounded-xl overflow-hidden hover:shadow-md transition bg-white">
        
        {/* Image */}
        <div className="h-56 bg-gray-100 flex items-center justify-center">
          <img
            src={product.images[0]}
            alt={product.name}
            className="object-contain h-full"
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg text-[color:var(--text-primary)]">
            {product.name}
          </h3>

          {/* Price */}
          <p className="text-sm text-[color:var(--text-secondary)]">
            {product.priceType === "starting" && (
              <>Starting from <span className="font-medium">₹{product.price}</span></>
            )}
            {product.priceType === "fixed" && (
              <>Price: <span className="font-medium">₹{product.price}</span></>
            )}
            {product.priceType === "on_request" && "Contact for price"}
          </p>

          {/* CTA */}
          <button className="mt-3 w-full py-2 rounded-lg bg-[color:var(--primary)] text-white text-sm">
            Get Best Price
          </button>
        </div>
      </div>
    </Link>
  );
}
