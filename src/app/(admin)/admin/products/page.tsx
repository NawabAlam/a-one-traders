"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProducts, deleteProduct } from "@/lib/products";
import { deleteProductImages } from "@/lib/storage";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    const data = await getAllProducts();
    setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);

      // 1️⃣ delete storage images
      await deleteProductImages(deleteId);

      // 2️⃣ delete firestore doc
      await deleteProduct(deleteId);

      // 3️⃣ update UI
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));

      alert("✅ Product deleted successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete product");
    } finally {
      setDeleting(false);
      setDeleteId(null);
      setDeleteName("");
    }
  };

  if (loading) {
    return <div>Loading products…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>

        <Link
          href="/admin/products/new"
          className="px-4 py-2 rounded-lg bg-(--primary) text-white text-sm"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        {products.length === 0 ? (
          <div className="p-6 text-sm text-(--text-secondary)">
            No products found
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between px-4 py-3 border-b last:border-none"
            >
              <div className="flex items-center gap-3">
                {/* PRODUCT IMAGE */}
                <div className="h-12 w-12 rounded border overflow-hidden bg-gray-100 flex-shrink-0">
                  {p.images && p.images.length > 0 ? (
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

                {/* PRODUCT INFO */}
                <div>
                  <p className="font-medium leading-tight">{p.name}</p>
                  <p className="text-xs text-(--text-secondary)">
                    {p.category}
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Link
                  href={`/admin/products/${p.id}`}
                  className="text-sm text-blue-600"
                >
                  Edit
                </Link>

                <button
                  onClick={() => {
                    setDeleteId(p.id);
                    setDeleteName(p.name);
                  }}
                  className="text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      <DeleteConfirmModal
        open={!!deleteId}
        title="Delete Product"
        description={`Are you sure you want to permanently delete "${deleteName}"? This action cannot be undone.`}
        loading={deleting}
        onCancel={() => {
          if (!deleting) {
            setDeleteId(null);
            setDeleteName("");
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}
