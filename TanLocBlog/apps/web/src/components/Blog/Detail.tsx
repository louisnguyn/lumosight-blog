import "./Detail.css"
import { supabase } from "../../db/supabaseClient";
import {useState, useEffect}from "react";
import { BiArrowBack } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import { FaShareSquare } from 'react-icons/fa';
import Comments from "../Comments/Comments";
export default function Detail({ post, onBack }: { post: any, onBack: () => void }) {
    const [authorName, setAuthorName] = useState<string>("");
    const [authorAvatar, setAuthorAvatar] = useState<string>("");
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
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
    <div className="mx-auto mt-5 mb-5 p-4 sm:p-8 md:p-12 lg:p-16 bg-white dark:bg-gray-900 rounded-xl shadow-lg max-w-full lg:max-w-6xl md:max-w-5x1">
      <button onClick={onBack} className="mb-6 text-blue-600 text-lg font-medium">
        <BiArrowBack className="inline-block mr-2" /> Back to list
      </button>
      <div className="flex flex-col gap-8">
        {/* Blog Image */}
        <div className="flex justify-center">
          <img
            src={post.image || "/default-blog.jpg"}
            alt={post.title}
            className="rounded-xl object-cover w-full max-w-2xl bg-gray-200"
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
        <h2 className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">{post.title}</h2>
        <div className="flex mb-2 text-base text-gray-500 font-medium items-center">
          <img
            src={authorAvatar || "/profile.jpeg"}
            alt={authorName}
            className="w-10 h-10 rounded-full object-cover mr-2 bg-gray-200"
          />
          {authorName}
        </div>
        {/* Content */}
        <div className="post-content text-lg lg:text-xl text-gray-700 dark:text-gray-300 mb-4" dangerouslySetInnerHTML={{ __html: post.content }}></div>
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
          <div className="flex flex-row">
          {userId ? (
            <button
              className="flex items-center gap-2 px-3 py-1 rounded font-semibold"
              onClick={handleLike}
            >
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
              {likes} likes
            </button>
            ) : (
              <span className="flex items-center gap-2 px-3 py-1 rounded font-semibold">
                {likes} likes
              </span>
            )}
            <button
              className="flex items-center gap-2 px-3 py-1 rounded font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={handleShare}
            >
              <FaShareSquare />
              {copied ? "Copied!" : "Share"}
            </button>
          </div>
        </div>
      </div>
      <Comments postId={post.id} />
    </div>
  );
}