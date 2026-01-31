"use client";

import { useState } from "react";

type Props = {
  images: string[];
  alt: string;
};

export default function ProductImageCarousel({ images, alt }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="h-[420px] bg-gray-100 flex items-center justify-center text-gray-400 rounded-xl border">
        No Image
      </div>
    );
  }

  const prev = () => {
    setActiveIndex((i) =>
      i === 0 ? images.length - 1 : i - 1
    );
  };

  const next = () => {
    setActiveIndex((i) =>
      i === images.length - 1 ? 0 : i + 1
    );
  };

  return (
    <div className="space-y-4">
      {/* MAIN IMAGE */}
      <div className="relative group">
        <img
          src={images[activeIndex]}
          alt={alt}
          className="w-full h-[420px] object-contain bg-white rounded-xl border"
        />

        {images.length > 1 && (
          <>
            {/* LEFT ARROW */}
            <button
              onClick={prev}
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                h-10 w-10 rounded-full
                bg-white/90 border shadow
                flex items-center justify-center
                opacity-0 group-hover:opacity-100
                transition
              "
              aria-label="Previous image"
            >
              ‹
            </button>

            {/* RIGHT ARROW */}
            <button
              onClick={next}
              className="
                absolute right-3 top-1/2 -translate-y-1/2
                h-10 w-10 rounded-full
                bg-white/90 border shadow
                flex items-center justify-center
                opacity-0 group-hover:opacity-100
                transition
              "
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`rounded border overflow-hidden ${
                index === activeIndex
                  ? "border-(--primary)"
                  : "border-(--border)"
              }`}
            >
              <img
                src={img}
                alt={`${alt} ${index + 1}`}
                className="h-20 w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
