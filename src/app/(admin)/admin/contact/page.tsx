"use client";

import { useEffect, useState } from "react";
import { getContactData, saveContactData } from "@/lib/contact";

type FormData = {
  companyName: string;
  address: string;
  phone1: string;   // ✅ Changed to phone1
  phone2: string;   // ✅ Added phone2
  whatsapp: string;
  email1: string;
  email2: string;
  mapLat: string;
  mapLng: string;
};

export default function AdminContactPage() {
  const [form, setForm] = useState<FormData>({
    companyName: "",
    address: "",
    phone1: "",
    phone2: "",
    whatsapp: "",
    email1: "",
    email2: "",
    mapLat: "",
    mapLng: "",
  });

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getContactData().then((data) => {
      if (!data) {
        setLoading(false);
        return;
      }
      setForm({
        companyName: data.companyName || "",
        address: data.address || "",
        phone1: data.phone1 || "",        // ✅ Updated
        phone2: data.phone2 || "",        // ✅ Updated
        whatsapp: data.whatsapp || "",
        email1: data.email1 || "",
        email2: data.email2 || "",
        mapLat: data.mapLat?.toString() || "",
        mapLng: data.mapLng?.toString() || "",
      });
      setLoading(false);
    }).catch((error) => {
      console.error("Failed to load contact data:", error);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    if (!form.companyName.trim() || !form.address.trim()) {
      alert("Please fill company name and address");
      return;
    }

    setSaving(true);
    try {
      await saveContactData({
        companyName: form.companyName,
        address: form.address,
        phone1: form.phone1 || undefined,     // ✅ Save phone1
        phone2: form.phone2 || undefined,     // ✅ Save phone2  
        whatsapp: form.whatsapp,
        email1: form.email1 || undefined,
        email2: form.email2 || undefined,
        mapLat: Number(form.mapLat) || 28.6139,
        mapLng: Number(form.mapLng) || 77.2090,
      });
      alert("✅ Contact page updated successfully!");
    } catch (error) {
      alert("❌ Failed to save: " + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl border">
        <div className="text-center py-12">Loading contact data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl border space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Contact Page</h1>

      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name *
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter company name"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address *
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter full address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>

      {/* TWO PHONES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone 1 (Primary)
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter primary phone number"
            value={form.phone1}
            onChange={(e) => setForm({ ...form, phone1: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone 2 (Secondary)
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter secondary phone number"
            value={form.phone2}
            onChange={(e) => setForm({ ...form, phone2: e.target.value })}
          />
        </div>
      </div>

      {/* WhatsApp */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          WhatsApp
        </label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Enter WhatsApp number"
          value={form.whatsapp}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
        />
      </div>

      {/* TWO EMAILS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email 1 (Primary)
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="primary@example.com"
            value={form.email1}
            onChange={(e) => setForm({ ...form, email1: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email 2 (Secondary)
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="support@example.com"
            value={form.email2}
            onChange={(e) => setForm({ ...form, email2: e.target.value })}
          />
        </div>
      </div>

      {/* Map Coordinates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Map Latitude
          </label>
          <input
            type="number"
            step="any"
            min="-90"
            max="90"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="28.6139"
            value={form.mapLat}
            onChange={(e) => setForm({ ...form, mapLat: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Map Longitude
          </label>
          <input
            type="number"
            step="any"
            min="-180"
            max="180"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="77.2090"
            value={form.mapLng}
            onChange={(e) => setForm({ ...form, mapLng: e.target.value })}
          />
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium w-full sm:w-auto disabled:opacity-50 transition-colors"
      >
        {saving ? "Saving..." : "Save Contact Page"}
      </button>
    </div>
  );
}
