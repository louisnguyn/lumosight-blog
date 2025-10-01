import "./Detail.css"
import { supabase } from "../../db/supabaseClient";
import {useState, useEffect}from "react";
import { BiArrowBack } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import { FaShareSquare } from 'react-icons/fa';
import Comments from "../Comments/Comments";
import { FaCalendarAlt } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
export default function Detail({ post, onBack }: { post: any, onBack: () => void }) {
    const [authorName, setAuthorName] = useState<string>("");
    const [authorAvatar, setAuthorAvatar] = useState<string>("");
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
      if (post && typeof post.likes === "number") {
        setLikes(post.likes);
      }
    }, [post]);
    useEffect(() => {
      async function fetchAuthor() {
        if (post?.author_id) {
              const { data } = await supabase
              .from("profile")
              .select("full_name, avatar_url")
              .eq("user_id", post.author_id)
              .single();
              if (data && data.full_name) {
              setAuthorName(data.full_name);
              setAuthorAvatar(data.avatar_url ?? "/profile.jpeg");
          } else {
              setAuthorName("Unknown Author");
              setAuthorAvatar("/profile.jpeg");
          }
        }
    }
    fetchAuthor();
  }, [post?.author_id]);
  useEffect(() => {
    async function fetchUser() {
      const { data: userData } = await supabase.auth.getUser();
      setUserId(userData?.user?.id ?? null);
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function checkLiked() {
      if (!post?.id || !userId) {
        setLiked(false);
        return;
      }
      const { data } = await supabase
        .from("likes")
        .select("*")
        .match({ post_id: post.id, user_id: userId })
        .maybeSingle();
      setLiked(!!data);
    }
    checkLiked();
  }, [post?.id, userId]);

  const handleLike = async () => {
    if (!userId || !post?.id) return;
    if (liked) {
      await supabase.from("likes").delete().match({ post_id: post.id, user_id: userId });
      setLiked(false);
      setLikes(likes - 1);
      await supabase.from("posts").update({ likes: likes - 1 }).eq("id", post.id);
    } else {
      await supabase.from("likes").insert([{ post_id: post.id, user_id: userId }]);
      setLiked(true);
      setLikes(likes + 1);
      await supabase.from("posts").update({ likes: likes + 1 }).eq("id", post.id);
    }
  };
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
  const handleShare = async () => {
    const url = window.location.origin + "/post/" + post.id;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-white py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
        <button 
            onClick={onBack} 
            className="mb-8 inline-flex items-center px-6 py-3 bg-white/30 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
          >
            <BiArrowBack className="mr-2 w-5 h-5" />
            Back to Blog
          </button>
          
          <div className="text-center mb-8">
            {post.categories && (
              <span className="inline-block bg-yellow-400 text-blue-900 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {post.categories}
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
              {post.title}
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-blue-100 animate-fade-in-up animation-delay-200">
              <div className="flex items-center gap-2">
                <img
                  src={authorAvatar || "/profile.jpeg"}
                  alt={authorName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
                />
                <button
                  onClick={() => navigate(`/user/${post.author_id}`)}
                  className="font-semibold text-center hover:text-white hover:underline transition-colors duration-300 cursor-pointer"
                >
                  {authorName}
                </button>
              </div>
              <div className="flex items-center gap-1">
                <FaCalendarAlt className="w-4 h-4"/>
                <span className="text-sm sm:text-base">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaEye className="w-4 h-4"/>
                <span className="text-sm sm:text-base">{post.views || 0} views</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/20 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-yellow-400/30 rounded-full animate-float animation-delay-2000"></div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Featured Image */}
          <div className="relative overflow-hidden">
            <img
              src={post.image || "/default-blog.jpg"}
              alt={post.title}
              className="w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Article Content */}
          <div className="p-6 lg:p-8">
            {/* Tags */}
            {post.tags && (
              <div className="flex gap-2 mb-8 flex-wrap">
                {post.tags.split(",").map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-300"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Article Content */}
            <div 
              className="post-content prose prose-lg lg:prose-xl max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            ></div>

            {/* Action Buttons */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <FaEye className="w-4 h-4"/>
                    <span className="text-sm sm:text-base">{post.views || 0} views</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  {userId ? (
                    <button
                      className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base ${
                        liked 
                          ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      }`}
                      onClick={handleLike}
                    >
                      {liked ? <FaHeart className="text-red-500 w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
                      <span className="hidden sm:inline">{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
                      <span className="sm:hidden">{likes}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                      <FaRegHeart className="w-4 h-4" />
                      <span className="hidden sm:inline">{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
                      <span className="sm:hidden">{likes}</span>
                    </div>
                  )}
                  
                  <button
                    className={`flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 active:scale-95 text-sm sm:text-base ${
                      copied 
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                    onClick={handleShare}
                  >
                    <FaShareSquare className="w-4 h-4" />
                    <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
                    <span className="sm:hidden">{copied ? "✓" : "Share"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <Comments postId={post.id} />
        </div>
      </div>
    </div>
  );
}