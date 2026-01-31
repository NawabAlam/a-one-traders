"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadCategoryImage } from "@/lib/storage";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState(0);

  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // REMOVED: isOthers and maxImages logic - ALL = 1 image
  const maxImages = 1;

  // LOAD CATEGORY
  useEffect(() => {
    if (!id) return;

    getDoc(doc(db, "categories", id as string)).then((snap) => {
      if (!snap.exists()) return;
      const data: any = snap.data();

      setName(data.name);
      setSlug(data.slug);
      setOrder(data.order);

      // Load first image (works for both image/images)
      setImages(data.images && data.images.length > 0 ? [data.images[0]] : data.image ? [data.image] : []);
    });
  }, [id]);

  // IMAGE UPLOAD
  const uploadImage = async (file: File) => {
    if (!id) return;

    if (images.length >= maxImages) {
      alert("Only 1 image allowed");
      return;
    }

    setUploading(true);
    try {
      const url = await uploadCategoryImage(file, slug);
      setImages((prev) => [...prev, url]);
    } finally {
      setUploading(false);
    }
  };

  // REMOVE IMAGE
  const removeImage = (url: string) => {
    setImages((prev) => prev.filter((i) => i !== url));
  };

  // SAVE
  const canSave = images.length === 1;

  const save = async () => {
    if (!canSave) {
      alert("Category must have 1 image");
      return;
    }

    setSaving(true);

    await updateDoc(doc(db, "categories", id as string), {
      name,
      order: Number(order),
      image: images[0], // Single image for all
    });

    setSaving(false);
    alert("Category updated");
    router.push("/admin/categories");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl border space-y-4">
      <h1 className="text-xl font-bold">Edit Category</h1>

      <input
        className="w-full border px-3 py-2 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        className="w-full border px-3 py-2 rounded"
        value={order}
        onChange={(e) => setOrder(Number(e.target.value))}
        placeholder="Order"
      />

      {/* IMAGE GRID */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {images.map((img) => (
            <div key={img} className="relative">
              <img
                src={img}
                className="h-24 w-full object-cover rounded border"
              />
              <button
                onClick={() => removeImage(img)}
                className="absolute top-1 right-1 bg-white text-red-600 text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}

          {images.length < maxImages && (
            <label className="h-24 border-dashed border rounded flex items-center justify-center text-sm cursor-pointer">
              {uploading ? "Uploading…" : "+ Add Image"}
              <input
                type="file"
                hidden
                accept="image/*"
                disabled={uploading}
                onChange={(e) =>
                  e.target.files && uploadImage(e.target.files[0])
                }
              />
            </label>
          )}
        </div>

        {/* REMOVED: Others specific message */}
      </div>

      <button
        onClick={save}
        disabled={saving || uploading || !canSave}
        className={`px-6 py-2 rounded text-white ${
          canSave ? "bg-(--primary)" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
