"use client";

import { useEffect, useState } from "react";

export default function NoticesPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/posts?type=notice")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notices</h1>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post._id}
            className="border p-4 rounded-md shadow-sm"
          >
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-600">{post.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              Posted by {post.createdBy?.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
