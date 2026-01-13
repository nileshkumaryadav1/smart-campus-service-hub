"use client";

import { useEffect, useMemo, useState } from "react";

const TYPE_BADGE = {
  lost: "bg-red-100 text-red-600 border-red-200",
  found: "bg-green-100 text-green-600 border-green-200",
};

const STATUS_BADGE = {
  open: "bg-yellow-100 text-yellow-700 border-yellow-300",
  returned: "bg-[var(--accent)] text-white border-[var(--accent)]",
};

export default function LostFoundPage() {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* filters & search */
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "lost",
    location: "",
  });

  /* fetch user */
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  /* fetch items */
  useEffect(() => {
    fetch("/api/lost-found")
      .then((res) => res.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  /* submit item */
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

  /* filtered + sorted items */
  const filteredItems = useMemo(() => {
    let data = [...items];

    /* search */
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          (i.location || "").toLowerCase().includes(q)
      );
    }

    /* type filter */
    if (typeFilter !== "all") {
      data = data.filter((i) => i.type === typeFilter);
    }

    /* status filter */
    if (statusFilter !== "all") {
      data = data.filter((i) => i.status === statusFilter);
    }

    /* sorting */
    if (sort === "newest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === "title") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    }

    return data;
  }, [items, search, typeFilter, statusFilter, sort]);

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
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 transition"
          >
            👤 Login to report
          </a>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm grid gap-4 md:grid-cols-4">
        <input
          placeholder="Search items…"
          className="border rounded-lg px-4 py-2 md:col-span-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="returned">Returned</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2 md:col-span-4"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title (A–Z)</option>
        </select>
      </div>

      {/* Submit form */}
      {user && (
        <form
          onSubmit={submit}
          className="bg-white border rounded-2xl p-6 shadow-sm space-y-4"
        >
          <h2 className="font-semibold text-lg">Report Lost / Found</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              required
              placeholder="Item title"
              className="border rounded-lg px-4 py-2"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
            <select
              className="border rounded-lg px-4 py-2"
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <textarea
            required
            placeholder="Description"
            className="border rounded-lg px-4 py-2 min-h-[120px]"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <div className="flex gap-4">
            <input
              placeholder="Location"
              className="border rounded-lg px-4 py-2 flex-1"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />
            <button
              disabled={submitting}
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      )}

      {/* Items */}
      <div className="grid md:grid-cols-2 gap-5">
        {loading && <p className="text-gray-500">Loading…</p>}

        {!loading && filteredItems.length === 0 && (
          <p className="text-gray-500 col-span-full text-center">
            No matching items found
          </p>
        )}

        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-500">
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
  );
}
