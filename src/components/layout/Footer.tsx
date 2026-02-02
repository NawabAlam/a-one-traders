export default function Footer() {
  return (
    <footer className="bg-[color:var(--background)] border-t border-[color:var(--border)] mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">

        {/* Company Info */}
        <div>
          <h3 className="font-semibold text-[color:var(--primary)] mb-3">
            A-One Traders
          </h3>
          <p className="text-[color:var(--text-secondary)]">
            Manufacturer & supplier of customized lehenga covers,
            garment bags, and packaging solutions.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-[color:var(--text-secondary)]">
            <li><a href="/" className="hover:text-[color:var(--primary)]">Home</a></li>
            <li><a href="/products" className="hover:text-[color:var(--primary)]">Products</a></li>
            <li><a href="/categories" className="hover:text-[color:var(--primary)]">Categories</a></li>
            <li><a href="/about" className="hover:text-[color:var(--primary)]">About Us</a></li>
            <li><a href="/contact" className="hover:text-[color:var(--primary)]">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <p className="text-[color:var(--text-secondary)]">
            📞 +91 9999 701686 <br />
            💬 WhatsApp Available <br />
            🇮🇳 Made in India
          </p>
        </div>
      </div>

      <div className="text-center text-xs py-4 border-t border-[color:var(--border)] text-[color:var(--text-secondary)]">
        © {new Date().getFullYear()} A-One Traders. All rights reserved.
      </div>
    </footer>
  );
}
