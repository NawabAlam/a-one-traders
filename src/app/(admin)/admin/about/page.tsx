"use client";

import { useEffect, useState } from "react";
import { getAboutContent, saveAboutContent } from "@/lib/about";
import { uploadHeroImage } from "@/lib/storage";

type Testimonial = {
  name: string;
  location: string;
  rating: number;
  product: string;
  comment: string;
};

export default function AdminAboutPage() {
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState<string[]>([""]);
  const [image, setImage] = useState("");

  /* 🔹 REVIEWS STATE */
  const [averageRating, setAverageRating] = useState(4.3);
  const [totalReviews, setTotalReviews] = useState(11);

  const [breakdown, setBreakdown] = useState({
    5: 64,
    4: 18,
    3: 9,
    2: 0,
    1: 9,
  });

  const [satisfaction, setSatisfaction] = useState({
    response: 100,
    quality: 100,
    delivery: 100,
  });

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Collapsible states
  const [isReviewsExpanded, setIsReviewsExpanded] = useState(false);
  const [isTestimonialsExpanded, setIsTestimonialsExpanded] = useState(false);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getAboutContent().then((data) => {
      if (!data) return;

      setHeading(data.heading || "");
      setDescription(data.description || "");
      setPoints(data.points || [""]);
      setImage(data.image || "");

      if (data.reviews) {
        setAverageRating(data.reviews.averageRating || 0);
        setTotalReviews(data.reviews.totalReviews || 0);
        setBreakdown(data.reviews.breakdown || breakdown);
        setSatisfaction(data.reviews.satisfaction || satisfaction);
        setTestimonials(data.reviews.testimonials || []);
      }
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await saveAboutContent({
        heading,
        description,
        points,
        image,
        reviews: {
          averageRating,
          totalReviews,
          breakdown,
          satisfaction,
          testimonials,
        },
      });

      alert("✅ About page updated");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadHeroImage(file, "about");
      setImage(url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl border space-y-10">
      <h1 className="text-2xl font-bold">Edit About Page</h1>

      {/* BASIC INFO */}
      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Heading"
        value={heading}
        onChange={(e) => setHeading(e.target.value)}
      />

      <textarea
        className="w-full border rounded px-3 py-2"
        rows={5}
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* HIGHLIGHTS */}
      <div className="space-y-3">
        <label className="font-medium text-2xl">Highlights</label>

        {points.map((p, i) => (
          <input
            key={i}
            className={`w-full border rounded px-3 py-2 ${i === 0 ? "mt-4" : ""}`}
            value={p}
            onChange={(e) => {
              const copy = [...points];
              copy[i] = e.target.value;
              setPoints(copy);
            }}
          />
        ))}

        <button>+ Add Point</button>
      </div>

      {/* IMAGE */}
      <div className="space-y-2">
        {image && (
          <img src={image} className="h-32 object-contain border rounded" />
        )}

        <label className="text-sm cursor-pointer text-(--primary)">
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => e.target.files && uploadImage(e.target.files[0])}
          />
        </label>
      </div>

      {/* 🔥 REVIEWS & RATINGS - COLLAPSED BY DEFAULT, NOTHING VISIBLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        {/* TOP HEADER */}
        <div className="px-4 py-3 border-b font-semibold flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">Reviews & Ratings</span>
            <button
              onClick={() => setIsReviewsExpanded(!isReviewsExpanded)}
              className="px-2 py-1 text-xs rounded-full bg-red-300 hover:bg-red-200 transition-colors text-black font-medium"
              title={isReviewsExpanded ? "Collapse" : "Expand"}
            >
              {isReviewsExpanded ? "Collapse −" : "Expand +"}
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {testimonials.length} testimonials
          </span>
        </div>

        {/* ✅ COLLAPSED: ONLY SHOW EXPAND BUTTON - NO REVIEWS */}
        {!isReviewsExpanded && (
          <div className="border-t bg-gray-50">
            <button
              onClick={() => setIsReviewsExpanded(true)}
              className="w-full text-left px-4 py-3 text-sm text-blue-600 hover:text-blue-800 hover:bg-gray-100 font-medium transition-colors"
            >
              Show ratings & {testimonials.length} reviews (+)
            </button>
          </div>
        )}

        {/* ✅ EXPANDED: FULL CONTENT + BOTTOM COLLAPSE */}
        {isReviewsExpanded && (
          <>
            <div className="p-6 space-y-6 bg-gray-50">
              {/* AVERAGE RATING & TOTAL REVIEWS */}
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  step="0.1"
                  className="border rounded px-3 py-2"
                  placeholder="Average Rating"
                  value={averageRating}
                  onChange={(e) => setAverageRating(Number(e.target.value))}
                />
                <input
                  type="number"
                  className="border rounded px-3 py-2"
                  placeholder="Total Reviews"
                  value={totalReviews}
                  onChange={(e) => setTotalReviews(Number(e.target.value))}
                />
              </div>

              {/* STAR BREAKDOWN */}
              <div className="space-y-2">
                <label className="font-medium">Star Breakdown (%)</label>
                {[5, 4, 3, 2, 1].map((s) => (
                  <input
                    key={s}
                    type="number"
                    className="border rounded px-3 py-2 w-full"
                    placeholder={`${s} Star`}
                    value={breakdown[s as keyof typeof breakdown]}
                    onChange={(e) =>
                      setBreakdown({
                        ...breakdown,
                        [s]: Number(e.target.value),
                      })
                    }
                  />
                ))}
              </div>

              {/* SATISFACTION */}
              <div className="space-y-2">
                <label className="font-medium">User Satisfaction (%)</label>
                {Object.keys(satisfaction).map((key) => (
                  <input
                    key={key}
                    type="number"
                    className="border rounded px-3 py-2 w-full"
                    placeholder={key}
                    value={satisfaction[key as keyof typeof satisfaction]}
                    onChange={(e) =>
                      setSatisfaction({
                        ...satisfaction,
                        [key]: Number(e.target.value),
                      })
                    }
                  />
                ))}
              </div>

              {/* TESTIMONIALS SECTION */}
              <div className="space-y-4">
                <label className="font-medium">Customer Reviews</label>

                {testimonials.map((t, i) => (
                  <div key={i} className="border rounded p-4 space-y-2">
                    <input
                      className="w-full border rounded px-2 py-1"
                      placeholder="Name"
                      value={t.name}
                      onChange={(e) => {
                        const copy = [...testimonials];
                        copy[i].name = e.target.value;
                        setTestimonials(copy);
                      }}
                    />
                    <input
                      className="w-full border rounded px-2 py-1"
                      placeholder="Location"
                      value={t.location}
                      onChange={(e) => {
                        const copy = [...testimonials];
                        copy[i].location = e.target.value;
                        setTestimonials(copy);
                      }}
                    />
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1"
                      placeholder="Rating (1-5)"
                      value={t.rating}
                      onChange={(e) => {
                        const copy = [...testimonials];
                        copy[i].rating = Number(e.target.value);
                        setTestimonials(copy);
                      }}
                    />
                    <input
                      className="w-full border rounded px-2 py-1"
                      placeholder="Product"
                      value={t.product}
                      onChange={(e) => {
                        const copy = [...testimonials];
                        copy[i].product = e.target.value;
                        setTestimonials(copy);
                      }}
                    />
                    <textarea
                      className="w-full border rounded px-2 py-1"
                      placeholder="Comment (optional)"
                      value={t.comment}
                      onChange={(e) => {
                        const copy = [...testimonials];
                        copy[i].comment = e.target.value;
                        setTestimonials(copy);
                      }}
                    />
                    <button
                      onClick={() =>
                        setTestimonials(testimonials.filter((_, x) => x !== i))
                      }
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  onClick={() =>
                    setTestimonials([
                      ...testimonials,
                      {
                        name: "",
                        location: "",
                        rating: 5,
                        product: "",
                        comment: "",
                      },
                    ])
                  }
                  className="text-sm text-(--primary)"
                >
                  + Add Review
                </button>
              </div>
            </div>

            {/* BOTTOM COLLAPSE BUTTON */}
            <div className="border-t bg-gray-50">
              <button
                onClick={() => setIsReviewsExpanded(false)}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:text-red-800 hover:bg-gray-100 font-medium transition-colors"
              >
                Collapse Reviews & Ratings (−)
              </button>
            </div>
          </>
        )}
      </div>

      {/* SAVE */}
      <button
        onClick={save}
        disabled={saving}
        className="px-6 py-3 rounded bg-(--primary) text-white"
      >
        {saving ? "Saving…" : "Save About Page"}
      </button>
    </div>
  );
}
