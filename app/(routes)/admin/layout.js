"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import AdminSidebar from "@/components/navigation/AdminSidebar";
import { useAuth } from "@/components/AuthProvider";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading, setUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdminLoginPage = pathname === "/admin/login";
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  /* ADMIN AUTHENTICATION GUARD */
  useEffect(() => {
    if (loading || isAdminLoginPage) return;

    if (!user) {
      router.replace("/admin/login");
      return;
    }

    if (!isAdmin) {
      router.replace("/");
    }
  }, [loading, user, isAdmin, isAdminLoginPage, router]);

  /* LOCK SCROLL WHEN SIDEBAR OPEN */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  /* After ESC → Sidebar close */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  /* LOGOUT */
  const handleLogout = async () => {
    const ok = window.confirm("Are you sure you want to logout?");
    if (!ok) return;

    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    router.replace("/admin/login");
  };

  /*  loading state */
  if (loading && !isAdminLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <p className="text-sm text-[var(--foreground)]/70">
          Checking admin access…
        </p>
      </div>
    );
  }

  /* block UNAUTHORIZED access*/
  if (!isAdmin && !isAdminLoginPage) {
    return null;
  }

  /* ADMIN LOGIN PAGE (NO LAYOUT) */
  if (isAdminLoginPage) {
    return children;
  }

  /* admin layout */
  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-[var(--card)] shadow-xl transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0 md:shadow-none`}
      >
        <AdminSidebar
          adminUser={user}
          handleLogout={handleLogout}
          closeSidebar={() => setSidebarOpen(false)}
          sidebarOpen={sidebarOpen}
        />
      </aside>

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col">
        {/* Mobile topbar */}
        <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-4 py-3 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded p-2 transition hover:bg-[var(--accent)]/10"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          <h1 className="text-lg font-semibold">Admin Dashboard</h1>

          <div></div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
