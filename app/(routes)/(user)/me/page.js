"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AlertCircle, Search } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

export default function MePage() {
  const { user, loading: authLoading } = useAuth();
  const [issues, setIssues] = useState([]);
  const [lostFound, setLostFound] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     Fetch user-specific data
     ========================= */
  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      try {
        // Fetch only the current user's issues and lost & found
        const [issuesRes, lostFoundRes] = await Promise.all([
          fetch(`/api/issues?userId=${user._id}`, { credentials: "include" }),
          fetch(`/api/lost-found?userId=${user._id}`, { credentials: "include" }),
        ]);

        const userIssues = await issuesRes.json();
        const userLostFound = await lostFoundRes.json();

        setIssues(userIssues);
        setLostFound(userLostFound);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (authLoading || loading)
    return <p className="p-6 text-center">Loading dashboard…</p>;
  if (!user)
    return <p className="p-6 text-center">You need to log in to view this page.</p>;

  // Cards configuration
  const cards = [
    {
      label: "Raised Issues",
      count: issues.length,
      icon: AlertCircle,
      href: "/issues",
      color: "bg-red-100 text-red-800",
    },
    {
      label: "Lost & Found",
      count: lostFound.length,
      icon: Search,
      href: "/lost-found",
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome, {user.name}</p>
          <p className="text-gray-500 text-sm">Email: {user.email}</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
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
                <p className="text-2xl font-bold">{count}</p>
              </div>
            </div>
            <Link
              href={href}
              className="mt-4 text-sm font-medium text-[color:var(--accent)] hover:underline"
            >
              View {label}
            </Link>
          </div>
        ))}
      </div>

      {/* Detailed Lists */}
      <div className="space-y-6">
        {/* Issues List */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Your Raised Issues</h3>
          {issues.length === 0 ? (
            <p className="text-gray-500">No issues raised yet.</p>
          ) : (
            <ul className="space-y-3">
              {issues.map((issue) => (
                <li
                  key={issue._id}
                  className="border border-[var(--border)] p-4 rounded-lg hover:shadow transition"
                >
                  <h4 className="font-medium">{issue.title}</h4>
                  <p className="text-gray-600 text-sm">{issue.description}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Category: {issue.category} • Created:{" "}
                    {new Date(issue.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Lost & Found List */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Your Lost & Found Items</h3>
          {lostFound.length === 0 ? (
            <p className="text-gray-500">No lost/found items reported yet.</p>
          ) : (
            <ul className="space-y-3">
              {lostFound.map((item) => (
                <li
                  key={item._id}
                  className="border border-[var(--border)] p-4 rounded-lg hover:shadow transition"
                >
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Status: {item.status} • Created:{" "}
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
