"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";  // ✅ CHANGED: setDoc instead of addDoc
import { db } from "@/lib/firebase";
import { uploadCategoryImage } from "@/lib/storage";

export default function AddCategoryPage() {
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name: string) => {
    setName(name);
    setSlug(generateSlug(name));
  };

  const saveCategory = async () => {
    if (!name || !imageFile || !slug) {
      alert("Name, slug, and image are required");
      return;
    }

    setSaving(true);
    try {
      // 1. Upload image first
      setUploading(true);
      const imageUrl = await uploadCategoryImage(imageFile, slug);
      
      // 2. ✅ FIXED: Use setDoc with CUSTOM ID = SLUG
      await setDoc(doc(db, "categories", slug), {  // ← SLUG as document ID!
        id: slug,  // ✅ Store slug as id field too
        name,
        slug,
        order: Number(order),
        isActive: true,  // ✅ Default active
        image: imageUrl,
        createdAt: new Date().toISOString(),
      });

      alert("✅ Category created successfully!");
      router.push("/admin/categories");
    } catch (error: any) {
      console.error(error);
      // ✅ Handle duplicate slug
      if (error.code === 'already-exists') {
        alert("❌ Category slug already exists! Please use a different name.");
      } else {
        alert("❌ Failed to create category");
      }
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-4 sm:p-6 rounded-xl border shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Category</h1>
        <button
          onClick={() => router.push("/admin/categories")}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
      </div>

      {/* Name Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Category Name</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. Lehenga Covers"
        />
      </div>

      {/* Slug Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Slug (Document ID)</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 bg-gray-50"
          value={slug}
          onChange={(e) => setSlug(generateSlug(e.target.value))}  // ✅ Auto-format
          placeholder="lehenga-covers"
        />
      </div>

      {/* Order Input */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Display Order</label>
        <input
          type="number"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          placeholder="0"
          min="0"
        />
      </div>

      {/* IMAGE UPLOAD */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Category Image (Required)</label>
        
        <div className="space-y-3">
          {/* Preview */}
          {imagePreview && (
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 sm:h-56 object-cover rounded-xl border shadow-sm"
              />
              <button
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                  if (imagePreview) URL.revokeObjectURL(imagePreview);
                }}
                className="absolute top-3 right-3 bg-white text-red-600 text-xs px-3 py-1.5 rounded-lg shadow-lg border opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
              >
                ✕
              </button>
            </div>
          )}

          {/* Upload Area */}
          {!imagePreview && (
            <label className="block w-full h-48 sm:h-56 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-sm cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl">
                  📷
                </div>
                <div className="font-medium text-gray-700">+ Upload Category Image</div>
                <div className="text-xs text-gray-500 mt-1">Click or drag JPG, PNG (Recommended: 300x300px)</div>
              </div>
              <input
                type="file"
                hidden
                accept="image/*"
                disabled={uploading}
                onChange={(e) => e.target.files && handleImageSelect(e.target.files![0])}
              />
            </label>
          )}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={saveCategory}
        disabled={saving || uploading || !name || !slug || !imageFile}
        className={`
          w-full px-6 py-3 rounded-xl text-white font-medium text-lg
          flex items-center justify-center gap-2 transition-all
          shadow-sm hover:shadow-lg transform hover:-translate-y-0.5
          ${name && slug && imageFile && !saving && !uploading
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
          }
        `}
      >
        {saving || uploading ? (
          <>
            <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {saving ? "Creating..." : "Uploading..."}
          </>
        ) : (
          "Create Category"
        )}
      </button>
    </div>
  );
}
