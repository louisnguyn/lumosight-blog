import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../db/supabaseClient";
import Detail from "../components/Blog/Detail";
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer";
export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase.from("posts").select("*").eq("id", id).single();
      setPost(data);
    }
    fetchPost();
  }, [id]);
  useEffect(() => {
    if (!post?.id) return;
    const viewKey = `post_view_${post.id}`;
    const lastViewed = localStorage.getItem(viewKey);
    const now = Date.now();
    if (!lastViewed || now - Number(lastViewed) > 1800 * 1000) {
      supabase
        .from("posts")
        .update({ views: (post.views ?? 0) + 1 })
        .eq("id", post.id)
        .then(() => {
          // Refetch post to update views in UI
          supabase.from("posts").select("*").eq("id", post.id).single().then(({ data }) => setPost(data));
        });
      localStorage.setItem(viewKey, String(now));
    }
  }, [post?.id]);

  const getPostDescription = (content: string) => {
    if (!content) return "Read this amazing story on Lumosight";
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    return plainText.length > 160 ? plainText.substring(0, 160) + '...' : plainText;
  };

  const getPostImage = (post: any) => {
    if (post?.image_url) return post.image_url;
    return "https://lumosight.app/Lumosight_logo.png";
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Helmet>
        <title>{post?.title ? `${post.title} | Lumosight` : "Lumosight - Discover Amazing Stories"}</title>
        <meta name="description" content={post ? getPostDescription(post.content) : "Lumosight is a modern blogging platform where writers and readers connect."} />
        <meta property="og:title" content={post?.title || "Lumosight - Discover Amazing Stories"} />
        <meta property="og:description" content={post ? getPostDescription(post.content) : "Lumosight is a modern blogging platform where writers and readers connect."} />
        <meta property="og:image" content={post ? getPostImage(post) : "https://lumosight.app/Lumosight_logo.png"} />
        <meta property="og:url" content={`https://lumosight.app/post/${id}`} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Lumosight" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post?.title || "Lumosight - Discover Amazing Stories"} />
        <meta name="twitter:description" content={post ? getPostDescription(post.content) : "Lumosight is a modern blogging platform where writers and readers connect."} />
        <meta name="twitter:image" content={post ? getPostImage(post) : "https://lumosight.app/Lumosight_logo.png"} />

        <meta name="author" content={post?.author_name || "Lumosight"} />
        <meta name="article:published_time" content={post?.created_at} />
        <meta name="article:author" content={post?.author_name || "Lumosight"} />
      </Helmet>
      
      <Header/>
      <div className="flex-1 flex flex-col">
        <Detail post={post} onBack={() => navigate("/blog")} />
      </div>
      <Footer />
    </div>
  );
}