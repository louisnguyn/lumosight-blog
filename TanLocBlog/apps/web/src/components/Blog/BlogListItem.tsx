import { VscVmActive } from 'react-icons/vsc';
import { MdDesktopAccessDisabled } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
export default function BlogListItem({ post, onSelect , onToggleActive}: { post: any, onSelect: (post: any) => void , onToggleActive?: (post: any,active: boolean) => void }) {
  if (!post) return null; 
  const formattedDate = post.updated_at
    ? (() => {
        const d = new Date(post.updated_at);
        return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${d.getFullYear()}`;
      })()
    : post.created_at
    ? (() => {
        const d = new Date(post.created_at);
        return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
          .toString()
          .padStart(2, "0")}/${d.getFullYear()}`;
      })()
    : "";
  const navigate = useNavigate();
  return (
    <div className="flex flex-col lg:flex-row gap-8 py-8 border-b ml-10 mr-10">
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
          <span className="text-gray-500 text-base">    
            {formattedDate}
          </span>
          {post.categories && (
            <span className="bg-blue-300  text-gray-700 px-3 py-1 rounded-lg text-sm font-medium">{post.categories}</span>
          )}
        </div>
        <h3
          className="text-2xl font-bold text-blue-600 mb-2 cursor-pointer hover:underline"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          {post.title}
        </h3>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-3">
          {post.description
            ? post.description
            : (
                <span
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              )
          }
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
      {typeof post.active === "boolean" && onToggleActive && (
        <div className="mt-4 flex lg:justify-end justify-center">
          <button
            className={`px-4 py-2 rounded ${post.active ? "bg-red-600 text-white" : "bg-green-400 text-white"} font-semibold mr-2 flex flex-row items-center gap-3`}
            onClick={() => onToggleActive(post, !post.active)}
          >
            <span>{post.active ? <MdDesktopAccessDisabled /> : <VscVmActive />}</span>{post.active ? "Set Inactive" : "Set Active"}
          </button>
        </div>
      )}
      </div>
    </div>
  );
}