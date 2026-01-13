"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* Post type badge styles */
const TYPE_STYLE = {
  notice: "bg-blue-100 text-blue-700 border-blue-200",
  event: "bg-purple-100 text-purple-700 border-purple-200",
  update: "bg-green-100 text-green-700 border-green-200",
};

export default function AdminPosts() {
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  /* ======================
     Load Posts
     ====================== */
  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch posts");

      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  /* ======================
     Delete Post
     ====================== */
  const deletePost = async (id) => {
    const confirm = window.confirm(
      "This will permanently delete the post. Continue?"
    );
    if (!confirm) return;

    const res = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      alert("Failed to delete post");
      return;
    }

    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  /* ======================
     Filtering + Sorting
     ====================== */
  const filteredPosts = useMemo(() => {
    let data = [...posts];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.type?.toLowerCase().includes(q)
      );
    }

    if (typeFilter !== "all") {
      data = data.filter((p) => p.type === typeFilter);
    }

    // newest first
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return data;
  }, [posts, search, typeFilter]);

  /* ======================
     Stats
     ====================== */
  const total = posts.length;
  const notices = posts.filter((p) => p.type === "notice").length;
  const events = posts.filter((p) => p.type === "event").length;

  /* ======================
     UI
     ====================== */
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Posts – Admin
          </h1>
          <p className="text-sm text-gray-500">
            Manage notices, events, and updates
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/posts/new")}
          className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800"
        >
          + Create Post
        </button>
      </div>

      {/* Stats */}
      <div className="flex gap-3 text-sm">
        <Stat label="Total" value={total} />
        <Stat label="Notices" value={notices} />
        <Stat label="Events" value={events} />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          placeholder="Search by title or type…"
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
          <option value="notice">Notice</option>
          <option value="event">Event</option>
          <option value="update">Update</option>
        </select>
      </div>

      {/* List */}
      {loading && (
        <p className="text-gray-500 text-center">Loading posts…</p>
      )}

      {!loading && filteredPosts.length === 0 && (
        <p className="text-gray-500 text-center">
          No posts match the filters
        </p>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        {filteredPosts.map((post) => (
          <div
            key={post._id}
            className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between gap-4">
              <div>
                <h2 className="font-semibold text-lg">
                  {post.title}
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 h-fit rounded-full border font-medium ${
                  TYPE_STYLE[post.type] || "bg-gray-100 text-gray-700"
                }`}
              >
                {post.type?.toUpperCase()}
              </span>
            </div>

            {post.excerpt && (
              <p className="text-sm text-gray-700 mt-4 line-clamp-3">
                {post.excerpt}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-5">
              <button
                onClick={() =>
                  router.push(`/admin/posts/${post._id}`)
                }
                className="px-4 py-1.5 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700"
              >
                Edit
              </button>

              <button
                onClick={() => deletePost(post._id)}
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

/* ======================
   Small Stat Card
   ====================== */
function Stat({ label, value }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-xl px-4 py-2 shadow-sm text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
