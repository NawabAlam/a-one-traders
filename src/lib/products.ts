import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

export type Product = {
  id: string;
  name?: string;
  category: string;        // ✅ matches Firestore exactly
  description?: string;
  attributes?: any[];
  images?: string[];
  isActive?: boolean;
  createdAt?: any;
  updatedAt?: any;
};


// CREATE (already used)
export async function createProduct(product: any) {
  const docRef = await addDoc(collection(db, "products"), {
    ...product,
    createdAt: serverTimestamp(),
    isActive: true,
  });

  return docRef.id; // ✅ IMPORTANT
}


// READ ALL
export async function getAllProducts(): Promise<Product[]> {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, "id">),
  }));
}


// READ ONE
export async function getProductById(id: string) {
  const ref = doc(db, "products", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...snap.data(),
  };
}
// UPDATE
export async function updateProduct(id: string, data: any) {
  const ref = doc(db, "products", id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// DELETE
export async function deleteProduct(id: string) {
  const ref = doc(db, "products", id);
  await deleteDoc(ref);
}
