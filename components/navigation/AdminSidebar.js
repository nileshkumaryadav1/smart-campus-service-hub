"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  LayoutDashboard,
  CalendarRange,
  AlertTriangle,
  Search,
  Filter,
  Home,
  Menu,
  X,
} from "lucide-react";
import { useEffect } from "react";

const adminLinks = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Notices & Events",
    href: "/admin/posts",
    icon: CalendarRange,
  },
  {
    name: "Issues",
    href: "/admin/issues",
    icon: AlertTriangle,
  },
  {
    name: "Lost & Found",
    href: "/admin/lost-found",
    icon: Search,
  },
];

export default function AdminSidebar({
  adminUser,
  handleLogout,
  closeSidebar,
  sidebarOpen,
}) {
  const pathname = usePathname();

  // close sidebar on route change (mobile UX)
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  return (
    <aside className="flex h-full flex-col border-r border-[var(--border)] bg-[var(--card)]/60 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-[var(--accent)]" />
          <h2 className="text-lg font-bold">Admin</h2>
        </div>

        {/* mobile toggle */}
        <button
          className="rounded-lg p-1 transition hover:bg-[var(--accent)]/10 md:hidden"
          onClick={closeSidebar}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {adminLinks.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                    : "text-[var(--foreground)] hover:bg-[var(--accent)]/10 hover:text-[var(--accent)]"
                }
              `}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{name}</span>
            </Link>
          );
        })}
      </nav>

      {/* user side btn */}
      <div className="px-4">
        <Link
          href="/"
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 text-sm font-semibold transition-all hover:bg-[var(--accent)] hover:text-white active:scale-95"
        >
          <Home className="h-4 w-4" />
          Go to User Side
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border)] px-4 py-4">
        {adminUser && (
          <>
            <p className="text-sm font-semibold">{adminUser.name}</p>
            <p className="text-xs capitalize text-[var(--accent)]">
              {adminUser.role}
            </p>
          </>
        )}
      </div>
    </aside>
  );
}
