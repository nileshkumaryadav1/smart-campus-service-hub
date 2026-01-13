"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("notice");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, type }),
    });

    router.push("/admin/posts");
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md">
      <h1 className="text-xl font-bold mb-4">Create Post</h1>

      <input
        className="border border-[var(--border)] w-full p-2 mb-3"
        placeholder="Title"
        onChange={e => setTitle(e.target.value)}
        required
      />

      <textarea
        className="border border-[var(--border)] w-full p-2 mb-3"
        placeholder="Description"
        onChange={e => setDescription(e.target.value)}
        required
      />

      <select
        className="border border-[var(--border)] w-full p-2 mb-3"
        onChange={e => setType(e.target.value)}
      >
        <option value="notice">Notice</option>
        <option value="event">Event</option>
      </select>

      <button className="bg-black text-white px-4 py-2">
        Save
      </button>
    </form>
  );
}
