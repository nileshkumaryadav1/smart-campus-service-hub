"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");

  /* automatic check session on page load */
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setCheckingSession(false);
          return;
        }

        const me = await res.json();
        setUser(me);

        if (me.role === "admin" || me.role === "superadmin") {
          router.replace("/admin");
        } else {
          router.replace("/me");
        }
      } catch {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router, setUser]);

  /* login submit */
  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        setError("Invalid email or password");
        return;
      }

      const meRes = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!meRes.ok) {
        setError("Failed to load session");
        return;
      }

      const me = await meRes.json();
      setUser(me);

      if (me.role === "admin" || me.role === "superadmin") {
        router.replace("/admin");
      } else {
        router.replace("/me");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  /* session checking screen */
  if (checkingSession) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 shadow-sm"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">
            Login to access your dashboard
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="you@college.edu"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={form.password}
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            placeholder="••••••••"
          />
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="
            w-full rounded-xl bg-black py-2.5 text-white font-medium
            hover:bg-gray-900 transition
            disabled:opacity-60
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Footer */}
        <div className="mt-6 border-t border-[var(--border)] pt-4 text-center text-sm text-gray-600">
          <p>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-[var(--accent)] hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
