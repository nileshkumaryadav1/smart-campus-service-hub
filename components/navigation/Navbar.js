"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Bell,
  Search,
  AlertCircle,
  User,
  Building,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

/* NAV ITEMS */
const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/notice-events", label: "Notices & Events", icon: Bell },
  { href: "/issues", label: "Campus Issues", icon: AlertCircle },
  { href: "/lost-found", label: "Lost & Found", icon: Search },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, setUser } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    router.replace("/login");
  };

  const dashboardLink =
    user?.role === "admin"
      ? { href: "/admin", label: "Admin Panel", icon: Building }
      : { href: "/me", label: "Profile", icon: User };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-black/5 bg-white/70 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-[color:var(--accent)]"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="h-9 w-9 rounded-xl border border-black/10"
          />
          SmartCampus
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden items-center gap-2 sm:flex">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition
                  ${
                    active
                      ? "bg-[color:var(--accent)]/10 text-[color:var(--accent)]"
                      : "text-gray-600 hover:text-[color:var(--accent)] hover:bg-black/5"
                  }`}
              >
                <Icon size={16} />
                {label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[color:var(--accent)]" />
                )}
              </Link>
            );
          })}

          {/* AUTH AREA: Always visible next to name */}
          {!loading && user && (
            <div className="ml-4 flex items-center gap-3 rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-medium shadow-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--accent)] text-white">
                {user.name?.[0]}
              </div>
              <span>{user.name}</span>
              <Link
                href={dashboardLink.href}
                className="flex items-center gap-1 rounded-full px-3 py-1 text-sm bg-[color:var(--accent)] text-white hover:opacity-90"
              >
                <dashboardLink.icon size={14} />
                {dashboardLink.label}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full bg-red-500 px-3 py-1 text-sm font-medium text-white hover:opacity-90"
              >
                Logout
              </button>
            </div>
          )}

          {/* AUTH AREA: Login button if not logged in */}
          {!loading && !user && (
            <Link
              href="/login"
              className="ml-2 rounded-full bg-[color:var(--accent)] px-5 py-2 text-sm font-medium text-white shadow hover:opacity-90"
            >
              Login
            </Link>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-2 text-[color:var(--accent)] sm:hidden hover:bg-black/5"
        >
          <Menu size={26} />
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white min-h-screen">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <span className="text-lg font-bold">Menu</span>
            <X size={28} onClick={() => setIsOpen(false)} />
          </div>

          <div className="space-y-2 px-6 py-6">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm hover:bg-black/5"
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}

            {!loading && (
              <div className="mt-4 border-t pt-4">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href={dashboardLink.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-black/5"
                    >
                      <dashboardLink.icon size={18} />
                      {dashboardLink.label}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full rounded-xl bg-red-500 py-3 text-sm font-medium text-white"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-xl bg-[color:var(--accent)] py-3 text-center text-white"
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
