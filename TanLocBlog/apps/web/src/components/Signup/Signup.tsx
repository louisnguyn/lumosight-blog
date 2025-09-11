import { useState } from "react";
import { supabase } from "../../db/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate("/login"); // Redirect to login after successful signup
    }
  };

  return (
    <form onSubmit={handleSignup} className="max-w-sm mx-auto mt-12 p-6 bg-gray-100 dark:bg-gray-900 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
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
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      <div>Already have an account? <Link to="/login">Login here</Link></div>
    </form>
  );
}