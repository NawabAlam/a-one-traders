"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllCategories, toggleCategoryStatus } from "@/lib/category";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div>Loading categories…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Categories</h1>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between px-4 py-3 border-b last:border-none"
          >
            <div className="flex items-center gap-3">
              {c.image ? (
                <img
                  src={c.image}
                  className="h-10 w-10 rounded object-cover border"
                />
              ) : (
                <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center text-xs">
                  No Image
                </div>
              )}

              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-gray-500">{c.slug}</p>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <button
                onClick={() => toggleStatus(c.id, c.isActive)}
                className={`text-sm ${
                  c.isActive ? "text-green-600" : "text-gray-400"
                }`}
              >
                {c.isActive ? "Active" : "Hidden"}
              </button>

              <Link
                href={`/admin/categories/${c.id}`}
                className="text-sm text-blue-600"
              >
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
