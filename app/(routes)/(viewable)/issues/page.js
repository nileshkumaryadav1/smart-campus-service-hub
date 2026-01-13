"use client";

import { useEffect, useMemo, useState } from "react";

const STATUS_THEME = {
  pending: {
    badge: "bg-yellow-100 text-yellow-700",
    border: "border-l-yellow-400",
  },
  "in-progress": {
    badge: "bg-blue-100 text-blue-700",
    border: "border-l-blue-400",
  },
  resolved: {
    badge: "bg-green-100 text-green-700",
    border: "border-l-green-400",
  },
};

export default function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "hostel",
  });

  /* fetch user */
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  /* fetch issues */
  useEffect(() => {
    setLoading(true);
    const url = activeTab === "all" ? "/api/issues?scope=all" : "/api/issues";

    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then(setIssues)
      .finally(() => setLoading(false));
  }, [activeTab]);

  /* submit issue */
  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const newIssue = await res.json();
      setIssues((prev) => [newIssue, ...prev]);
      setForm({ title: "", description: "", category: "hostel" });
      setActiveTab("mine");
    } finally {
      setSubmitting(false);
    }
  }

  /* filter + sort */
  const filteredIssues = useMemo(() => {
    let data = [...issues];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((i) => i.status === statusFilter);
    }

    data.sort((a, b) =>
      sortBy === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt)
    );

    return data;
  }, [issues, search, statusFilter, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Issues</h1>
        <p className="text-gray-500 text-sm mt-1">
          Report and track campus issues with real-time status updates
        </p>
      </div>

      {/* Submit Issue */}
      {user && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-2xl p-6 shadow-sm space-y-4"
        >
          <h2 className="font-semibold text-lg">Report an Issue</h2>

          <input
            required
            placeholder="Issue title"
            className="border rounded-lg px-4 py-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            required
            placeholder="Describe the issue"
            className="border rounded-lg px-4 py-2 min-h-[120px]"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <div className="flex flex-col md:flex-row gap-3">
            <select
              className="border rounded-lg px-4 py-2"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="hostel">Hostel</option>
              <option value="wifi">WiFi</option>
              <option value="classroom">Classroom</option>
              <option value="other">Other</option>
            </select>

            <button
              disabled={submitting}
              className="bg-black text-white px-6 py-2 rounded-lg disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit Issue"}
            </button>
          </div>
        </form>
      )}

      {/* Tabs */}
      <div className="flex gap-2">
        {user && (
          <button
            onClick={() => setActiveTab("mine")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === "mine"
                ? "bg-black text-white"
                : "border bg-white"
            }`}
          >
            My Issues
          </button>
        )}

        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === "all"
              ? "bg-black text-white"
              : "border bg-white"
          }`}
        >
          All Issues
        </button>
      </div>

      {/* Filters */}
      <div className="grid md:grid-cols-3 gap-3">
        <input
          placeholder="Search issues…"
          className="border rounded-lg px-4 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-4 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          className="border rounded-lg px-4 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {loading && <p className="text-gray-500">Loading issues…</p>}

        {!loading && filteredIssues.length === 0 && (
          <p className="text-gray-500 text-center">No issues found</p>
        )}

        {filteredIssues.map((issue) => (
          <div
            key={issue._id}
            className={`bg-white border border-l-4 rounded-xl p-5 shadow-sm hover:shadow-md transition ${
              STATUS_THEME[issue.status]?.border
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-semibold text-lg">{issue.title}</h3>
                <p className="text-sm text-gray-500">
                  {issue.category}
                  {activeTab === "all" && issue.createdBy?.name && (
                    <> • by {issue.createdBy.name}</>
                  )}
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full capitalize ${
                  STATUS_THEME[issue.status]?.badge
                }`}
              >
                {issue.status}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-700 line-clamp-3">
              {issue.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
