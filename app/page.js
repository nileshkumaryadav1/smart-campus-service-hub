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
          fetch("/api/issues?scope=all", { credentials: "include" }),
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

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ================= HERO (ENHANCED MODE) ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white px-4 sm:px-6 py-14 sm:py-24">
        {/* subtle background accent */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-8 sm:space-y-12">
          {/* Badge */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-1.5 text-xs sm:text-sm font-medium text-gray-600 shadow-sm">
              🚀 Smart Campus Platform
            </span>
          </div>

          {/* Headings */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
              Smart Campus
              <span className="block text-[var(--accent)]">Service Hub</span>
            </h1>

            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              A unified digital system to manage{" "}
              <span className="font-medium text-gray-800">
                notices, events, lost & found, and student issues
              </span>{" "}
              — with real-time admin control.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="/login"
              className="
          px-6 py-3 rounded-xl
          bg-[var(--accent)] text-white
          font-semibold shadow-md
          hover:shadow-lg hover:scale-[1.02]
          transition
        "
            >
              Student Login
            </a>

            <a
              href="/admin"
              className="
          px-6 py-3 rounded-xl
          border border-[var(--border)]
          bg-white font-semibold
          text-gray-700
          hover:bg-gray-50
          transition
        "
            >
              Admin Dashboard
            </a>
          </div>

          {/* Feature preview strip */}
          {items && (
            <div className="pt-6">
              {/* Mobile */}
              <div
                ref={scrollRef}
                className="md:hidden flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
              >
                <HomeServiceCard data={items} />
              </div>

              {/* Desktop */}
              <div className="hidden md:block">
                <HomeServiceCard data={items} />
              </div>
            </div>
          )}
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

      {/* WORKFLOW */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">System Workflow</h2>
          <p className="text-gray-600 text-sm sm:text-lg mt-2">
            Designed to mirror real-world institutional processes
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {/* Step 1 */}
          <WorkflowCard
            step="01"
            title="Student Submits"
            desc="Students raise issues, report lost & found, or view events and notices."
          />

          {/* Step 2 */}
          <WorkflowCard
            step="02"
            title="Admin Reviews"
            desc="Admins review submissions, verify details, and take action."
          />

          {/* Step 3 */}
          <WorkflowCard
            step="03"
            title="Status Updates"
            desc="Real-time status changes are reflected to students instantly."
          />

          {/* Step 4 */}
          <WorkflowCard
            step="04"
            title="Resolution"
            desc="Issues are resolved, items recovered, and records archived."
          />
        </div>
      </section>
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

function WorkflowCard({ step, title, desc }) {
  return (
    <div className="relative rounded-2xl border border-[var(--border)] bg-white p-6 text-left shadow-sm hover:shadow-md transition">
      <span className="absolute -top-3 left-6 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
        Step {step}
      </span>

      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}
