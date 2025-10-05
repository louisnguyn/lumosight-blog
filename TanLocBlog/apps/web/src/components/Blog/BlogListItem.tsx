import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';
import DefaultPostImage from '../../utils/DefaultPostImage';
export default function BlogListItem({ post, onSelect , onToggleActive , isManagement = false}: { post: any, onSelect: (post: any) => void , onToggleActive?: (post: any,active: boolean) => void,  isManagement?: boolean }) {
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
    <article className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:scale-[1.02] hover:-translate-y-1">
      <div className="flex flex-col lg:flex-row">
        {/* Image */}
        <div className="flex-shrink-0 relative overflow-hidden bg-gray-200 dark:bg-gray-700">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full lg:w-[400px] h-[250px] lg:h-[280px] object-cover object-center"
              style={{ minHeight: '100%' }}
            />
          ) : (
            <DefaultPostImage
              title={post.title}
              className="w-full lg:w-[400px] h-[250px] lg:h-[280px]"
              style={{ minHeight: '100%' }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {post.categories && (
            <div className="absolute top-4 left-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                {post.categories}
              </span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex flex-col flex-1 p-4 lg:p-6">
          {/* Author Info */}
          {post.author_name && (
            <div className="flex items-center gap-3 mb-4">
              <img
                src={post.author_avatar || "/profile.jpeg"}
                alt={post.author_name}
                className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-600"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/user/${post.author_id}`);
                }}
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors duration-300"
              >
                {post.author_name}
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-4 mb-4">
            <span className="flex gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center">
              <FaCalendarAlt/>
              {formattedDate}
            </span>
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm">
              <FaEye/>
              {post.views || 0} views
            </div>
          </div>
          
          <h3
            className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 cursor-pointer group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2"
            onClick={() => isManagement ? onSelect(post) : navigate(`/post/${post.id}`)}
          >
            {post.title}
          </h3>
          
          <div className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed">
            {post.description
              ? post.description
              : (
                  <span
                    dangerouslySetInnerHTML={{ 
                      __html: post.content?.replace(/<[^>]*>/g, '').substring(0, 200) + '...' 
                    }}
                  />
                )
            }
          </div>
          
          {/* Tags */}
          {post.tags && (
            <div className="flex gap-2 mb-6 flex-wrap">
              {post.tags.split(",").slice(0, 3).map((tag: string) => (
                <span
                  key={tag}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300"
                >
                  #{tag.trim()}
                </span>
              ))}
              {post.tags.split(",").length > 3 && (
                <span className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-3 py-1 rounded-full text-sm font-medium">
                  +{post.tags.split(",").length - 3} more
                </span>
              )}
            </div>
          )}
          
          {/* Bottom Section */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <FaHeart/>
                {post.likes || 0} likes
              </div>
            </div>
            
            <button
              onClick={() => isManagement ? onSelect(post) : navigate(`/post/${post.id}`)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {isManagement ? 'Edit Post' : 'Read More'}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Management Actions */}
          {typeof post.active === "boolean" && onToggleActive && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${post.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-sm font-medium ${post.active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {post.active ? 'Published' : 'Draft'}
                  </span>
                </div>
                <button
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
                    post.active 
                      ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800" 
                      : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                  }`}
                  onClick={() => onToggleActive(post, !post.active)}
                >
                  {post.active ? 'Unpublish' : 'Publish'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}