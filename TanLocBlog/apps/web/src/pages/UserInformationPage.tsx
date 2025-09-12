import {useState,useEffect} from "react"
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { supabase } from '../db/supabaseClient';
export default function UserInformationPage() {
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (userId) {
        const { data, error } = await supabase
          .from("profile")
          .select("*")
          .eq("user_id", userId)
          .single();
        if (data) {
          setProfile(data);
          setFullName(data.full_name ?? "");
          setBio(data.bio ?? "");
          setAvatarUrl(data.avatar_url ?? "");
          setPhone(data.phone ?? "");
          setEmail(data.email ?? userData.user.email ?? "");
        } else {
          setEmail(userData.user.email ?? "");
        }
        if (error) setError(error.message);
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    const { error } = await supabase
      .from("profile")
      .update({
        full_name: fullName,
        bio,
        avatar_url: avatarUrl,
        phone,
      })
      .eq("user_id", userId);
    if (error) setError(error.message);
    else setSuccess("Profile updated successfully!");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      <div className="flex-1 max-w-xl mx-auto py-8 w-full">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">User Information</h1>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
            <div className="mb-4 flex flex-col items-center">
              <img
                src={avatarUrl || "/profile.jpeg"}
                alt="Avatar"
                className="rounded-full w-24 h-24 object-cover mb-2 bg-gray-200"
              />
              <input
                type="text"
                placeholder="Avatar URL"
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
                className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              disabled
              className="w-full mb-3 px-3 py-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white cursor-not-allowed"
            />
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
            />
            <textarea
              placeholder="Bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
              rows={4}
            />
            {error && <div className="text-red-500 mb-2">{error}</div>}
            {success && <div className="text-green-500 mb-2">{success}</div>}
            <div className="flex gap-4 justify-center">
              <button
                type="submit"
                className="flex px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 justify-center"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
      <Footer/>
    </div>
  );
}