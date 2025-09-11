import React from "react";

export default function BlogListItem({ post, onSelect }: { post: any, onSelect: (post: any) => void }) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 py-8 border-b">
      {/* Image */}
      <div className="flex-shrink-0 flex justify-center items-center">
        <img
          src={post.image || "/default-blog.jpg"}
          alt={post.title}
          className="rounded-xl object-cover w-[320px] h-[220px] bg-gray-200"
        />
      </div>
      {/* Content */}
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-4 mb-2 justify-between">
          <span className="text-gray-500 text-base">    {post.created_at
            ? (() => {
                const d = new Date(post.created_at);
                return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}/${d.getFullYear()}`;
                })()
            : ""}</span>
          {post.categories && (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium">{post.categories}</span>
          )}
        </div>
        <h3
          className="text-2xl font-bold text-blue-600 mb-2 cursor-pointer hover:underline"
          onClick={() => onSelect(post)}
        >
          {post.title}
        </h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-3">
          {post.description || post.content}
        </p>
        {/* Tags */}
        <div className="flex gap-2 mb-2 flex-wrap">
          {post.tags &&
            post.tags.split(",").map((tag: string) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                #{tag.trim()}
              </span>
            ))}
        </div>
        {/* Views and Likes */}
        <div className="flex items-center gap-6 mt-auto text-gray-500 text-base justify-between">
          <span>{post.views || 0} views</span>
          <span>{post.likes || 0} likes</span>
        </div>
      </div>
    </div>
  );
}