import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header/>
      <div className="flex-1 flex flex-col">
        <Detail post={post} onBack={() => navigate("/blog")} />
      </div>
      <Footer />
    </div>
  );
}