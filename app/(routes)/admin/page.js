"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Calendar, Bell, Search, AlertCircle } from "lucide-react";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);

  const [analytics, setAnalytics] = useState({
    events: 0,
    notices: 0,
    lostFound: 0,
    issues: 0,
  });

  /* =========================
     Fetch real data
     ========================= */
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [postsRes, lostFoundRes, issuesRes] = await Promise.all([
          fetch("/api/posts", { credentials: "include" }),
          fetch("/api/lost-found", { credentials: "include" }),
          fetch("/api/issues", { credentials: "include" }),
        ]);

        const posts = await postsRes.json();
        const lostFound = await lostFoundRes.json();
        const issues = await issuesRes.json();

        setAnalytics({
          events: posts.filter((p) => p.type === "event").length,
          notices: posts.filter((p) => p.type === "notice").length,
          lostFound: lostFound.length,
          issues: issues.length,
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  /* =========================
     Cards config
     ========================= */
  const cards = [
    {
      label: "Events",
      count: analytics.events,
      icon: Calendar,
      href: "/admin/posts?type=event",
      color: "bg-blue-100 text-blue-800",
    },
    {
      label: "Notices",
      count: analytics.notices,
      icon: Bell,
      href: "/admin/posts?type=notice",
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

  /* UI */
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {loading && <p className="text-gray-500 text-sm">Loading analytics…</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, count, icon: Icon, href, color }) => (
          <div
            key={label}
            className="flex flex-col justify-between p-5 rounded-xl border border-[var(--border)] bg-white shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${color}`}>
                <Icon size={22} />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-2xl font-bold">{loading ? "—" : count}</p>
              </div>
            </div>

            <Link
              href={href}
              className="mt-4 text-sm font-medium text-[color:var(--accent)] hover:underline"
            >
              Go to {label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
