import { useEffect, useState } from "react";
import { supabase } from "../db/supabaseClient";
import BlogListItem from "../components/Blog/BlogListItem";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import SearchBar from "../components/SearchBar/SearchBar";
import PostForm from "../components/PostForm/PostForm";
import "./PostManagement.css";
export default function PostManagementPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [userId,setUserId] = useState<string | null>(null);
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
    post.content?.toLowerCase().includes(search.toLowerCase()) ||
    post.categories?.toLowerCase().includes(search.toLowerCase()) ||
    post.tags?.toLowerCase().includes(search.toLowerCase())
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
    handleFormSuccess(); 
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-white py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-up">
              Manage Your Posts
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Create, edit, and manage your blog posts with ease
            </p>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/20 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-yellow-400/30 rounded-full animate-float animation-delay-2000"></div>
      </section>

      <div className="flex-1 max-w-7xl mx-auto py-8 px-6">
        {formMode ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <PostForm
              mode={formMode}
              post={selectedPost}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-row items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Your Posts
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
                </p>
              </div>
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                onClick={handleCreateClick}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Post
              </button>
            </div>
            
            <div className="mb-8">
              <SearchBar
                value={search}
                onChange={setSearch}
                className="w-full max-w-md"
                placeholder="Search your posts..."
              />
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your posts...</p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {search ? 'No posts found' : 'No posts yet'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    {search 
                      ? 'Try adjusting your search terms or create a new post.'
                      : 'Start your blogging journey by creating your first post!'
                    }
                  </p>
                  {!search && (
                    <button
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
                      onClick={handleCreateClick}
                    >
                      Create Your First Post
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <div 
                    key={post.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <BlogListItem
                      post={post}
                      onSelect={() => handleEditClick(post)}
                      isManagement
                      onToggleActive={handleToggleActive}
                    />
                  </div>
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