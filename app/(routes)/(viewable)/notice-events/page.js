"use client";

import { useEffect, useMemo, useState } from "react";

const TYPE_STYLES = {
  notice: "bg-yellow-100 text-yellow-700",
  event: "bg-blue-100 text-blue-700",
};

export default function NoticeEventsPage() {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // all | notice | event
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest

  /* fetching all posts */
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setAllPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  /* search, filter and sort options */
  const filteredPosts = useMemo(() => {
    let data = [...allPosts];

    if (typeFilter !== "all") {
      data = data.filter((p) => p.type === typeFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (sortBy === "newest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return data;
  }, [allPosts, search, typeFilter, sortBy]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-gray-500">
        Loading notices & events…
      </div>
    );
  }

  /* user side ui */
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Notices & Events</h1>
        <p className="text-sm text-gray-500">
          Stay updated with the latest announcements and events
        </p>
      </div>

      {/* controls for search, filter and sort */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          placeholder="Search notices or events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 md:col-span-2"
        />

        <select
          className="border rounded-lg px-3 py-2"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="notice">Notices</option>
          <option value="event">Events</option>
        </select>

        <select
          className="border rounded-lg px-3 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {/* stats */}
      <div className="text-sm text-gray-500">
        Showing <span className="font-medium">{filteredPosts.length}</span>{" "}
        items
      </div>

      {/* content */}
      {filteredPosts.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No notices or events found.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-start gap-3">
                <h2 className="font-semibold text-lg line-clamp-2">
                  {item.title}
                </h2>

                <span
                  className={`px-3 py-1 text-xs rounded-full capitalize ${
                    TYPE_STYLES[item.type]
                  }`}
                >
                  {item.type}
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                {item.description}
              </p>

              <p className="mt-3 text-xs text-gray-400">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
