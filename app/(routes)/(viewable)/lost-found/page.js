"use client";

import { useEffect, useState } from "react";

const TYPE_BADGE = {
  lost: "bg-red-100 text-red-600 border-red-200",
  found: "bg-green-100 text-green-600 border-green-200",
};

export default function LostFoundPage() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "lost",
    location: "",
  });

  /* fetching user */
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  /* fetching all items on page load */
  useEffect(() => {
    fetch("/api/lost-found")
      .then((res) => res.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  /* lost-found item report submit function */
  async function submit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/lost-found", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const newItem = await res.json();
        setItems((prev) => [newItem, ...prev]);
        setForm({
          title: "",
          description: "",
          type: "lost",
          location: "",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  const STATUS_BADGE = {
    open: "bg-yellow-100 text-yellow-700 border-yellow-300",
    returned: "bg-[var(--accent)] text-white border-[var(--accent)]",
  };

  /* UI */
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lost & Found</h1>
          <p className="text-gray-500 text-sm mt-1">
            Report and recover lost or found items on campus
          </p>
        </div>

        {!user && (
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
          >
            👤 Login to report an item
          </a>
        )}
      </div>

      {/* Submit Form */}
      {user && (
        <form
          onSubmit={submit}
          className="bg-white border rounded-2xl p-6 shadow-sm space-y-5"
        >
          <h2 className="text-lg font-semibold">Report Lost / Found Item</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              placeholder="Item title"
              required
              className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black/10 outline-none"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <select
              className="border rounded-lg px-4 py-2"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <textarea
            placeholder="Describe the item and circumstances"
            required
            className="border rounded-lg px-4 py-2 min-h-[120px] focus:ring-2 focus:ring-black/10 outline-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="flex flex-col md:flex-row gap-4">
            <input
              placeholder="Location (optional)"
              className="border rounded-lg px-4 py-2 flex-1"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />

            <button
              disabled={submitting}
              className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="space-y-5">
        {loading && <p className="text-gray-500 text-center">Loading items…</p>}

        {!loading && items.length === 0 && (
          <p className="text-gray-500 text-center">
            No lost or found items reported yet
          </p>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    📍 {item.location || "Not specified"}
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full border font-medium ${
                    TYPE_BADGE[item.type]
                  }`}
                >
                  {item.type.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-gray-700 mt-4 line-clamp-3">
                {item.description}
              </p>
              <div className="mt-4 text-xs text-gray-500">
                Status:{" "}
                <span
                  className={`font-medium capitalize px-3 py-1.5 border rounded-lg ${
                    STATUS_BADGE[item.status]
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
