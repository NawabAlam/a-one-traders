import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

// PUBLIC – ACTIVE SLIDES
export async function getActiveHeroSlides() {
  const q = query(
    collection(db, "heroSlides"),
    where("isActive", "==", true),
    orderBy("order", "asc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ADMIN
export async function getAllHeroSlides() {
  const q = query(collection(db, "heroSlides"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createHeroSlide(data: any) {
  await addDoc(collection(db, "heroSlides"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateHeroSlide(id: string, data: any) {
  await updateDoc(doc(db, "heroSlides", id), data);
}

export async function deleteHeroSlide(id: string) {
  await deleteDoc(doc(db, "heroSlides", id));
}
