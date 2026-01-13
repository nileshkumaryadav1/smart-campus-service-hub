"use client";

import { useEffect, useMemo, useState } from "react";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  resolved: "bg-green-100 text-green-700",
};

export default function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [activeTab, setActiveTab] = useState("all"); // all | mine
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "hostel",
  });

  /* fetch the Logged-in user  */
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  /* fetch issues (considering tab) */
  useEffect(() => {
    setLoading(true);

    const url = activeTab === "all" ? "/api/issues?scope=all" : "/api/issues";

    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then(setIssues)
      .finally(() => setLoading(false));
  }, [activeTab]);

  /* submit new issue */
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

  /* filtering & sorting */
  const filteredIssues = useMemo(() => {
    let data = [...issues];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
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

  /* User side ui */
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Issues</h1>
        <p className="text-gray-500 text-sm">
          Track reported problems and their resolution status
        </p>
      </div>

      {/* issue submit form */}
      {user && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-xl p-5 shadow-sm space-y-4"
        >
          <h2 className="font-semibold text-lg">Submit a New Issue</h2>

          <input
            required
            placeholder="Issue title"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            required
            placeholder="Describe the issue..."
            className="border rounded-lg px-3 py-2 w-full min-h-[100px]"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="flex flex-col md:flex-row gap-3">
            <select
              className="border rounded-lg px-3 py-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
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

      {/* tabs */}
      <div className="flex gap-2">
        {user && (
          <button
            onClick={() => setActiveTab("mine")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeTab === "mine" ? "bg-black text-white" : "border bg-white"
            }`}
          >
            My Issues
          </button>
        )}

        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === "all" ? "bg-black text-white" : "border bg-white"
          }`}
        >
          All Issues
        </button>
      </div>

      {/* filters and searching options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* issue list */}
      <div className="space-y-4">
        {loading && <p className="text-gray-500">Loading issues…</p>}

        {!loading && filteredIssues.length === 0 && (
          <p className="text-gray-500 text-center">No issues found</p>
        )}

        {!loading && filteredIssues.length > 0 && (
          <p className="text-gray-500 text-sm">
            Showing {filteredIssues.length} issues
          </p>
        )}

        {filteredIssues.map((issue) => (
          <div
            key={issue._id}
            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-semibold">{issue.title}</h3>
                <p className="text-sm text-gray-500">
                  {issue.category}
                  {activeTab === "all" && issue.createdBy?.name && (
                    <> • by {issue.createdBy.name}</>
                  )}
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

            <p className="mt-3 text-sm text-gray-700 line-clamp-3">
              {issue.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
