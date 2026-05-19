import {useState,useEffect} from "react"
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { supabase } from '../db/supabaseClient';
import { CgSpinner } from 'react-icons/cg';
import { RiImageCircleAiLine } from 'react-icons/ri';
import { generateUniqueSlug } from '../utils/slugGenerator';
export default function UserInformationPage() {
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarPreviewLoading, setAvatarPreviewLoading] = useState(false);
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
          setEmail(data.email ?? (userData.user ? userData.user.email : "") ?? "");
        } else {
          setEmail(userData.user?.email ?? "");
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
    let avatarPublicUrl = avatarUrl;
    if (avatarFile) {
      const uploadedUrl = await uploadAvatar();
      if (!uploadedUrl) {
        setLoading(false);
        return;
      }
      avatarPublicUrl = uploadedUrl;
      setAvatarUrl(uploadedUrl); // update preview to public url
    }
    let updateData: any = {
      full_name: fullName,
      bio,
      avatar_url: avatarPublicUrl,
      phone,
    };
    
    // Generate slug if full name changed OR if profile doesn't have a slug yet
    if (fullName !== profile?.full_name || !profile?.profile_slug) {
      const { data: existingSlugs } = await supabase
        .from("profile")
        .select("profile_slug")
        .neq("user_id", userId);
      
      const slugList = existingSlugs?.map(p => p.profile_slug).filter(Boolean) || [];
      const finalSlug = await generateUniqueSlug(fullName, slugList);
      updateData.profile_slug = finalSlug;
    }
    
    const { error } = await supabase
      .from("profile")
      .update(updateData)
      .eq("user_id", userId);
    if (error) setError(error.message);
    else setSuccess("Profile updated successfully!");
    setLoading(false);
  };
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreviewLoading(true);
      setTimeout(() => {
        setAvatarUrl(URL.createObjectURL(file)); // Preview after 2s
        setAvatarPreviewLoading(false);
      }, 2000);
    }
  };
  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return avatarUrl;
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `avatar_${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from("image_upload") // use your bucket name
      .upload(filePath, avatarFile, { upsert: true });
    if (uploadError) {
      setError(uploadError.message);
      return null;
    }
    const { data } = supabase.storage
      .from("image_upload")
      .getPublicUrl(filePath);
    return data?.publicUrl ?? null;
  };
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      <div className="flex-1 max-w-xl mx-auto py-8 w-full mt-10">
        <h1 className="text-2xl font-bold mb-6 dark:text-white">User Information</h1>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
            <div className="mb-4 flex flex-col items-center">
              <input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
              {avatarPreviewLoading ? (
                <div className="flex justify-center items-center h-40 w-40">
                  <CgSpinner className="animate-spin text-4xl text-blue-600" />
                </div>
              ) : (
                <img
                  src={avatarUrl || "/profile.jpeg"}
                  alt="Avatar"
                  className="rounded-full w-40 h-40 object-cover mt-2 bg-gray-200"
                />
              )}
              <button
                type="button"
                className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 mb-2 mt-4"
                onClick={() => document.getElementById("avatar")?.click()}
              >
                <RiImageCircleAiLine className="inline mr-2 mb-1" /> Change Avatar
              </button>
            </div>
            <label htmlFor="email" className="block mb-1 font-semibold dark:text-white">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              disabled
              className="w-full mb-3 px-3 py-2 rounded border bg-gray-100 dark:bg-gray-700 dark:text-white cursor-not-allowed"
            />
            <label htmlFor="fullName" className="block mb-1 font-semibold dark:text-white">Full Name</label>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
              required
            />
            <label htmlFor="phone" className="block mb-1 font-semibold dark:text-white">Phone Number</label>
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded border bg-white dark:bg-gray-800 dark:text-white"
            />
            <label htmlFor="bio" className="block mb-1 font-semibold dark:text-white">Bio</label>
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