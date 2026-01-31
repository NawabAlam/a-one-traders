import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* ================= TYPES ================= */

export type ContactData = {
  companyName: string;
  address: string;
  phone1?: string;
  phone2?: string;
  email1?: string;
  email2?: string;
  whatsapp: string;
  mapLat: number;
  mapLng: number;
  updatedAt?: any;
};

/* ================= CONSTANT ================= */

const CONTACT_DOC = "contact/main";

/* ================= GET ================= */

export async function getContactData(): Promise<ContactData | null> {
  const ref = doc(db, CONTACT_DOC);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data() as ContactData;
}

/* ================= SAVE ================= */

export async function saveContactData(data: ContactData) {
  const ref = doc(db, CONTACT_DOC);

  await setDoc(
    ref,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
