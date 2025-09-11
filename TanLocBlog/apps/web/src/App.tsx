import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';

function App() {
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
      <h1>Supabase Connection Status</h1>
      <p>{status}</p>
      {/* ...existing code... */}
    </main>
  )
}

export default App
