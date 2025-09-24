import { useNavigate } from "react-router-dom";
import { supabase } from '../db/supabaseClient';
import { useEffect, useState } from 'react';
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import SideBar from "../components/Sidebar/SideBar";
import BlogList from "../components/Blog/BlogList";
import Detail from "../components/Blog/Detail";
import SearchBar from "../components/SearchBar/SearchBar";
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';

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
    if (filter?.category) query = query.eq('categories', filter.category);
    if (filter?.tag) query = query.ilike('tags', `%${filter.tag}%`);
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
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleHeaderSearch} />
      <div className="flex flex-row flex-1 relative max-w-7xl mx-auto w-full">
         <button
          className="lg:hidden absolute top-6 right-4 z-40 p-2 rounded bg-blue-600 text-white"
          onClick={() => setSidebarOpen(open => !open)}
          aria-label="Toggle sidebar"
        >
          <span className={sidebarOpen ? " block rotate-[360deg] transition-transform duration-500" : " block rotate-0 transition-transform duration-500"}>
            {sidebarOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
          </span>
        </button>
          <div
            className={`${
              sidebarOpen ? "absolute top-0 left-0 z-30 bg-white dark:bg-gray-900 w-full h-full opacity-100 translate-x-0" 
              : "hidden"
            } lg:static lg:block lg:opacity-100 lg:translate-x-0 transition-all duration-500 ease-in-out`}
          >
          <SideBar onFilter={fetchPosts} onItemClick={() => setSidebarOpen(false)} />
        </div> 
        <main className=" lg:w-4/5 sm:w-full md:w-full p-6 dark:text-white">
          <div className="flex justify-center lg:hidden mb-4">
            <SearchBar
              value={search}
              onChange={val => {
                setSearch(val);
                handleHeaderSearch(val);
              }}
            />
          </div>
          <BlogList posts={posts} onSelect={handleSelectPost} />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default MainPage;