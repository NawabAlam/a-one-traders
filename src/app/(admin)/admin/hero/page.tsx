"use client";

import { useEffect, useState } from "react";
import {
  getAllHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
} from "@/lib/heroSlides";
import { uploadHeroImage } from "@/lib/storage";

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  order: number;
  isActive: boolean;
};

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [drafts, setDrafts] = useState<Record<string, Slide>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  // new slide
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const loadSlides = async () => {
    setLoading(true);
    const data = (await getAllHeroSlides()) as Slide[];
    setSlides(data);

    // initialize drafts
    const map: Record<string, Slide> = {};
    data.forEach((s) => (map[s.id] = { ...s }));
    setDrafts(map);

    setLoading(false);
  };

  useEffect(() => {
    loadSlides();
  }, []);

  // ADD SLIDE
  const addSlide = async () => {
    if (!title.trim()) return alert("Title required");

    await createHeroSlide({
      title,
      subtitle,
      image: "",
      order: slides.length + 1,
      isActive: true,
    });

    setTitle("");
    setSubtitle("");
    loadSlides();
  };

  // UPDATE DRAFT FIELD (NO SAVE)
  const updateDraft = (id: string, key: keyof Slide, value: any) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }));
  };

  // SAVE CHANGES
  const saveSlide = async (id: string) => {
    try {
      setSavingId(id);
      await updateHeroSlide(id, drafts[id]);
      alert("✅ Slide updated");
      loadSlides();
    } finally {
      setSavingId(null);
    }
  };

  // IMAGE UPLOAD (still instant, but saved only once)
  const uploadImage = async (id: string, file: File) => {
    setUploadingId(id);
    try {
      const url = await uploadHeroImage(file, id);
      updateDraft(id, "image", url);
    } finally {
      setUploadingId(null);
    }
  };

  // DELETE
  const removeSlide = async (id: string) => {
    if (!confirm("Delete slide permanently?")) return;
    await deleteHeroSlide(id);
    loadSlides();
  };

  if (loading) return <div>Loading hero slides…</div>;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Hero Slider</h1>

      {/* ADD NEW */}
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Add New Slide</h2>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <button
          onClick={addSlide}
          className="px-4 py-2 rounded bg-(--primary) text-white"
        >
          Add Slide
        </button>
      </div>

      {/* SLIDES */}
      {slides.map((slide) => {
        const draft = drafts[slide.id];
        const dirty =
          JSON.stringify(draft) !== JSON.stringify(slide);

        return (
          <div
            key={slide.id}
            className="bg-white border rounded-xl p-4 space-y-3"
          >
            <input
              className="w-full border rounded px-2 py-1"
              value={draft.title}
              onChange={(e) =>
                updateDraft(slide.id, "title", e.target.value)
              }
            />

            <input
              className="w-full border rounded px-2 py-1"
              value={draft.subtitle}
              onChange={(e) =>
                updateDraft(slide.id, "subtitle", e.target.value)
              }
            />

            {/* IMAGE */}
            <div className="flex items-center gap-4">
              {draft.image ? (
                <img
                  src={draft.image}
                  className="h-24 w-40 object-contain border rounded"
                />
              ) : (
                <div className="h-24 w-40 bg-gray-100 flex items-center justify-center text-xs">
                  No Image
                </div>
              )}

              <label className="text-sm text-(--primary) cursor-pointer">
                {uploadingId === slide.id ? "Uploading…" : "Upload Image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files &&
                    uploadImage(slide.id, e.target.files[0])
                  }
                />
              </label>
            </div>

            {/* CONTROLS */}
            <div className="flex items-center gap-6 text-sm">
              <label className="flex gap-2 items-center">
                <input
                  type="checkbox"
                  checked={draft.isActive}
                  onChange={(e) =>
                    updateDraft(slide.id, "isActive", e.target.checked)
                  }
                />
                Active
              </label>

              <input
                type="number"
                className="w-20 border rounded px-2 py-1"
                value={draft.order}
                onChange={(e) =>
                  updateDraft(slide.id, "order", Number(e.target.value))
                }
              />
              Order
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4">
              <button
                disabled={!dirty || savingId === slide.id}
                onClick={() => saveSlide(slide.id)}
                className={`px-4 py-2 rounded text-white
                  ${
                    dirty
                      ? "bg-(--primary)"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
              >
                {savingId === slide.id ? "Saving…" : "Save Changes"}
              </button>

              <button
                onClick={() => removeSlide(slide.id)}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
