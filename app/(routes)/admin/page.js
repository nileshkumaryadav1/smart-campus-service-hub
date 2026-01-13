"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Calendar,
  Bell,
  Search,
  AlertCircle,
} from "lucide-react";

export default function AdminPage() {
  const [analytics, setAnalytics] = useState({
    events: 0,
    notices: 0,
    lostFound: 0,
    issues: 0,
  });

  // fetch counts or the actual data and count from APIs 
  // for now - (mock example)
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        // fetch counts from API endpoints
        const [eventsRes, noticesRes, lostFoundRes, issuesRes] =
          await Promise.all([
            fetch("/api/events/count"),
            fetch("/api/posts/count?type=notice"),
            fetch("/api/lost-found/count"),
            fetch("/api/issues/count"),
          ]);

        const events = await eventsRes.json();
        const notices = await noticesRes.json();
        const lostFound = await lostFoundRes.json();
        const issues = await issuesRes.json();

        setAnalytics({
          events: events.count,
          notices: notices.count,
          lostFound: lostFound.count,
          issues: issues.count,
        });
      } catch (err) {
        console.error(err);
      }
    }

    fetchAnalytics();
  }, []);

  // Card data
  const cards = [
    {
      label: "Events",
      count: analytics.events,
      icon: Calendar,
      href: "/admin/notice-events",
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Notices",
      count: analytics.notices,
      icon: Bell,
      href: "/admin/notice-events",
      color: "bg-green-100 text-green-800",
    },
    {
      label: "Lost & Found",
      count: analytics.lostFound,
      icon: Search,
      href: "/admin/lost-found",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      label: "Issues",
      count: analytics.issues,
      icon: AlertCircle,
      href: "/admin/issues",
      color: "bg-red-100 text-red-800",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, count, icon: Icon, href, color }) => (
          <div
            key={label}
            className={`flex flex-col justify-between p-4 rounded-xl shadow hover:shadow-lg transition bg-white`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            </div>

            <Link
              href={href}
              className="mt-4 inline-block text-sm font-medium text-[color:var(--accent)] hover:underline"
            >
              Go to {label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
