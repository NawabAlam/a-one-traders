"use client";

import { upsertCategory, slugifyCategory } from "@/lib/category";

const CATEGORIES = [
  "Lehenga Covers",
  "Saree Covers",
  "Gown Covers",
  "Suit Covers",
  "Garment Bags",
  "Packaging Tray",
  "Lehenga Box",
  "Trousseau Lehenga Box",
  "Custom Packaging",
  "Others",
];

export default function SeedCategoriesPage() {
  const seedCategories = async () => {
    try {
      for (let i = 0; i < CATEGORIES.length; i++) {
        const name = CATEGORIES[i];

        await upsertCategory({
          name,
          slug: slugifyCategory(name),
          order: i + 1,
          isActive: true,
          image: null,
        });
      }

      alert("✅ Categories seeded successfully");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to seed categories");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl border space-y-4">
      <h1 className="text-xl font-bold">Seed Categories</h1>

      <p className="text-sm text-gray-600">
        This will create or update all default product categories
        in Firestore. Run this only once.
      </p>

      <button
        onClick={seedCategories}
        className="px-4 py-2 rounded-lg bg-(--primary) text-white"
      >
        Seed Categories
      </button>
    </div>
  );
}
