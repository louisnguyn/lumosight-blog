import { supabase } from '../db/supabaseClient';
import { useEffect, useState } from 'react';
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import SideBar from "../components/Sidebar/SideBar";
function MainPage() {
  const [status, setStatus] = useState('Connecting...');
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts(filter?: { category?: string, tag?: string, search?: string }) {
    setStatus('Loading...');
    let query = supabase.from('posts').select('*');
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
  }
  const handleHeaderSearch = (search?: string) => {
    fetchPosts({ search });
  };
  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={handleHeaderSearch} />
      <div className="flex flex-row flex-1">
        <SideBar onFilter={fetchPosts} />
        <main className=" lg:w-4/5 sm:w-2/3 p-6 dark:text-white">
          <h1 className="text-2xl font-bold">Supabase Connection Status</h1>
          <p className="text-lg">{status}</p>
          <pre className="p-4 rounded mt-4 overflow-x-auto">
            {JSON.stringify(posts, null, 2)}
          </pre>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default MainPage