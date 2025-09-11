import { useState } from "react";
import { supabase } from "../../db/supabaseClient";
import { useNavigate,Link } from "react-router-dom";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setLoading(false);
        if (error) {
        setError(error.message);
        } else {
        navigate("/");
        }
    };

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-12 p-6 bg-gray-100 dark:bg-gray-900 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded bg-white dark:bg-gray-800 dark:text-white border"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-3 px-3 py-2 rounded bg-white dark:bg-gray-800 dark:text-white border"
        required
      />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        type="submit"
        className="w-full px-3 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
      <div> Haven't not an account? <Link to="/signup">Register here</Link></div>
    </form>
  );
}