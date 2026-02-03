"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProducts, deleteProduct } from "@/lib/products";
import { getAllCategories } from "@/lib/category";
import { deleteProductImages } from "@/lib/storage";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

export default function AdminProductsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<Record<string, any[]>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);

    const [cats, products] = await Promise.all([
      getAllCategories(),
      getAllProducts(),
    ]);

    const grouped: Record<string, any[]> = {};

    products.forEach((p) => {
      const key = p.category || "Uncategorized";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(p);
    });

    setCategories(cats);
    setProductsByCategory(grouped);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  // ✅ FIXED: Use parameter instead of undefined categoryKey
  const isExpanded = (categoryName: string) => expandedCategories.has(categoryName);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await deleteProductImages(deleteId);
      await deleteProduct(deleteId);

      setProductsByCategory((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((cat) => {
          updated[cat] = updated[cat].filter((p) => p.id !== deleteId);
        });
        return updated;
      });

      alert("✅ Product deleted");
    } catch (e) {
      console.error(e);
      alert("❌ Failed to delete product");
    } finally {
      setDeleting(false);
      setDeleteId(null);
      setDeleteName("");
    }
  };

  if (loading) return <div>Loading products…</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 rounded-lg bg-(--primary) text-white text-sm"
        >
          + Add Product
        </Link>
      </div>

      {categories.map((cat) => {
        const products = productsByCategory[cat.name] || [];
        const categoryKey = cat.name;
        const isCurrentlyExpanded = isExpanded(categoryKey);

        if (products.length === 0) {
          return (
            <div key={cat.id} className="bg-white border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b font-semibold flex justify-between items-center">
                <span>{cat.name}</span>
                <span className="text-sm text-gray-500">0 items</span>
              </div>
              <div className="p-4 text-sm text-gray-500">
                No products in this category
              </div>
            </div>
          );
        }

        const firstProduct = products[0];

        return (
          <div key={cat.id} className="bg-white border rounded-xl overflow-hidden">
            {/* Header with TOP toggle */}
            <div className="px-4 py-3 border-b font-semibold flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span>{cat.name}</span>
                <button
                  onClick={() => toggleCategory(categoryKey)}
                  className="px-2 py-1 text-xs rounded-full bg-red-300 hover:bg-red-200 transition-colors text-black font-medium"
                  title={isCurrentlyExpanded ? "Collapse" : "Expand"}
                >
                  {isCurrentlyExpanded ? "Collapse −" : "Expand +"}
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {products.length} items
              </span>
            </div>

            {/* Always show first product */}
            <div>
              <div className="flex items-center justify-between px-4 py-3 border-b hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded border overflow-hidden bg-gray-100">
                    {firstProduct.images?.[0] ? (
                      <img
                        src={firstProduct.images[0]}
                        alt={firstProduct.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <p className="font-medium">{firstProduct.name}</p>
                </div>

                <div className="flex gap-4">
                  <Link
                    href={`/admin/products/${firstProduct.id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      setDeleteId(firstProduct.id);
                      setDeleteName(firstProduct.name);
                    }}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* COLLAPSED STATE: Show remaining items button */}
            {!isCurrentlyExpanded && products.length > 1 && (
              <div className="border-t bg-gray-50">
                <button
                  onClick={() => toggleCategory(categoryKey)}
                  className="w-full text-left px-4 py-3 text-sm text-blue-600 hover:text-blue-800 hover:bg-gray-100 font-medium transition-colors"
                >
                  Show remaining {products.length - 1} items (+)
                </button>
              </div>
            )}

            {/* EXPANDED STATE: Show all products + BOTTOM collapse button */}
            {isCurrentlyExpanded && (
              <>
                <div className={products.length > 1 ? "max-h-96 overflow-y-auto" : ""}>
                  {products.slice(1).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between px-4 py-3 border-b last:border-none hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded border overflow-hidden bg-gray-100">
                          {p.images?.[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                        <p className="font-medium">{p.name}</p>
                      </div>

                      <div className="flex gap-4">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            setDeleteId(p.id);
                            setDeleteName(p.name);
                          }}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BOTTOM collapse button - always visible when expanded */}
                <div className="border-t bg-gray-50">
                  <button
                    onClick={() => toggleCategory(categoryKey)}
                    className="w-full text-left px-4 py-3 text-sm bg-green-300 text-red-600 hover:text-red-800 hover:bg-gray-100 font-medium transition-colors"
                  >
                    Collapse {products.length} items (−)
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}

      <DeleteConfirmModal
        open={!!deleteId}
        title="Delete Product"
        description={`Delete "${deleteName}" permanently?`}
        loading={deleting}
        onCancel={() => !deleting && setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
