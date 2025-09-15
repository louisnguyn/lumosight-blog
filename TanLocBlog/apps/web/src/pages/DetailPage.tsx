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

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header/>
      <div className="flex-1 flex flex-col items-center justify-center">
        <Detail post={post} onBack={() => navigate("/")} />
      </div>
      <Footer />
    </div>
  );
}