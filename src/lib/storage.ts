import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { app } from "./firebase";

// Initialize storage
const storage = getStorage(app);

export async function deleteProductImages(productId: string) {
  const folderRef = ref(storage, `products/${productId}`);
  const result = await listAll(folderRef);

  const deletePromises = result.items.map((itemRef) =>
    deleteObject(itemRef)
  );

  await Promise.all(deletePromises);
}
// Upload product image
export async function uploadProductImage(
  file: File,
  productId: string
) {
  const imageRef = ref(
    storage,
    `products/${productId}/${Date.now()}-${file.name}`
  );

  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
}

// Delete product image
export async function deleteProductImage(url: string) {
  const imageRef = ref(storage, url);
  await deleteObject(imageRef);
}
export async function uploadCategoryImage(
  file: File,
  categoryId: string
) {
  const storageRef = ref(storage, `categories/${categoryId}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}
export async function uploadHeroImage(file: File, slideId: string) {
  const storageRef = ref(storage, `hero/${slideId}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

