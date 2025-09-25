import { useNavigate } from "react-router-dom";
import { supabase } from '../db/supabaseClient';
import { useEffect, useState } from 'react';
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import SideBar from "../components/Sidebar/SideBar";
import BlogList from "../components/Blog/BlogList";
import SearchBar from "../components/SearchBar/SearchBar";
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';
import "./BlogPage.css";
function MainPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts(filter?: { category?: string, tag?: string, search?: string }) {
    let query = supabase.from('posts').select('*').eq('active', true);
    if (filter?.category) query = query.ilike('categories', filter.category.toLowerCase());
    if (filter?.tag) query = query.ilike('tags', `%${filter.tag.toLowerCase()}%`);
    if (filter?.search) query = query.or(`title.ilike.%${filter.search}%,content.ilike.%${filter.search}%`);
    const { data, error } = await query;
    setPosts(error ? [] : data ?? []);
  }

  const handleHeaderSearch = (search?: string) => {
    fetchPosts({ search });
  };

  const handleSelectPost = async (post: any) => {
    await supabase
      .from("posts")
      .update({ views: (post.views ?? 0) + 1 })
      .eq("id", post.id);
    navigate(`/post/${post.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-white py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-up">
              Discover Amazing Stories
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Explore our collection of inspiring blog posts and discover new perspectives
            </p>
            <div className="max-w-md mx-auto animate-fade-in-up animation-delay-400">
              <SearchBar
                value={search}
                onChange={val => {
                  setSearch(val);
                  handleHeaderSearch(val);
                }}
                className="w-full"
                placeholder="Search articles, topics, or authors..."
              />
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/20 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-yellow-400/30 rounded-full animate-float animation-delay-2000"></div>
      </section>

      <div className="flex flex-row flex-1 relative max-w-7xl mx-auto w-full">
         <button
          className="lg:hidden absolute top-6 right-4 z-40 p-3 rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300"
          onClick={() => setSidebarOpen(open => !open)}
          aria-label="Toggle sidebar"
        >
          <span className={sidebarOpen ? " block rotate-[360deg] transition-transform duration-500" : " block rotate-0 transition-transform duration-500"}>
            {sidebarOpen ? <AiOutlineClose className="w-5 h-5" /> : <GiHamburgerMenu className="w-5 h-5" />}
          </span>
        </button>
          <div
            className={`${
              sidebarOpen ? "absolute top-0 left-0 z-30 bg-white dark:bg-gray-900 w-full h-full opacity-100 translate-x-0 shadow-2xl" 
              : "hidden"
            } lg:static lg:block lg:opacity-100 lg:translate-x-0 transition-all duration-500 ease-in-out`}
          >
          <SideBar onFilter={fetchPosts} onItemClick={() => setSidebarOpen(false)} />
        </div> 
        <main className="lg:w-4/5 sm:w-full md:w-full p-6 dark:text-white">
          <div className="mb-8">
            <div className="flex flex-col items-left mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {search ? `Search Results (${posts.length})` : 'Latest Articles'}
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {posts.length} {posts.length === 1 ? 'article' : 'articles'} found
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <BlogList posts={posts} onSelect={handleSelectPost} />
          </div>
        </main>
      </div>
      <Footer />
      
    </div>
  );
}

export default MainPage;