import { supabase } from '../db/supabaseClient';
import { useEffect, useState } from 'react';
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import SideBar from "../components/Sidebar/SideBar";
import BlogList from "../components/Blog/BlogList";
import Detail from "../components/Blog/Detail";
import SearchBar from "../components/SearchBar/SearchBar";
function MainPage() {
  const [status, setStatus] = useState('Connecting...');
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts(filter?: { category?: string, tag?: string, search?: string }) {
    setStatus('Loading...');
    let query = supabase.from('posts').select('*').eq('active', true);
    if (filter?.category) {
      query = query.eq('categories', filter.category);
    }
    if (filter?.tag) {
      query = query.ilike('tags', `%${filter.tag}%`);
    }
    if (filter?.search) {
      query = query.or(`title.ilike.%${filter.search}%,content.ilike.%${filter.search}%`);
    }
    const { data, error } = await query;
    if (error) {
      setStatus(`Error: ${error.message}`);
      setPosts([]);
    } else {
      setPosts(data ?? []);
      setStatus('Loaded');
    }
    setSelectedPost(null);
  }
  const handleHeaderSearch = (search?: string) => {
    fetchPosts({ search });
  };
  const handleSelectPost = (post: any) => {
    setSelectedPost(post);
  };
  const handleBackToList = () => {
    setSelectedPost(null);
  };
  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleHeaderSearch} />
      <div className="flex flex-row flex-1 lg:px-50">
        <SideBar onFilter={fetchPosts} />
        <main className=" lg:w-4/5 sm:w-2/3 p-6 dark:text-white">
          <div className="block lg:hidden mb-4">
            <SearchBar
              value={search}
              onChange={val => {
                setSearch(val);
                handleHeaderSearch(val);
              }}
            />
          </div>
          {/* <h1 className="text-2xl font-bold">Supabase Connection Status</h1>
          <p className="text-lg">{status}</p> */}
          {selectedPost ? (
            <Detail post={selectedPost} onBack={handleBackToList} />
          ) : (
            <BlogList posts={posts} onSelect={handleSelectPost} />
          )}
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default MainPage