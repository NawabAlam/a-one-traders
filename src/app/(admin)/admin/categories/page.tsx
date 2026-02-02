"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllCategories, toggleCategoryStatus, deleteCategory } from "@/lib/category";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await getAllCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleStatus = async (id: string, current: boolean) => {
    await toggleCategoryStatus(id, !current);
    load();
  };

  // ✅ FIXED - Now actually deletes!
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" category permanently?`)) return;
    
    setDeletingId(id);
    try {
      await deleteCategory(id);  // ✅ NOW WORKS
      load();
      alert("✅ Category deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("❌ Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 space-y-2">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
        <p>Loading categories…</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-6">
      {/* HEADER WITH ADD BUTTON */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors w-full sm:w-auto text-center shadow-sm"
        >
          + Add Category
        </Link>
      </div>

      {/* EMPTY STATE */}
      {categories.length === 0 ? (
        <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">
            📂
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No categories yet</h3>
          <p className="text-gray-500 mb-8">Get started by creating your first category</p>
          <Link
            href="/admin/categories/new"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-lg"
          >
            + Create First Category
          </Link>
        </div>
      ) : (
        /* CATEGORIES LIST - MOBILE RESPONSIVE */
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {categories.map((c) => (
              <div key={c.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                {/* MOBILE LAYOUT */}
                <div className="block sm:hidden space-y-3">
                  <div className="flex items-start gap-3">
                    {/* Image */}
                    <div className="w-16 h-16 flex-shrink-0 rounded-xl border overflow-hidden bg-gray-100">
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base leading-tight line-clamp-2">
                        {c.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{c.slug}</p>
                    </div>
                  </div>

                  {/* Mobile Actions - NOW WITH DELETE */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => toggleStatus(c.id, c.isActive)}
                      className={`py-2.5 px-3 text-xs font-medium rounded-lg transition-colors ${
                        c.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {c.isActive ? "Active" : "Hidden"}
                    </button>
                    <Link
                      href={`/admin/categories/${c.id}`}
                      className="py-2.5 px-3 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      disabled={deletingId === c.id}
                      className="py-2.5 px-3 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 flex items-center justify-center transition-colors disabled:opacity-50"
                    >
                      {deletingId === c.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                {/* DESKTOP LAYOUT */}
                <div className="hidden sm:flex items-center justify-between gap-4 py-2">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Image */}
                    <div className="w-12 h-12 flex-shrink-0 rounded-xl border overflow-hidden bg-gray-100">
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                          No img
                        </div>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base line-clamp-1">{c.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{c.slug}</p>
                    </div>
                  </div>
                  
                  {/* Desktop Actions - NOW WITH DELETE */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleStatus(c.id, c.isActive)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                        c.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      } whitespace-nowrap`}
                    >
                      {c.isActive ? "Active" : "Hidden"}
                    </button>
                    <Link
                      href={`/admin/categories/${c.id}`}
                      className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 whitespace-nowrap transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      disabled={deletingId === c.id}
                      className="px-4 py-2 text-sm bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 whitespace-nowrap transition-colors disabled:opacity-50"
                    >
                      {deletingId === c.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
