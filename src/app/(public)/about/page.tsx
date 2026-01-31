import { getAboutContent } from "@/lib/about";

type ReviewData = {
  averageRating: number;
  totalReviews: number;
  breakdown: Record<number, number>;
  satisfaction: Record<string, number>;
  testimonials: {
    name: string;
    location: string;
    rating: number;
    product: string;
    comment?: string;
  }[];
};

export default async function AboutPage() {
  const about = await getAboutContent();

  const reviews = about?.reviews as ReviewData | undefined;
  const breakdown = reviews?.breakdown as Record<number, number> | undefined;

  if (!about) {
    return (
      <div className="py-20 text-center text-(--text-secondary)">
        About information coming soon.
      </div>
    );
  }

  return (
    <div className="space-y-20">
      {/* ================= ABOUT SECTION ================= */}
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10">
        {/* TEXT */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-(--text-primary)">
            {about.heading}
          </h1>

          <p className="text-(--text-secondary) leading-relaxed">
            {about.description}
          </p>

          {about.points?.length > 0 && (
            <ul className="space-y-2">
              {about.points.map((p: string, i: number) => (
                <li key={i} className="flex gap-2">
                  <span className="text-(--primary)">✔</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* IMAGE */}
        <div className="border rounded-xl bg-white flex items-center justify-center">
          {about.image ? (
            <img
              src={about.image}
              alt="About A-One Traders"
              className="max-h-96 object-contain p-4"
            />
          ) : (
            <div className="text-sm text-(--text-secondary)">About image</div>
          )}
        </div>
      </div>

      {/* ================= REVIEWS & RATINGS ================= */}
      <section className="max-w-6xl mx-auto px-4 space-y-10">
        {reviews ? (
          <>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-(--text-primary)">
                  Reviews & Ratings
                </h2>
                <p className="text-sm text-(--text-secondary) mt-1">
                  See what our customers say about us.
                </p>
              </div>

              {/* Badge-style highlight */}
              <div className="inline-flex items-center gap-3 rounded-full bg-white shadow-sm px-4 py-2 border border-(--border)">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold text-(--primary)">
                    {reviews.averageRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-(--text-secondary)">/ 5.0</span>
                </div>
                <div className="h-5 w-px bg-(--border)" />
                <div className="text-xs text-(--text-secondary)">
                  Based on{" "}
                  <span className="font-medium text-(--text-primary)">
                    {reviews.totalReviews}
                  </span>{" "}
                  reviews
                </div>
              </div>
            </div>

            {/* MAIN STATS PANEL */}
            <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)] gap-8">
              {/* LEFT: Big score + mini summary */}
              <div className="rounded-2xl bg-white border border-(--border) shadow-sm p-6 flex flex-col justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-5xl font-bold text-(--primary)">
                      {reviews.averageRating.toFixed(1)}
                    </span>
                    <span className="mt-1 text-xs uppercase tracking-wide text-(--text-secondary)">
                      Overall rating (out of 5.0)
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-xs text-(--text-secondary)">
                    <span className="inline-flex items-center gap-1">
                      <span className="text-yellow-500">
                        {"★".repeat(Math.round(reviews.averageRating))}
                      </span>
                      <span className="text-[11px] uppercase tracking-wide">
                        Verified buyers
                      </span>
                    </span>
                    <span>Trusted by {reviews.totalReviews}+ customers</span>
                  </div>
                </div>

                {/* Satisfaction pills */}
                {reviews.satisfaction && (
                  <div className="mt-6 flex flex-wrap gap-3">
                    {Object.entries(reviews.satisfaction).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center gap-2 rounded-full bg-(--background) px-3 py-1 text-xs border border-(--border)"
                        >
                          <span className="h-2 w-2 rounded-full bg-(--primary)" />
                          <span className="capitalize text-(--text-secondary)">
                            {key}
                          </span>
                          <span className="font-semibold text-(--text-primary)">
                            {value}%
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>

              {/* RIGHT: Star breakdown (modern progress bars) */}
              <div className="rounded-2xl bg-white border border-(--border) shadow-sm p-6">
                <p className="text-sm font-medium text-(--text-primary) mb-4">
                  Rating breakdown
                </p>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const percent = breakdown?.[star] ?? 0;
                    return (
                      <div
                        key={star}
                        className="flex items-center gap-3 text-xs"
                      >
                        <span className="w-12 flex items-center justify-between text-(--text-secondary)">
                          <span>{star}</span>
                          <span className="text-[11px] text-yellow-500">★</span>
                        </span>

                        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-(--primary) to-(--secondary) transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <span className="w-10 text-right text-(--text-secondary)">
                          {percent}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* TESTIMONIAL CARDS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-(--text-primary)">
                  Customer Reviews
                </h3>
                <p className="text-xs text-(--text-secondary)">
                  Real experiences from buyers across India.
                </p>
              </div>

              {reviews.testimonials && reviews.testimonials.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {reviews.testimonials.map((r, i) => (
                      <article
                        key={`${r.name}-${i}`}
                        className="group relative rounded-2xl border border-(--border) bg-white/80 backdrop-blur-sm shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                      >
                        {/* Top row: avatar circle + name + rating */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-(--background) flex items-center justify-center text-xs font-semibold text-(--primary)">
                              {r.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                              <p className="text-sm font-semibold text-(--text-primary)">
                                {r.name}
                              </p>
                              <p className="text-[11px] text-(--text-secondary)">
                                {r.location}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs font-medium text-(--text-primary)">
                              {Number(r.rating).toFixed(1)} / 5.0
                            </span>
                            <span className="text-[11px] text-yellow-500">
                              {"★".repeat(Number(r.rating) || 0)}
                            </span>
                          </div>
                        </div>

                        {/* Product tag */}
                        <div className="inline-flex items-center gap-2 text-[11px] text-(--text-secondary)">
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-(--background) text-[10px] text-(--primary)">
                            #
                          </span>
                          <span className="font-medium truncate">
                            {r.product}
                          </span>
                        </div>

                        {/* Comment */}
                        {r.comment && (
                          <p className="mt-1 text-sm leading-relaxed text-(--text-secondary) line-clamp-4">
                            "{r.comment}"
                          </p>
                        )}

                        {/* Subtle bottom accent */}
                        <div className="mt-3 h-0.5 w-16 bg-gradient-to-r from-(--primary) to-(--secondary) rounded-full" />
                      </article>
                    ))}
                  </div>

                  {/* ✨ VIEW MORE REVIEWS CARD */}
                  {/* ✨ VIEW MORE REVIEWS CARD */}
                  <div className="pt-8 border-t border-(--border) mt-8">
                    <a
                      href="https://maps.app.goo.gl/JbkpSV5UR4bucfuw5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-(--primary) to-(--secondary) text-white px-6 py-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 max-w-max mx-auto"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-semibold">
                        View {reviews.totalReviews}+ More Reviews
                      </span>
                      <span className="ml-2 h-5 w-5 border border-white/30 rounded-full inline-flex items-center justify-center group-hover:rotate-45 transition-transform">
                        →
                      </span>
                    </a>
                  </div>
                </>
              ) : (
                <p className="text-sm text-(--text-secondary)">
                  No customer reviews yet.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-sm text-(--text-secondary)">
            Reviews coming soon.
          </div>
        )}
      </section>
    </div>
  );
}
