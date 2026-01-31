"use client";

import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
const ALLOWED_ADMINS = [
  "mohammaddaniyal79@gmail.com",
  "fahad.fahadi666@gmail.com",
  "m.mohsin9525@gmail.com"
];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleLogin = async () => {
  setError("");

  if (!email || !password) {
    setError("Email and password are required");
    return;
  }

  if (!ALLOWED_ADMINS.includes(email)) {
    setError("You are not authorized to access admin panel");
    return;
  }

  try {
    setLoading(true);
    console.log("🔐 Trying login:", email);

    const res = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ Login success:", res.user.email);

    // 🔥 BULLETPROOF INSTANT REDIRECT
    window.location.href = "/admin";  // Hard redirect = instant navbar
  } catch (err: any) {
    console.error("❌ Login error:", err);
    setError("Invalid email or password");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const unsub = onAuthStateChanged(auth, (user) => {
    if (user && user.email && ALLOWED_ADMINS.includes(user.email)) {
      router.replace("/admin"); // Redirect if already logged in
    }
  });
  return () => unsub();
}, [router]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-(--background)">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl border">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>

        <div className="space-y-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Admin email"
            className="w-full border rounded-lg px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border rounded-lg px-3 py-2 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-(--text-secondary)"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {/* Error */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2 rounded-lg bg-(--primary) text-white disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <Link
            href="/admin/forgot-password"
            className="text-sm font-bold text-(--primary)"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
