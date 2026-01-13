"use client";

import { useEffect, useState } from "react";

export default function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/posts?type=event")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Events</h1>

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event._id}
            className="border border-[var(--border)] p-4 rounded-md shadow-sm"
          >
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <p className="text-sm text-gray-600">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
