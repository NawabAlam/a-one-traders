import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ABOUT_DOC = "about/main";

export async function getAboutContent() {
  const ref = doc(db, ABOUT_DOC);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveAboutContent(data: any) {
  const ref = doc(db, ABOUT_DOC);
  await setDoc(
    ref,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
