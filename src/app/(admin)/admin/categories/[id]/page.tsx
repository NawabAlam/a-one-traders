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

  // ALL categories = 1 image
  const maxImages = 1;

  // LOAD CATEGORY
  useEffect(() => {
    if (!id) return;

    getDoc(doc(db, "categories", id as string)).then((snap) => {
      if (!snap.exists()) return;
      const data: any = snap.data();

      setName(data.name || "");
      setSlug(data.slug || "");
      setOrder(data.order || 0);

      // Load first image (works for both image/images)
      setImages(
        data.images && data.images.length > 0 
          ? [data.images[0]] 
          : data.image ? [data.image] : []
      );
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
      setImages([url]); // Replace any existing image
    } finally {
      setUploading(false);
    }
  };

  // REMOVE IMAGE
  const removeImage = (url: string) => {
    setImages([]);
  };

  // SAVE
  const canSave = images.length === 1;

  const save = async () => {
    if (!canSave) {
      alert("Category must have 1 image");
      return;
    }

    setSaving(true);

    try {
      await updateDoc(doc(db, "categories", id as string), {
        name,
        slug,
        order: Number(order),
        image: images[0], // Single image for all
      });

      alert("✅ Category updated successfully");
      router.push("/admin/categories");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-xl border shadow-sm space-y-6">
      <h1 className="text-2xl font-bold">Edit Category</h1>

      {/* Name Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Category Name</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
        />
      </div>

      {/* Slug Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Slug</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="category-slug"
        />
      </div>

      {/* Order Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Display Order</label>
        <input
          type="number"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          placeholder="0"
          min="0"
        />
      </div>

      {/* IMAGE UPLOAD - Single Image */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Category Image (1 required)
        </label>

        <div className="space-y-3">
          {/* Current Image */}
          {images.length > 0 && (
            <div className="relative group">
              <img
                src={images[0]}
                alt="Category"
                className="w-full h-48 sm:h-56 object-cover rounded-xl border shadow-sm"
              />
              <button
                onClick={() => removeImage(images[0])}
                className="absolute top-3 right-3 bg-white text-red-600 text-xs px-3 py-1.5 rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                title="Remove image"
              >
                ✕
              </button>
            </div>
          )}

          {/* Upload Area */}
          {images.length < maxImages && (
            <label className="block w-full h-48 sm:h-56 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-sm cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
              {uploading ? (
                <div className="text-center">
                  <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <div>Uploading...</div>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">
                      📷
                    </div>
                    <div className="font-medium text-gray-700">+ Add Category Image</div>
                    <div className="text-xs text-gray-500 mt-1">Click to upload (JPG, PNG)</div>
                  </div>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) =>
                      e.target.files && uploadImage(e.target.files[0])
                    }
                  />
                </>
              )}
            </label>
          )}
        </div>

        {/* Image requirement notice */}
        {!canSave && (
          <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">
            ⚠️ Please upload exactly 1 category image to save
          </p>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={save}
        disabled={saving || uploading || !canSave}
        className={`
          w-full px-6 py-3 rounded-xl text-white font-medium text-lg
          flex items-center justify-center gap-2 transition-all
          shadow-sm hover:shadow-lg transform hover:-translate-y-0.5
          ${canSave && !saving && !uploading
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
          }
        `}
      >
        {saving && (
          <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {saving ? "Saving..." : "Save Category"}
      </button>
    </div>
  );
}
