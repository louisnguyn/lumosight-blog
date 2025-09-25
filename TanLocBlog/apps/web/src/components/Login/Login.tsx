import { useState } from "react";
import { supabase } from "../../db/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../ThemeProvider";
import "./Login.css";
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
  const { theme } = useTheme();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/20 rounded-full animate-float"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-white/20 rounded-full animate-float animation-delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-yellow-400/30 rounded-full animate-float animation-delay-2000"></div>
      <div className="absolute bottom-40 right-1/3 w-20 h-20 bg-white/15 rounded-full animate-float animation-delay-3000"></div>
      
      <div className="relative z-10 w-full max-w-md mx-auto p-8">
        <form
          onSubmit={handleLogin}
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 flex flex-col gap-6 border border-white/20 dark:border-gray-700/50"
        >
        <div className="flex flex-col items-center animate-fade-in-up">
          <Link to="/" className="group">
            {theme === "dark" ? (
              <img src="/Lumosight_logo.png" className="h-16 w-auto group-hover:scale-105 transition-transform duration-300" alt="Logo" />
            ) : (
              <img src="/Lumosight_logo.png" className="h-16 w-auto group-hover:scale-105 transition-transform duration-300" alt="Logo" />
            )}
          </Link>
          <h2 className="text-3xl font-bold text-blue-600 dark:text-white mb-2 mt-4">Welcome Back</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">Sign in to your account</p>
        </div>
        <div className="flex flex-col gap-2 animate-fade-in-up animation-delay-200">
          <label htmlFor="email" className="font-semibold text-gray-700 dark:text-white">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-300 hover:border-blue-400"
            required
          />
        </div>
        <div className="flex flex-col gap-2 animate-fade-in-up animation-delay-400">
          <label htmlFor="password" className="font-semibold text-gray-700 dark:text-white">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white transition-all duration-300 hover:border-blue-400"
            required
          />
        </div>
        {error && <div className="text-red-500 text-center font-medium animate-fade-in-up">{error}</div>}
        <button
          type="submit"
          className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed animate-fade-in-up animation-delay-600"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Logging in...
            </div>
          ) : (
            "Sign In"
          )}
        </button>
        <div className="text-center text-gray-600 dark:text-gray-300 mt-2 animate-fade-in-up animation-delay-800">
          Haven't got an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:text-purple-600 hover:underline font-semibold transition-colors duration-300">
            Register here
          </Link>
        </div>
        </form>
      </div>
    </div>
  );
}