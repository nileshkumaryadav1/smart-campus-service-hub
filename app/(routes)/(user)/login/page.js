"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

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

        // store user data globally
        setUser(me);

        // redirect based on the role
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

  /* login submit*/
  async function handleSubmit(e) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // login request (sets JWT cookie)
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

      // verify session
      const meRes = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!meRes.ok) {
        setError("Failed to load session");
        return;
      }

      const me = await meRes.json();
      setUser(me);

      // redirect
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

  /* session checking - loading screen */
  if (checkingSession) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Checking session...</p>
      </div>
    );
  }

  /* login form */
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-20 w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
    >
      <h1 className="mb-4 text-xl font-semibold">Login</h1>

      {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        required
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="mb-3 w-full rounded border border-[var(--border)] p-2"
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        required
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="mb-4 w-full rounded border border-[var(--border)] p-2"
      />

      <button
        disabled={loading}
        className="w-full rounded bg-black py-2 text-white disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
