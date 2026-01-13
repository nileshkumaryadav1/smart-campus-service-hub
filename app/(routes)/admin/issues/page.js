"use client";

import { useEffect, useMemo, useState } from "react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
};

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    fetch("/api/issues", { credentials: "include" })
      .then((res) => res.json())
      .then(setIssues);
  }, []);

  async function updateStatus(id, status) {
    const res = await fetch(`/api/issues/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    const updated = await res.json();
    setIssues((prev) => prev.map((i) => (i._id === id ? updated : i)));
  }

  const categories = useMemo(() => {
    return ["all", ...new Set(issues.map((i) => i.category))];
  }, [issues]);

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

    if (sortBy === "newest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (sortBy === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (sortBy === "title") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    }

    return data;
  }, [issues, search, statusFilter, categoryFilter, sortBy]);

  const stats = {
    total: issues.length,
    pending: issues.filter((i) => i.status === "pending").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* heading */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Issue Management</h1>

        <div className="flex gap-3 text-sm">
          <Stat label="Total" value={stats.total} />
          <Stat label="Pending" value={stats.pending} />
          <Stat label="Resolved" value={stats.resolved} />
        </div>
      </div>

      {/* Controls for sorting and filtering */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          placeholder="Search issues..."
          className="border rounded-lg px-3 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2"
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
          className="border rounded-lg px-3 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title">Title A–Z</option>
        </select>
      </div>

      {/* all issue list */}
      <div className="space-y-4">
        {filteredIssues.length === 0 && (
          <p className="text-center text-gray-500">No issues found</p>
        )}

        {filteredIssues.map((issue) => {
          const isExpanded = expanded[issue._id];
          const shortDesc =
            issue.description.length > 120
              ? issue.description.slice(0, 120) + "..."
              : issue.description;

          return (
            <div
              key={issue._id}
              className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{issue.title}</h2>
                  <p className="text-sm text-gray-500">
                    {issue.category} • {issue.createdBy?.name}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full capitalize ${
                    STATUS_COLORS[issue.status]
                  }`}
                >
                  {issue.status}
                </span>
              </div>

              <p className="mt-3 text-gray-700 text-sm">
                {isExpanded ? issue.description : shortDesc}
                {issue.description.length > 120 && (
                  <button
                    onClick={() =>
                      setExpanded((p) => ({
                        ...p,
                        [issue._id]: !p[issue._id],
                      }))
                    }
                    className="ml-2 text-blue-600 underline"
                  >
                    {isExpanded ? "Show less" : "Read more"}
                  </button>
                )}
              </p>

              <div className="flex gap-3 mt-4 text-sm">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* small components */

function Stat({ label, value }) {
  return (
    <div className="bg-gray-100 rounded-lg px-4 py-2 text-center">
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}

function ActionButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-1.5 rounded-lg border text-sm hover:bg-gray-100 transition"
    >
      {label}
    </button>
  );
}
