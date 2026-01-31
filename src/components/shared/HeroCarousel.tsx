"use client";

import { useEffect, useState } from "react";
import { getActiveHeroSlides } from "@/lib/heroSlides";

export default function HeroCarousel() {
  const [slides, setSlides] = useState<any[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getActiveHeroSlides().then(setSlides);
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) return null;

  const slide = slides[index];

  return (
    <section className="bg-(--background)">
      <div className="max-w-7xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
        {/* TEXT */}
        <div className="space-y-6 transition-all duration-500">
          <h1 className="text-4xl md:text-5xl font-bold text-(--text-primary)">
            {slide.title}
          </h1>

          <p className="text-lg text-(--text-secondary)">
            {slide.subtitle}
          </p>

          <div className="flex gap-4">
            <a
              href="tel:+919999701686"
              className="px-6 py-3 rounded-lg border border-(--primary) text-(--primary)"
            >
              Call Us
            </a>

            <a
              href="https://wa.me/919999701686"
              className="px-6 py-3 rounded-lg bg-(--primary) text-white"
            >
              Get Best Price
            </a>
          </div>
        </div>

        {/* IMAGE */}
        <div className="h-90 rounded-xl overflow-hidden border bg-white">
          {slide.image ? (
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-(--text-secondary)">
              No Image
            </div>
          )}
        </div>
      </div>
    </section>
  );
}



 
