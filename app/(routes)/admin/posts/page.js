"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  // fetching all posts
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts", {
          credentials: "include", // important if using cookies for auth
        });
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Delete post
  async function deletePost(id) {
    if (!confirm("Delete this post?")) return;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        credentials: "include", // needed for cookie auth
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "Failed to delete post");
        return;
      }

      // Update state after delete
      setPosts((prevPosts) => prevPosts.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the post");
    }
  }

  if (loading) return <p className="p-6">Loading posts…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Notices & Events</h1>

      <button
        onClick={() => router.push("/admin/posts/new")}
        className="mb-4 bg-black text-white px-4 py-2 rounded"
      >
        Create New
      </button>

      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post._id} className="border p-3 rounded-md shadow-sm">
              <h2 className="font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-600">{post.type}</p>

              <div className="space-x-3 mt-2">
                <button
                  onClick={() =>
                    router.push(`/admin/posts/${post._id}`)
                  }
                  className="underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(post._id)}
                  className="text-red-500 underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
