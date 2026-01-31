"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getProductById,
  updateProduct,
} from "@/lib/products";
import {
  uploadProductImage,
  deleteProductImage,
} from "@/lib/storage";

type Attribute = {
  label: string;
  value: string;
};

export default function AdminEditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [priceType, setPriceType] = useState<
    "starting" | "fixed" | "on_request"
  >("starting");
  const [price, setPrice] = useState("");
  const [moq, setMoq] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // LOAD PRODUCT
  useEffect(() => {
    if (!id) return;

    getProductById(id as string).then((data: any) => {
      if (!data) return;

      setName(data.name || "");
      setCategory(data.category || "");
      setPriceType(data.priceType || "starting");
      setPrice(data.price?.toString() || "");
      setMoq(data.minimumOrderQty?.toString() || "");
      setDescription(data.description || "");
      setAttributes(data.attributes || []);
      setImages(data.images || []);

      setLoading(false);
    });
  }, [id]);

  // IMAGE UPLOAD (MAX 4)
  const handleImageUpload = async (file: File) => {
    if (images.length >= 4) {
      alert("Maximum 4 images allowed");
      return;
    }

    try {
      setUploading(true);
      const url = await uploadProductImage(file, id as string);
      setImages((prev) => [...prev, url]);
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // REMOVE IMAGE
  const removeImage = async (url: string) => {
    const ok = confirm("Remove this image?");
    if (!ok) return;

    try {
      await deleteProductImage(url);
      setImages(images.filter((img) => img !== url));
    } catch (err) {
      alert("Failed to remove image");
    }
  };

  // SAVE PRODUCT
  const save = async () => {
    await updateProduct(id as string, {
      name,
      category,
      priceType,
      price: priceType === "on_request" ? null : Number(price),
      minimumOrderQty: Number(moq),
      description,
      attributes,
      images, // ✅ IMPORTANT
    });

    alert("Product updated");
    router.push("/admin/products");
  };

  const updateAttr = (
    i: number,
    key: "label" | "value",
    value: string
  ) => {
    const copy = [...attributes];
    copy[i][key] = value;
    setAttributes(copy);
  };

  if (loading) {
    return <div>Loading product…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl border space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>

      <input
        className="w-full border rounded-lg px-3 py-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product name"
      />

      <input
        className="w-full border rounded-lg px-3 py-2"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
      />

      <select
        className="w-full border rounded-lg px-3 py-2"
        value={priceType}
        onChange={(e) =>
          setPriceType(e.target.value as any)
        }
      >
        <option value="starting">Starting</option>
        <option value="fixed">Fixed</option>
        <option value="on_request">On Request</option>
      </select>

      {priceType !== "on_request" && (
        <input
          className="w-full border rounded-lg px-3 py-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
        />
      )}

      <input
        className="w-full border rounded-lg px-3 py-2"
        value={moq}
        onChange={(e) => setMoq(e.target.value)}
        placeholder="Minimum Order Quantity"
      />

      {/* ATTRIBUTES */}
      <div className="space-y-2">
        {attributes.map((a, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="flex-1 border px-2 py-1 rounded"
              value={a.label}
              onChange={(e) =>
                updateAttr(i, "label", e.target.value)
              }
            />
            <input
              className="flex-1 border px-2 py-1 rounded"
              value={a.value}
              onChange={(e) =>
                updateAttr(i, "value", e.target.value)
              }
            />
          </div>
        ))}
      </div>

      <textarea
        className="w-full border rounded-lg px-3 py-2"
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* IMAGE UPLOAD */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">
          Product Images (max 4)
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {images.map((img) => (
            <div key={img} className="relative">
              <img
                src={img}
                alt="Product"
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

          {images.length < 4 && (
            <label className="h-24 border-dashed border rounded flex items-center justify-center text-sm cursor-pointer">
              {uploading ? "Uploading…" : "+ Add Image"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) =>
                  e.target.files &&
                  handleImageUpload(e.target.files[0])
                }
              />
            </label>
          )}
        </div>
      </div>

      <button
        onClick={save}
        className="px-6 py-2 rounded-lg bg-(--primary) text-white"
      >
        Save Changes
      </button>
    </div>
  );
}
