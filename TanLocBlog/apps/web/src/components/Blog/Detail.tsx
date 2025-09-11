import React from "react";

export default function Detail({ post, onBack }: { post: any, onBack: () => void }) {
  if (!post) return null;
  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">
      <button onClick={onBack} className="mb-4 text-blue-600 underline">Back to list</button>
      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
      <div className="text-sm text-gray-500 mb-2">
        {post.categories && <span className="mr-2">{post.categories}</span>}
        {post.tags && <span>#{post.tags}</span>}
      </div>
      <div className="mb-4">{post.content}</div>
    </div>
  );
}