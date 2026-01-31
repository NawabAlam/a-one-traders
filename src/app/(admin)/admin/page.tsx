import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-(--text-primary)">
        Admin Dashboard
      </h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* PRODUCTS */}
        <Link
          href="/admin/products"
          className="border rounded-xl p-6 bg-white hover:shadow-md transition"
        >
          <h2 className="font-semibold text-lg mb-2">Products</h2>
          <p className="text-sm text-(--text-secondary)">
            Add, edit, hide or delete products
          </p>
        </Link>

        {/* CATEGORIES */}
        <Link
          href="/admin/categories"
          className="border rounded-xl p-6 bg-white hover:shadow-md transition"
        >
          <h2 className="font-semibold text-lg mb-2">Categories</h2>
          <p className="text-sm text-(--text-secondary)">
            Manage category order, image & visibility
          </p>
        </Link>

        {/* HERO SLIDER */}
        <Link
          href="/admin/hero"
          className="border rounded-xl p-6 bg-white hover:shadow-md transition"
        >
          <h2 className="font-semibold text-lg mb-2">Hero Slider</h2>
          <p className="text-sm text-(--text-secondary)">
            Manage homepage carousel slides
          </p>
        </Link>
        {/* ABOUT PAGE */}
        <Link
          href="/admin/about"
          className="border rounded-xl p-6 bg-white hover:shadow-md transition"
        >
          <h2 className="font-semibold text-lg mb-2">About Page</h2>
          <p className="text-sm text-(--text-secondary)">
            Edit content for the About page
          </p>
        </Link>
        {/* CONTACT PAGE */}
        <Link
          href="/admin/contact"
          className="border rounded-xl p-6 bg-white hover:shadow-md transition"
        >
          <h2 className="font-semibold text-lg mb-2">Contact Page</h2>
          <p className="text-sm text-(--text-secondary)">
            Update contact information and map
          </p>
        </Link>
      </div>
    </div>
  );
}
