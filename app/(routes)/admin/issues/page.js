"use client";

import { useEffect, useMemo, useState } from "react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
};

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expanded, setExpanded] = useState({});

  /* =======================
     Fetch real data
  ======================== */
  useEffect(() => {
    async function fetchIssues() {
      setLoading(true);
      try {
        const res = await fetch("/api/issues", { credentials: "include" });
        const data = await res.json();
        setIssues(data);
      } catch (err) {
        console.error("Failed to load issues", err);
      } finally {
        setLoading(false);
      }
    }

    fetchIssues();
  }, []);

  /* Update status */
  async function updateStatus(id, status) {
    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      const updated = await res.json();
      setIssues((prev) => prev.map((i) => (i._id === id ? updated : i)));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  }

  // delete function
  const deleteIssue = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this issue? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete issue");
      }

      // Remove from UI instantly
      setIssues((prev) => prev.filter((issue) => issue._id !== id));
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting the issue");
    }
  };

  /* =======================
     Category options
  ======================== */
  const categories = useMemo(
    () => ["all", ...new Set(issues.map((i) => i.category))],
    [issues]
  );

  /* =======================
     Filter & Sort
  ======================== */
  const filteredIssues = useMemo(() => {
    let data = [...issues];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.createdBy?.name?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      data = data.filter((i) => i.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      data = data.filter((i) => i.category === categoryFilter);
    }

    if (sortBy === "newest")
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest")
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "title") data.sort((a, b) => a.title.localeCompare(b.title));

    return data;
  }, [issues, search, statusFilter, categoryFilter, sortBy]);

  /* =======================
     Stats
  ======================== */
  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Issue Management</h1>
        <div className="flex gap-3 text-sm">
          <Stat label="Total" value={stats.total} />
          <Stat label="Pending" value={stats.pending} />
          <Stat label="Resolved" value={stats.resolved} />
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          placeholder="Search by title, category or reporter..."
          className="border border-[var(--border)] rounded-lg px-3 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-[var(--border)] rounded-lg px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          className="border border-[var(--border)] rounded-lg px-3 py-2"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="border border-[var(--border)] rounded-lg px-3 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>

      {/* Issue List */}
      <div className="space-y-5">
        {loading && (
          <p className="text-gray-500 text-center py-6">Loading issues…</p>
        )}
        {!loading && filteredIssues.length === 0 && (
          <p className="text-center text-gray-500 py-6">No issues found</p>
        )}

        {!loading &&
          filteredIssues.map((issue) => {
            const isExpanded = expanded[issue._id];
            const shortDesc =
              issue.description.length > 120
                ? issue.description.slice(0, 120) + "..."
                : issue.description;

            return (
              <div
                key={issue._id}
                className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-sm hover:shadow-lg transition flex flex-col gap-3"
              >
                {/* Title & Status */}
                <div className="flex justify-between items-start gap-3">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-lg font-semibold">{issue.title}</h2>
                    <p className="text-sm text-gray-500">
                      {issue.category} • {issue.createdBy?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(issue.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${
                      STATUS_COLORS[issue.status]
                    }`}
                  >
                    {issue.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm leading-relaxed">
                  {isExpanded ? issue.description : shortDesc}
                  {issue.description.length > 120 && (
                    <button
                      onClick={() =>
                        setExpanded((prev) => ({
                          ...prev,
                          [issue._id]: !prev[issue._id],
                        }))
                      }
                      className="ml-2 text-blue-600 underline text-sm"
                    >
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-3 justify-between">
                  <div className="flex flex-wrap gap-2">
                    {issue.status === "pending" && (
                      <ActionButton
                        label="Mark In Progress"
                        onClick={() => updateStatus(issue._id, "in-progress")}
                      />
                    )}

                    {(issue.status === "pending" ||
                      issue.status === "in-progress") && (
                      <ActionButton
                        label="Mark Resolved"
                        onClick={() => updateStatus(issue._id, "resolved")}
                      />
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteIssue(issue._id)}
                    className="px-3 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

/* Stat Card */
function Stat({ label, value }) {
  return (
    <div className="bg-gray-100 rounded-xl px-4 py-2 text-center shadow-sm">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}

/* Action Button */
function ActionButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-lg border border-[var(--border)] text-sm hover:bg-gray-100 transition"
    >
      {label}
    </button>
  );
}
