"use client";

import Link from "next/link";

const typeColor = {
  event: "bg-blue-100 text-blue-700",
  notice: "bg-purple-100 text-purple-700",
  issue: "bg-red-100 text-red-700",
  "lost & found": "bg-yellow-100 text-yellow-800",
};

export default function HomeServiceCards({ data }) {
  // helper to format items in a short summary
  const renderItems = (items, typeLabel) => {
    if (!items || items.length === 0)
      return <p className="text-gray-400 text-sm">No {typeLabel}</p>;

    // showing max 2 items per type for summary
    return items.slice(0, 2).map((item) => (
      <div key={item._id} className="mb-3">
        <span
          className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${typeColor[typeLabel]}`}
        >
          {typeLabel}
        </span>
        <h4 className="text-sm font-semibold line-clamp-1">{item.title}</h4>
        <p className="text-xs text-gray-500 line-clamp-2">
          {item.description || "No description"}
        </p>
      </div>
    ));
  };

  // cards configuration
  const cards = [
    { title: "Events", items: data.events, typeLabel: "event", link: "/notice-events" },
    { title: "Notices", items: data.notices, typeLabel: "notice", link: "/notice-events" },
    { title: "Raised Issues", items: data.issues, typeLabel: "issue", link: "/issues" },
    { title: "Lost & Found", items: data.lostFound, typeLabel: "lost & found", link: "/lost-found" },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {cards.map(({ title, items, typeLabel, link }) => (
        <Link key={title} href={link}>
          <div className="bg-white border border-[var(--border)] rounded-2xl p-5 shadow-sm hover:shadow-lg transition cursor-pointer">
            <h3 className="text-lg font-bold mb-3">{title}</h3>
            {renderItems(items, typeLabel)}
          </div>
        </Link>
      ))}
    </div>
  );
}
