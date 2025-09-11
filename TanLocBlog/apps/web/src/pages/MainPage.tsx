import { supabase } from '../db/supabaseClient';
import { useEffect, useState } from 'react';
import Header from "../components/Header/Header"
function MainPage() {
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    supabase.from('test_table').select('*').limit(1)
      .then(({ error }) => {
        if (error) setStatus(`Connection failed: ${error.message}`);
        else setStatus('Connected!');
      });
  }, []);

  return (
    <main>
      <Header/>
      <h1 className="text-2xl font-bold">Supabase Connection Status</h1>
      <p className="text-lg">{status}</p>
      {/* ...existing code... */}
    </main>
  )
}

export default MainPage