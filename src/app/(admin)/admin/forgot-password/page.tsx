"use client";
import { useState, useEffect } from "react";
import { sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const ADMIN_EMAILS = [
  "mohammaddaniyal79@gmail.com",
  "fahad.fahadi666@gmail.com",
  "m.mohsin9525@gmail.com"
];

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Guard: Redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user?.email && ADMIN_EMAILS.includes(user.email)) {
        router.replace("/admin");
      }
    });
    return () => unsub();
  }, [router]);

  const submit = async () => {
    if (!email) {
      alert("Enter email");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      alert("✅ Password reset link sent to your email");
      setEmail("");
    } catch (err: any) {
      console.error(err);
      alert("❌ Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-(--background)">
      <div className="bg-white border rounded-xl p-6 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-center">
          Reset Admin Password
        </h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Admin email"
        />

        <button
          onClick={submit}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-(--primary)"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <button
          onClick={() => router.back()}
          className="text-sm text-(--primary) text-center w-full"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}
