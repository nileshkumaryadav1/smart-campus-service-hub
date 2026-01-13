"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Home,
  Calendar,
  Bell,
  Layers,
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
  { href: "/lost-found", label: "Lost & Found", icon: Search },
  { href: "/issues", label: "Issues", icon: AlertCircle },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, setUser } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  // lock scroll on mobile
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  // logout function
  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    router.replace("/login");
  };

  // dashboard link based on role
  const dashboardLink =
    user?.role === "admin"
      ? { href: "/admin", label: "Admin Panel", icon: Building }
      : { href: "/me", label: "Profile", icon: User };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-[color:var(--border)] bg-[color:var(--background)]/70 backdrop-blur-xl shadow-md">
      <div className="mx-auto flex items-center justify-between px-5 py-3 md:px-20">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center text-xl font-extrabold tracking-tight text-[color:var(--accent)]"
        >
          <img
            src="/glove.svg"
            alt="Logo"
            className="mr-2 h-9 w-9 rounded-full border border-[color:var(--border)]"
          />
        </Link>

        {/* DESKTOP nav */}
        <div className="hidden items-center space-x-6 sm:flex">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition ${
                pathname === href
                  ? "text-[color:var(--accent)]"
                  : "text-[color:var(--secondary)] hover:text-[color:var(--accent)]"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}

          {/* authenticated DESKTOP */}
          {!loading &&
            (user ? (
              <div
                className="relative"
                onMouseEnter={() => setOpenUserMenu(true)}
                onMouseLeave={() => setOpenUserMenu(false)}
              >
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium">
                  <User size={16} />
                  {user.name}
                  <ChevronDown size={14} />
                </button>

                {openUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] shadow-lg">
                    <Link
                      href={dashboardLink.href}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[color:var(--accent)] hover:text-[color:var(--background)]"
                    >
                      <dashboardLink.icon size={14} />
                      {dashboardLink.label}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-md hover:bg-[color:var(--accent)] px-4 py-2 text-sm hover:text-[color:var(--background)]"
              >
                Login
              </Link>
            ))}
        </div>

        {/* MOBILE TOGGLE BTN */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[color:var(--accent)] sm:hidden"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[color:var(--background)]/95 backdrop-blur-2xl">
          <div className="flex items-center justify-between border-b px-6 py-5">
            <span className="text-lg font-bold">Menu</span>
            <X size={30} onClick={() => setIsOpen(false)} />
          </div>

          <div className="space-y-4 px-6 py-6">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 py-3"
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}

            {!loading && (
              <div className="border-t pt-4">
                {user ? (
                  <>
                    <Link
                      href={dashboardLink.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 py-3"
                    >
                      <dashboardLink.icon size={18} />
                      {dashboardLink.label}
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="block py-3 text-red-500"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block rounded-md bg-[color:var(--accent)] py-3 text-center text-[color:var(--background)]"
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
