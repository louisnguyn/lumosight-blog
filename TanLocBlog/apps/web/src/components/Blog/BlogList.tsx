import React from "react";
import BlogListItem from "./BlogListItem";

export default function BlogList({ posts, onSelect }: { posts: any[], onSelect: (post: any) => void }) {
  if (!posts.length) return <div>No posts found.</div>;
  return (
    <div>
      {posts.map(post => (
        <BlogListItem key={post.id} post={post} onSelect={onSelect} />
      ))}
    </div>
  );
}