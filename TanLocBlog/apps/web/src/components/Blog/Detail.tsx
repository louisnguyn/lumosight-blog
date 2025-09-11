// import React from "react";

// export default function Detail({ post, onBack }: { post: any, onBack: () => void }) {
//   if (!post) return null;
//   return (
//     <div className="p-4 bg-white dark:bg-gray-900 rounded shadow">
//       <button onClick={onBack} className="mb-4 text-blue-600 underline">Back to list</button>
//       <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
//       <div className="text-sm text-gray-500 mb-2">
//         {post.categories && <span className="mr-2">{post.categories}</span>}
//         {post.tags && <span>#{post.tags}</span>}
//       </div>
//       <div className="mb-4">{post.content}</div>
//     </div>
//   );
// }
import { supabase } from "../../db/supabaseClient";
import React ,{useState, useEffect}from "react";
import { BiArrowBack } from 'react-icons/bi';
export default function Detail({ post, onBack }: { post: any, onBack: () => void }) {
    const [authorName, setAuthorName] = useState<string>("");
    if (!post) return null;
    const formattedDate = post.created_at
        ? (() => {
            const d = new Date(post.created_at);
            return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${d.getFullYear()}`;
        })()
        : "";
    useEffect(() => {
        async function fetchAuthor() {
            if (post?.author_id) {
                    const { data, error } = await supabase
                    .from("profile")
                    .select("full_name")
                    .eq("user_id", post.author_id)
                    .single();
                    if (data && data.full_name) {
                    setAuthorName(data.full_name);
                } else {
                    setAuthorName("Unknown Author");
                }
            }
    }
    fetchAuthor();
  }, [post?.author_id]);
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <button onClick={onBack} className="mb-6 text-blue-600 underline text-lg font-medium">
        <BiArrowBack className="inline-block mr-2" /> Back to list
      </button>
      <div className="flex flex-col gap-6">
        {/* Blog Image */}
        <div className="flex justify-center">
          <img
            src={post.image || "/default-blog.jpg"}
            alt={post.title}
            className="rounded-xl object-cover w-full max-w-xl h-[320px] bg-gray-200"
          />
        </div>
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-gray-500 text-base justify-between">
          <span>{formattedDate}</span>
          {post.categories && (
            <span className="bg-blue-300 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium">
              {post.categories}
            </span>
          )}
        </div>
        {/* Title */}
        <h2 className="text-3xl font-bold text-blue-600 mb-2">{post.title}</h2>
        <div className="mb-2 text-base text-gray-500 font-medium">
          By {authorName}
        </div>
        {/* Content */}
        <div className="text-lg text-gray-700 dark:text-gray-300 mb-4">{post.content}</div>
        {/* Tags */}
        <div className="flex gap-2 mb-2 flex-wrap justify-end">
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
        <div className="flex items-center gap-6 mt-2 text-gray-500 text-base justify-between">
          <span>{post.views || 0} views</span>
          <span>{post.likes || 0} likes</span>
        </div>
      </div>
    </div>
  );
}