import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./firebase";
import { getAllProducts } from "./products";

/* ================================
   TYPES
================================ */
export type Category = {
  id: string;              // 🔑 REQUIRED
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  image?: string | null;
};

/* ================================
   SLUG HELPERS (KEEP)
================================ */
export function slugifyCategory(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function unslugifyCategory(slug: string) {
  return slug
    .split("-")
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

/* ================================
   GET ALL CATEGORIES (ADMIN)
================================ */
export async function getAllCategories(): Promise<Category[]> {
  const q = query(
    collection(db, "categories"),
    orderBy("order", "asc")
  );

  const snap = await getDocs(q);

  return snap.docs.map((d) => ({
    id: d.id,          // ✅ FIXED
    ...(d.data() as Omit<Category, "id">),
  }));
}

/* ================================
   CREATE / UPDATE CATEGORY
================================ */
export async function upsertCategory(category: Category) {
  const ref = doc(db, "categories", category.id);
  await setDoc(ref, category, { merge: true });
}

/* ================================
   TOGGLE ACTIVE (ADMIN)
================================ */
export async function toggleCategoryStatus(
  id: string,
  isActive: boolean
) {
  await updateDoc(doc(db, "categories", id), {
    isActive,
  });
}

/* ================================
   PUBLIC: ONLY ACTIVE + NON-EMPTY
================================ */
export async function getActiveCategoriesWithProducts() {
  const [categories, products] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
  ]);

  const productCountMap: Record<string, number> = {};

  products.forEach((product: any) => {
    if (product.category) {
      productCountMap[product.category] =
        (productCountMap[product.category] || 0) + 1;
    }
  });

  return categories.filter(
    (cat) =>
      cat.isActive &&
      productCountMap[cat.name] &&
      productCountMap[cat.name] > 0
  );
}
