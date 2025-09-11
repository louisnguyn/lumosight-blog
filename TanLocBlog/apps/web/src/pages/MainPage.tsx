import { supabase } from '../db/supabaseClient';
import { useEffect, useState } from 'react';
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
// import SideBar from "../components/SideBar/SideBar"
function MainPage() {
  const [status, setStatus] = useState('Connecting...');
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => {
    async function fetchPosts() {
      setStatus('Loading...');
      const { data, error } = await supabase.from('posts').select('*');
      if (error) {
        setStatus(`Error: ${error.message}`);
        setPosts([]);
      } else {
        setPosts(data ?? []);
        setStatus('Loaded');
      }
    }
    fetchPosts();
  }, []);

  return (
    <>  
        <Header/>
            <main className="dark:text-white">
                <h1 className="text-2xl font-bold">Supabase Connection Status</h1>
                <p className="text-lg">{status}</p>
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded mt-4 overflow-x-auto">
                    {JSON.stringify(posts, null, 2)}
                </pre>
            </main>
        <Footer/>
    </>
  )
}

export default MainPage