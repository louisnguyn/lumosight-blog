import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../db/supabaseClient";
import Detail from "../components/Blog/Detail";
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer";
import { isUUID } from "../utils/slugGenerator";
import SeoHead from "../components/Seo/SeoHead";
import { SITE_NAME, SITE_OG_IMAGE, SITE_URL } from "../seo/site";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      
      const isId = isUUID(id);
      const query = isId 
        ? supabase.from("posts").select("*").eq("id", id)
        : supabase.from("posts").select("*").eq("posts_slug", id);
      
      const { data } = await query.single();
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
          supabase.from("posts").select("*").eq("id", post.id).single().then(({ data }) => setPost(data));
        });
      localStorage.setItem(viewKey, String(now));
    }
  }, [post?.id]);

  const getPostDescription = (content: string) => {
    if (!content) return "Read this story on Lumosight.";
    const plainText = content.replace(/<[^>]*>/g, "").trim();
    return plainText.length > 155 ? `${plainText.substring(0, 152)}...` : plainText;
  };

  const getPostImage = (postData: { image_url?: string }) => {
    if (postData?.image_url) return postData.image_url;
    return SITE_OG_IMAGE;
  };

  const postUrl = `${SITE_URL}/post/${id}`;
  const title = post?.title ? `${post.title} | ${SITE_NAME}` : `${SITE_NAME} | Blog`;
  const description = post
    ? getPostDescription(post.description || post.content)
    : "Read stories on Lumosight.";

  const articleJsonLd = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description,
        image: getPostImage(post),
        datePublished: post.created_at,
        dateModified: post.updated_at || post.created_at,
        author: {
          "@type": "Person",
          name: post.author_name || SITE_NAME,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/icon-512.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": postUrl,
        },
      }
    : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <SeoHead
        title={title}
        description={description}
        image={post ? getPostImage(post) : SITE_OG_IMAGE}
        url={postUrl}
        type="article"
        jsonLd={articleJsonLd}
      />
      
      <Header/>
      <div className="flex-1 flex flex-col">
        <Detail post={post} onBack={() => navigate("/blog")} />
      </div>
      <Footer />
    </div>
  );
}
