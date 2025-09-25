import { useState } from "react";
import { supabase } from "../../db/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../../ThemeProvider";
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    const userId = data?.user?.id;
    if (userId) {
      const { error: profileError } = await supabase
        .from("profile")
        .insert([{ user_id: userId, full_name: fullName, email }]);
      if (profileError) {
        setError(profileError.message);
        return;
      }
    }
    navigate("/login");
  };
  const { theme } = useTheme();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm mx-auto p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col gap-6"
      >
        <div className="flex flex-col items-center">
          <Link to="/">
          {theme === "dark" ? (
              <img src="/Lumosight_logo.png" className="h-50" alt="Logo" />
            ) : (
              <img src="/Lumosight_logo.png" className="h-50" alt="Logo" />
            )}
          </Link>
          <h2 className="text-3xl font-bold text-blue-600 dark:text-white mb-2">Sign Up</h2>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="fullName" className="font-semibold text-gray-700 dark:text-white">Full Name</label>
          <input
            id="fullName"
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-semibold text-gray-700 dark:text-white">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-semibold text-gray-700 dark:text-white">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
            required
          />
        </div>
        <div className="text-xs text-gray-500 text-center mt-4">
          By signing up, you agree to our{" "}
          <Link to="/privacy" className="text-blue-600 hover:underline font-semibold">
            Privacy Policy
          </Link>
          . Your information will be securely stored and never shared with third parties without your consent.
        </div>
        {error && <div className="text-red-500 text-center font-medium">{error}</div>}
        <button
          type="submit"
          className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <div className="text-center text-gray-600 dark:text-gray-300 mt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
}