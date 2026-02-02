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

  const addAttribute = () => {
    setAttributes([...attributes, { label: "", value: "" }]);
  };

  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
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

      {/* ATTRIBUTES - RESPONSIVE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Attributes</label>
          <button
            onClick={addAttribute}
            className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded"
          >
            + Add Attribute
          </button>
        </div>
        
        <div className="space-y-2">
          {attributes.map((a, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded-lg border">
              <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                <div className="flex-1 min-w-0">
                  <label className="text-xs text-gray-500 mb-1 block">Label</label>
                  <input
                    className="w-full border px-3 py-2 rounded text-sm"
                    value={a.label}
                    onChange={(e) =>
                      updateAttr(i, "label", e.target.value)
                    }
                    placeholder="Label"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <label className="text-xs text-gray-500 mb-1 block">Value</label>
                  <input
                    className="w-full border px-3 py-2 rounded text-sm"
                    value={a.value}
                    onChange={(e) =>
                      updateAttr(i, "value", e.target.value)
                    }
                    placeholder="Value"
                  />
                </div>
                
                <button
                  onClick={() => removeAttribute(i)}
                  className="sm:w-10 sm:h-10 w-12 h-12 bg-red-500 text-white rounded-lg flex items-center justify-center text-sm hover:bg-red-600 shrink-0"
                  title="Remove attribute"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
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
                className="absolute top-1 right-1 bg-white text-red-600 text-xs px-1 rounded shadow"
              >
                ✕
              </button>
            </div>
          ))}

          {images.length < 4 && (
            <label className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-sm cursor-pointer hover:border-gray-400 transition-colors bg-gray-50">
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
        className="w-full px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
      >
        Save Changes
      </button>
    </div>
  );
}
