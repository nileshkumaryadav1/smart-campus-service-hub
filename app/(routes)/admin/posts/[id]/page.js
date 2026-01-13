"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPost() {
  const { id } = useParams(); // dynamic route [id]
  const router = useRouter();

  const [post, setPost] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  // Fetch post data
  useEffect(() => {
    if (!id) return;

    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch post");

        const data = await res.json();
        console.log("Fetched post:", data); // debug

        setPost({
          title: data.title || "",
          description: data.description || "",
        });
      } catch (err) {
        console.error(err);
        setError("Could not load post");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  // Update post
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError("");

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
        credentials: "include", // if using cookies
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Update failed");
      }

      router.push("/admin/posts");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update post");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p>Loading post…</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleUpdate}
      className="mx-auto p-6 max-w-md bg-[var(--card)] rounded-xl shadow-md"
    >
      <h1 className="text-xl font-semibold mb-4">Edit Post</h1>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <input
        type="text"
        placeholder="Title"
        required
        className="border w-full p-2 mb-3 rounded"
        value={post.title}
        onChange={(e) => setPost({ ...post, title: e.target.value })}
      />

      <textarea
        placeholder="Description"
        required
        className="border w-full p-2 mb-3 rounded"
        value={post.description}
        onChange={(e) => setPost({ ...post, description: e.target.value })}
      />

      <button
        type="submit"
        disabled={updating}
        className="w-full bg-black text-white px-4 py-2 rounded disabled:opacity-60"
      >
        {updating ? "Updating…" : "Update"}
      </button>
    </form>
  );
}
