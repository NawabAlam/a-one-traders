"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/products";
import { uploadProductImage } from "@/lib/storage";
import { getAllCategories } from "@/lib/category"; // ✅ ADDED

type Attribute = {
  label: string;
  value: string;
  placeholder?: string;
};

export default function AdminAddProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]); // ✅ NEW
  const [loadingCategories, setLoadingCategories] = useState(true); // ✅ NEW
  const [priceType, setPriceType] = useState<
    "fixed" | "starting" | "on_request"
  >("starting");
  const [price, setPrice] = useState("");
  const [moq, setMoq] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const [description, setDescription] = useState("");
  const FIXED_ATTRIBUTE_LABELS = [
    "Brand",
    "Material",
    "Ideal For",
    "Dimensions",
    "Usage",
    "Country of Origin",
  ];

  const [attributes, setAttributes] = useState<Attribute[]>([
    {
      label: "Brand",
      value: "A One Traders",
      placeholder: "Enter brand name",
    },
    {
      label: "Material",
      value: "",
      placeholder: "Eg: Rexine, Fabric, PVC",
    },
    {
      label: "Ideal For",
      value: "",
      placeholder: "Eg: Women, Bridal, Designer Wear",
    },
    {
      label: "Dimensions",
      value: "",
      placeholder: "Eg: L × W × H in inches",
    },
    {
      label: "Usage",
      value: "",
      placeholder: "Eg: Lehenga, Gown, Saree storage",
    },
    {
      label: "Country of Origin",
      value: "India",
      placeholder: "Eg: India",
    },
  ]);

  // ✅ FETCH CATEGORIES FROM FIRESTORE
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const data = await getAllCategories();
        setCategories(data.filter((cat: any) => cat.isActive)); // Only active categories
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const addAttribute = () => {
    setAttributes([...attributes, { label: "", value: "" }]);
  };

  const updateAttribute = (
    index: number,
    key: "label" | "value",
    value: string,
  ) => {
    const updated = [...attributes];
    updated[index][key] = value;
    setAttributes(updated);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!name || !category) {
      alert("Product name & category required");
      return;
    }

    try {
      setSaving(true);

      const productId = await createProduct({
        name,
        category,
        priceType,
        price: priceType === "on_request" ? null : Number(price),
        minimumOrderQty: Number(moq),
        description,
        attributes: attributes.filter((a) => a.label.trim() && a.value.trim()),
        images: [],
      });

      const uploadedImages: string[] = [];
      for (const file of imageFiles) {
        const url = await uploadProductImage(file, productId);
        uploadedImages.push(url);
      }

      await updateProduct(productId, {
        images: uploadedImages,
      });

      alert("✅ Product added successfully");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("❌ Error saving product");
    } finally {
      setSaving(false);
    }
  };

  const handleImageSelect = (files: FileList) => {
    const selected = Array.from(files);

    if (imageFiles.length + selected.length > 4) {
      alert("You can upload a maximum of 4 images");
      return;
    }

    setImageFiles((prev) => [...prev, ...selected]);
  };

  const isFixedAttribute = (label: string) => FIXED_ATTRIBUTE_LABELS.includes(label);

  return (
    <div className="max-w-3xl mx-auto bg-white p-4 sm:p-6 rounded-xl border space-y-6">
      <h1 className="text-2xl font-bold">Add New Product</h1>

      {/* Product Name */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Heavy Rexine Lehenga Bag"
        />
      </div>

      {/* ✅ DYNAMIC CATEGORIES FROM FIRESTORE */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={loadingCategories}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">
            {loadingCategories ? "Loading categories..." : "Select category"}
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price Type */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Price Type</label>
        <select
          value={priceType}
          onChange={(e) =>
            setPriceType(e.target.value as "fixed" | "starting" | "on_request")
          }
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="starting">Starting Price</option>
          <option value="fixed">Fixed Price</option>
          <option value="on_request">On Request</option>
        </select>
      </div>

      {/* Price */}
      {priceType !== "on_request" && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="210"
          />
        </div>
      )}

      {/* MOQ */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Minimum Order Quantity</label>
        <input
          value={moq}
          onChange={(e) => setMoq(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          placeholder="50"
        />
      </div>

      {/* ATTRIBUTES - MOBILE RESPONSIVE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Product Attributes</label>
          <button 
            onClick={addAttribute}
            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
          >
            + Add
          </button>
        </div>

        <div className="space-y-3">
          {attributes.map((attr, index) => (
            <div key={index} className="bg-gray-50 p-3 rounded-xl border">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                {/* Label Input */}
                <div className="flex-1 min-w-0">
                  <label className="text-xs text-gray-500 mb-1.5 block">Label</label>
                  <input
                    className={`w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 ${
                      isFixedAttribute(attr.label)
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    placeholder="Label (e.g. Material)"
                    value={attr.label}
                    disabled={isFixedAttribute(attr.label)}
                    onChange={(e) => updateAttribute(index, "label", e.target.value)}
                  />
                </div>

                {/* Value Input */}
                <div className="flex-1 min-w-0">
                  <label className="text-xs text-gray-500 mb-1.5 block">Value</label>
                  <input
                    className="w-full border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    placeholder={attr.placeholder || `Enter ${attr.label}`}
                    value={attr.value}
                    onChange={(e) => updateAttribute(index, "value", e.target.value)}
                  />
                </div>

                {/* Remove Button */}
                {!isFixedAttribute(attr.label) && (
                  <button
                    onClick={() => removeAttribute(index)}
                    className="w-12 h-12 bg-red-500 text-white rounded-lg flex items-center justify-center text-sm hover:bg-red-600 transition-colors shrink-0"
                    title="Remove attribute"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 resize-vertical"
          rows={4}
          placeholder="Product description..."
        />
      </div>

      {/* IMAGE UPLOAD */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Product Images (max 4)
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {imageFiles.map((file, index) => (
            <div key={index} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="h-24 w-full object-contain bg-white rounded-lg border p-1"
              />
              <button
                onClick={() =>
                  setImageFiles(imageFiles.filter((_, i) => i !== index))
                }
                className="absolute top-1 right-1 bg-white text-red-600 text-xs px-2 py-1 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-all"
              >
                ✕
              </button>
            </div>
          ))}

          {imageFiles.length < 4 && (
            <label className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-sm cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
              + Add Image
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) =>
                  e.target.files && handleImageSelect(e.target.files!)
                }
              />
            </label>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={saving}
        className={`
          w-full px-6 py-3 rounded-xl text-white font-medium text-lg
          flex items-center justify-center gap-2 transition-all
          ${saving 
            ? "bg-gray-400 cursor-not-allowed" 
            : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5"
          }
        `}
      >
        {saving && (
          <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {saving ? "Saving..." : "Save Product"}
      </button>
    </div>
  );
}
