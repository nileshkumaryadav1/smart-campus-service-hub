"use client";

import { useEffect, useState } from "react";

export default function NoticeEventsPage() {
  const [allNoticeEvents, setAllNoticeEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // all | notice | event
  const [loading, setLoading] = useState(true);

  // fetching all posts from API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setAllNoticeEvents(data);
        setFilteredEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // filtering & search logic
  useEffect(() => {
    let temp = [...allNoticeEvents];

    // filter by type
    if (filterType !== "all") {
      temp = temp.filter((item) => item.type === filterType);
    }

    // search by title or description
    if (searchQuery.trim() !== "") {
      temp = temp.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(temp);
  }, [allNoticeEvents, filterType, searchQuery]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notice & Events</h1>

      {/* search & filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <input
          type="text"
          placeholder="Search by title or description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />

        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded ${
              filterType === "all"
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--card)] border"
            }`}
            onClick={() => setFilterType("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filterType === "notice"
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--card)] border"
            }`}
            onClick={() => setFilterType("notice")}
          >
            Notices
          </button>
          <button
            className={`px-4 py-2 rounded ${
              filterType === "event"
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--card)] border"
            }`}
            onClick={() => setFilterType("event")}
          >
            Events
          </button>
        </div>
      </div>

      {/* notice & event cards */}
      {filteredEvents.length === 0 ? (
        <p className="text-gray-500">No notices or events found.</p>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((item) => (
            <div
              key={item._id}
              className="border p-4 rounded-md shadow-sm bg-[var(--card)]"
            >
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-[var(--secondary)]">
                {item.description}
              </p>
              <p className="mt-1 text-xs text-[var(--accent)] capitalize">
                {item.type}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
