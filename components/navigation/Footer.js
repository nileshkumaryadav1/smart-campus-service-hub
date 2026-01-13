import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-black/5 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* TOP GRID to align the content */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* BRAND */}
          <div className="space-y-3">
            <h3 className="text-lg font-extrabold text-[color:var(--accent)]">
              Smart Campus Service Hub
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              A unified digital platform to manage campus events, issues,
              notices, and student services with real-time administrative
              control.
            </p>
          </div>

          {/* EXPLORE the features */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/notice-events"
                  className="hover:text-[color:var(--accent)] transition"
                >
                  Notices & Events
                </Link>
              </li>
              <li>
                <Link
                  href="/issues"
                  className="hover:text-[color:var(--accent)] transition"
                >
                  Campus Issues
                </Link>
              </li>
              <li>
                <Link
                  href="/lost-found"
                  className="hover:text-[color:var(--accent)] transition"
                >
                  Lost & Found
                </Link>
              </li>
            </ul>
          </div>

          {/* ACCESS / roles */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-900">
              Access
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link
                  href="/login"
                  className="hover:text-[color:var(--accent)] transition"
                >
                  Student Login
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-[color:var(--accent)] transition"
                >
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* horizontal divider */}
        <div className="my-10 h-px bg-black/5" />

        {/* bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-gray-500 md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} Smart Campus Service Hub.</p>
          <p className="italic">
            Built for Hackathon • Designed for Real-World Campus Use
          </p>
        </div>
      </div>
    </footer>
  );
}
