"use client";

import { useEffect, useMemo, useState } from "react";

const TYPE_STYLE = {
  lost: "bg-red-100 text-red-700 border-red-200",
  found: "bg-green-100 text-green-700 border-green-200",
};

const STATUS_STYLE = {
  active: "bg-yellow-100 text-yellow-700 border-yellow-200",
  returned: "bg-gray-200 text-gray-700 border-gray-300",
};

export default function AdminLostFound() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  /* Load Data */
  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/lost-found", {
        credentials: "include",
      });
      const data = await res.json();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* Actions  */
  const markReturned = async (id) => {
    const confirm = window.confirm("Mark this item as returned?");
    if (!confirm) return;

    const res = await fetch(`/api/lost-found/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: "returned" }),
    });

    if (!res.ok) return;

    const updated = await res.json();
    setItems((prev) => prev.map((i) => (i._id === id ? updated : i)));
  };

  const remove = async (id) => {
    const confirm = window.confirm(
      "This will permanently delete the item. Continue?"
    );
    if (!confirm) return;

    await fetch(`/api/lost-found/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    setItems((prev) => prev.filter((i) => i._id !== id));
  };

  /* Filtering */
  const filteredItems = useMemo(() => {
    let data = [...items];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.location?.toLowerCase().includes(q)
      );
    }

    if (typeFilter !== "all") {
      data = data.filter((i) => i.type === typeFilter);
    }

    if (statusFilter !== "all") {
      data = data.filter((i) => i.status === statusFilter);
    }

    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return data;
  }, [items, search, typeFilter, statusFilter]);

  /* stats calculation */
  const total = items.length;
  const returned = items.filter((i) => i.status === "returned").length;
  const active = total - returned;

  /* UI */
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Lost & Found – Admin
          </h1>
          <p className="text-sm text-gray-500">
            Manage reported lost and found items
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-3 text-sm">
          <Stat label="Total" value={total} />
          <Stat label="Active" value={active} />
          <Stat label="Returned" value={returned} />
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          placeholder="Search title or location…"
          className="border border-[var(--border)] rounded-lg px-4 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-[var(--border)] rounded-lg px-4 py-2"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select
          className="border border-[var(--border)] rounded-lg px-4 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {/* List */}
      {loading && <p className="text-gray-500 text-center">Loading items…</p>}

      {!loading && filteredItems.length === 0 && (
        <p className="text-gray-500 text-center">No items match the filters</p>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {filteredItems.map((item) => (
          <div
            key={item._id}
            className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between gap-4">
              <div>
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  📍 {item.location || "Not specified"}
                </p>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <span
                  className={`text-xs px-3 py-1 rounded-full border font-medium ${
                    TYPE_STYLE[item.type]
                  }`}
                >
                  {item.type.toUpperCase()}
                </span>

                <span
                  className={`text-xs px-3 py-1 rounded-full border font-medium ${
                    STATUS_STYLE[item.status]
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-700 mt-4 line-clamp-3">
              {item.description}
            </p>

            <div className="text-xs text-gray-500 mt-3">
              Reported by:{" "}
              <span className="font-medium">
                {item.createdBy?.name || "Unknown"}
              </span>
            </div>

            {/* actions btns */}
            <div className="flex gap-2 mt-4">
              {item.status !== "returned" && (
                <button
                  onClick={() => markReturned(item._id)}
                  className="px-4 py-1.5 rounded-lg text-sm bg-green-600 text-white hover:bg-green-700"
                >
                  Mark Returned
                </button>
              )}

              <button
                onClick={() => remove(item._id)}
                className="px-4 py-1.5 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* small Stat cards */
function Stat({ label, value }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl px-4 py-2 shadow-sm text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
