import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,  // ✅ ADDED
  orderBy,
  query,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db, storage } from "./firebase";
import { getAllProducts } from "./products";
import { deleteObject, ref } from "firebase/storage";

/* ================================
   TYPES
================================ */
export type Category = {
  id: string;               // 🔑 REQUIRED
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
    id: d.id,           // ✅ FIXED
    ...(d.data() as Omit<Category, "id">),
  }));
}

/* ================================
   CREATE CATEGORY (NEW)
================================ */
export async function createCategory(category: Omit<Category, "id">) {
  const newCategory = {
    ...category,
    createdAt: new Date().toISOString(),
  };
  
  const ref = await addDoc(collection(db, "categories"), newCategory);
  return { id: ref.id, ...newCategory };
}

/* ================================
   DELETE CATEGORY (UPDATED!)
================================ */
export async function deleteCategory(id: string): Promise<void> {
  // 1. Get category data first to find image URL
  const categoryRef = doc(db, "categories", id);
  const categorySnap = await getDoc(categoryRef);
  
  if (categorySnap.exists()) {
    const data = categorySnap.data();
    const imageUrl = data?.image;
    
    // 2. Delete Firestore document
    await deleteDoc(categoryRef);
    
    // 3. Delete image from Storage if exists
    if (imageUrl) {
      try {
        // Add these imports at top:
        // import { getStorage, ref, deleteObject } from "firebase/storage";
        // import { storage } from "./firebase";
        
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.warn("Image already deleted or not found:", error);
      }
    }
  } else {
    throw new Error("Category not found");
  }
}


/* ================================
   UPDATE CATEGORY
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
