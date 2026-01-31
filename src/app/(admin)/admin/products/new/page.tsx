"use client";

import { useState } from "react";
import { createProduct, updateProduct } from "@/lib/products";
import { uploadProductImage } from "@/lib/storage";

type Attribute = {
  label: string;
  value: string;
  placeholder?: string;
};

export default function AdminAddProductPage() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
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
      setSaving(true); // ✅ START LOADER

      // 1️⃣ Create product WITHOUT images
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

      // 2️⃣ Upload images using REAL product ID
      const uploadedImages: string[] = [];

      for (const file of imageFiles) {
        const url = await uploadProductImage(file, productId);
        uploadedImages.push(url);
      }

      // 3️⃣ Update product with image URLs
      await updateProduct(productId, {
        images: uploadedImages,
      });

      alert("✅ Product added successfully");

      // reset form
      setName("");
      setCategory("");
      setPrice("");
      setMoq("");
      setDescription("");
      setAttributes([{ label: "", value: "" }]);
      setImageFiles([]);
    } catch (err) {
      console.error(err);
      alert("❌ Error saving product");
    } finally {
      setSaving(false); // ✅ STOP LOADER
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

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl border space-y-6">
      <h1 className="text-2xl font-bold text-(--text-primary)">
        Add New Product
      </h1>

      {/* Product Name */}
      <div>
        <label className="block text-sm mb-1">Product Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Heavy Rexine Lehenga Bag"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Select category</option>
          <option>Lehenga Covers</option>
          <option>Saree Covers</option>
          <option>Gown Covers</option>
          <option>Suit Covers</option>
          <option>Garment Bags</option>
          <option>Packaging Tray</option>
          <option>Lehenga Box</option>
          <option>Trousseau Lehenga Box</option>
          <option>Custom Packaging</option>
          <option>Others</option>
        </select>
      </div>

      {/* Price Type */}
      <div>
        <label className="block text-sm mb-1">Price Type</label>
        <select
          value={priceType}
          onChange={(e) =>
            setPriceType(e.target.value as "fixed" | "starting" | "on_request")
          }
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="starting">Starting Price</option>
          <option value="fixed">Fixed Price</option>
          <option value="on_request">On Request</option>
        </select>
      </div>

      {/* Price */}
      {priceType !== "on_request" && (
        <div>
          <label className="block text-sm mb-1">Price (₹)</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="210"
          />
        </div>
      )}

      {/* MOQ */}
      <div>
        <label className="block text-sm mb-1">Minimum Order Quantity</label>
        <input
          value={moq}
          onChange={(e) => setMoq(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="50"
        />
      </div>

      {/* Attributes */}
      <div className="space-y-3">
        <label className="block text-sm">Product Attributes</label>

        {attributes.map((attr, index) => (
          <div key={index} className="flex gap-2">
            <input
              className={`flex-1 border rounded-lg px-3 py-2 ${
                FIXED_ATTRIBUTE_LABELS.includes(attr.label)
                  ? "bg-gray-100 cursor-not-allowed"
                  : ""
              }`}
              placeholder="Label (e.g. Material)"
              value={attr.label}
              disabled={FIXED_ATTRIBUTE_LABELS.includes(attr.label)}
              onChange={(e) => updateAttribute(index, "label", e.target.value)}
            />

            <input
              className="flex-1 border rounded-lg px-3 py-2"
              placeholder={attr.placeholder || `Enter ${attr.label}`}
              value={attr.value}
              onChange={(e) => updateAttribute(index, "value", e.target.value)}
            />

            {!FIXED_ATTRIBUTE_LABELS.includes(attr.label) && (
              <button
                onClick={() => removeAttribute(index)}
                className="px-3 text-red-500"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <button onClick={addAttribute} className="text-sm text-(--primary)">
          + Add Attribute
        </button>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          rows={4}
          placeholder="Product description..."
        />
      </div>
      {/* IMAGE UPLOAD */}
      {/* IMAGE UPLOAD */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">
          Product Images (max 4)
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {imageFiles.map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="h-24 w-full object-contain bg-white rounded border p-1"
              />
              <button
                onClick={() =>
                  setImageFiles(imageFiles.filter((_, i) => i !== index))
                }
                className="absolute top-1 right-1 bg-white text-red-600 text-xs px-1 rounded"
              >
                ✕
              </button>
            </div>
          ))}

          {imageFiles.length < 4 && (
            <label className="h-24 border-dashed border rounded flex items-center justify-center text-sm cursor-pointer">
              + Add Image
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) =>
                  e.target.files && handleImageSelect(e.target.files)
                }
              />
            </label>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className={`
    px-6 py-3 rounded-lg text-white
    ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-(--primary)"}
    flex items-center justify-center gap-2
  `}
        >
          {saving && (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {saving ? "Saving..." : "Save Product"}
        </button>
      </div>
    </div>
  );
}
