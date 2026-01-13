"use client";

import { useEffect, useRef, useState } from "react";
import HomeServiceCard from "@/components/HomeServiceCard";

export default function HomeServiceCards() {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  /* fetching data */
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

        setItems({
          events: posts.filter((p) => p.type === "event"),
          notices: posts.filter((p) => p.type === "notice"),
          lostFound,
          issues,
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  /* auto-scroll only on mobile */
  useEffect(() => {
    if (!scrollRef.current || !items || window.innerWidth >= 768) return;

    const container = scrollRef.current;

    const interval = setInterval(() => {
      container.scrollBy({ left: 260, behavior: "smooth" });

      if (
        container.scrollLeft + container.offsetWidth >=
        container.scrollWidth
      ) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [items]);

  if (loading) {
    return (
      <p className="min-h-screen flex items-center justify-center text-gray-500">
        Loading updates…
      </p>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/*  HERO  */}
      <section className="bg-white px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-6xl mx-auto text-center space-y-6 sm:space-y-10">
          {/* Title */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-2xl text-gray-700">
              Smart Campus Service Hub
            </h2>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
              For Colleges
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-lg">
              A unified digital platform for managing campus events, notices,
              lost & found, and student issues — with real-time admin control.
            </p>
          </div>

          {/*  FEATURES  */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-xl font-semibold">
              Core System Features
            </h3>

            {/* Mobile scroll */}
            <div
              ref={scrollRef}
              className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
            >
              <HomeServiceCard data={items} />
            </div>

            {/* Desktop grid */}
            <div className="hidden md:block">
              <HomeServiceCard data={items} />
            </div>
          </div>

          {/*  LOGIN  */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 text-sm">
            <a
              href="/login"
              className="px-5 py-2 rounded-full border border-[var(--border)] font-medium text-gray-700 hover:text-[var(--accent)] transition"
            >
              Student Login
            </a>
            <span className="hidden sm:inline text-gray-300">|</span>
            <a
              href="/admin"
              className="px-5 py-2 rounded-full border border-[var(--border)] font-medium text-gray-700 hover:text-black transition"
            >
              Admin Dashboard
            </a>
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="bg-white py-12 sm:py-20 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
          Clear Role Separation
        </h2>

        <div className="grid gap-6 sm:gap-10 md:grid-cols-2 max-w-6xl mx-auto">
          <RoleCard
            title="Student Portal"
            points={[
              "Register & login securely",
              "Raise and track campus issues",
              "View events & notices",
              "Submit lost & found reports",
            ]}
          />
          <RoleCard
            title="Admin Panel"
            points={[
              "Approve, update & delete records",
              "Change issue statuses",
              "Post events and notices",
              "Monitor analytics & reports",
            ]}
          />
        </div>
      </section>

      {/* WORKFLOW  */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">System Workflow</h2>
        <p className="text-gray-600 text-sm sm:text-lg">
          Student submits → Admin reviews → Status updates → Resolution
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mt-3">
          Designed to real-world institutional processes
        </p>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-xs sm:text-sm text-gray-500">
        Built for Hackathon • Designed for Real Campus Use
      </footer>
    </main>
  );
}

/* small component - role card  */

function RoleCard({ title, points }) {
  return (
    <div className="border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-sm bg-white">
      <h3 className="text-lg sm:text-xl font-semibold mb-3">{title}</h3>
      <ul className="space-y-2 text-gray-600 text-sm">
        {points.map((p) => (
          <li key={p}>• {p}</li>
        ))}
      </ul>
    </div>
  );
}
