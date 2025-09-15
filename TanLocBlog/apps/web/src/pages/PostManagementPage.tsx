import { useEffect, useState } from "react";
import { supabase } from "../db/supabaseClient";
import BlogListItem from "../components/Blog/BlogListItem";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import SearchBar from "../components/SearchBar/SearchBar";
import PostForm from "../components/PostForm/PostForm";
export default function PostManagementPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  useEffect(() => {
    async function fetchUserAndPosts() {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const uid = sessionData?.session?.user?.id;
      setUserId(uid ?? null);
      if (uid) {
        const { data } = await supabase
          .from("posts")
          .select("*")
          .eq("author_id", uid);
        if (data) setPosts(data);
      }
      setLoading(false);
    }
    fetchUserAndPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title?.toLowerCase().includes(search.toLowerCase()) ||
    post.content?.toLowerCase().includes(search.toLowerCase())
  );
  const handleCreateClick = () => {
    setFormMode("create");
    setSelectedPost(null);
  };

  const handleEditClick = (post: any) => {
    setFormMode("edit");
    setSelectedPost(post);
  };

  const handleFormSuccess = async () => {
    setFormMode(null);
    setSelectedPost(null);
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const uid = sessionData?.session?.user?.id;
    if (uid) {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", uid);
      if (data) setPosts(data);
    }
    setLoading(false);
  };

  const handleFormCancel = () => {
    setFormMode(null);
    setSelectedPost(null);
  };
  const handleToggleActive = async (post: any, active: boolean) => {
    await supabase
      .from("posts")
      .update({ active })
      .eq("id", post.id);
    handleFormSuccess(); // refresh posts
  };
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
    <Header />
    <div className="flex-1 max-w-3xl mx-auto py-8 w-full">
      {formMode ? (
        <PostForm
          mode={formMode}
          post={selectedPost}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6 dark:text-white">Your Posts</h1>
          <div className = "flex flex-row justify-between">
            <button
              className="mb-6 ml-4 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
              onClick={handleCreateClick}
            >
              Create Post
            </button>
            <SearchBar
              value={search}
              onChange={setSearch}
              className="mb-6 w-[40px]"
              placeholder="Search your posts..."
            />
          </div>
          {loading ? (
            <div className="text-gray-500">Loading...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-gray-500">No posts found.</div>
          ) : (
            <div>
              {filteredPosts.map(post => (
                <BlogListItem
                  key={post.id}
                  post={post}
                  onSelect={() => handleEditClick(post)}
                  isManagement
                  onToggleActive={handleToggleActive}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
    <Footer />
    </div>
  );
}