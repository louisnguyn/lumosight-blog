import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../db/supabaseClient";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import BlogListItem from "../components/Blog/BlogListItem";
import { FaEye, FaHeart, FaUser, FaEnvelope } from 'react-icons/fa';
import { BiArrowBack } from 'react-icons/bi';
import { BsFilePost } from 'react-icons/bs';
import "./UserPostsPage.css";

export default function UserPostsPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      if (!userId) {
        setError("User ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data: profileData, error: profileError } = await supabase
          .from("profile")
          .select("user_id, full_name, email, avatar_url, bio, phone, created_at")
          .eq("user_id", userId)
          .single();

        if (profileError) {
          setError("User not found");
          setLoading(false);
          return;
        }

        setUserProfile(profileData);
        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .eq("author_id", userId)
          .eq("active", true)
          .order("created_at", { ascending: false });

        if (postsError) {
          console.error("Error fetching posts:", postsError);
        } else {
          setUserPosts(postsData || []);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading user profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">User Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "The user you're looking for doesn't exist."}</p>
            <button
              onClick={() => navigate("/blog")}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              <BiArrowBack className="mr-2" />
              Back to Blog
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const totalViews = userPosts.reduce((sum, post) => sum + (post.views || 0), 0);
  const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
    
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-white py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <button 
            onClick={() => navigate("/blog")} 
            className="mb-8 inline-flex items-center px-6 py-3 bg-white/30 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/50 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
          >
            <BiArrowBack className="mr-2 w-5 h-5" />
            Back to Blog
          </button>
          
          <div className="text-center">
            <div className="mb-6">
              <img
                src={userProfile.avatar_url || "/profile.jpeg"}
                alt={userProfile.full_name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white/30 mx-auto shadow-2xl"
              />
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-up">
              {userProfile.full_name}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-blue-100 animate-fade-in-up animation-delay-200">
              {userProfile.email && (
                <div className="flex items-center gap-2">
                  <FaEnvelope className="w-4 h-4 profile-info-icon" />
                  <span className="text-lg">{userProfile.email}</span>
                </div>
              )}
              {userProfile.phone && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 profile-info-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-lg">{userProfile.phone}</span>
                </div>
              )}
              {userProfile.created_at && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 profile-info-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg">Joined {new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-blue-100 animate-fade-in-up animation-delay-400">
              <div className="flex items-center gap-2">
                <BsFilePost className="w-5 h-5" />
                <span className="text-lg font-semibold">{userPosts.length} Posts</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEye className="w-5 h-5" />
                <span className="text-lg font-semibold">{totalViews.toLocaleString()} Views</span>
              </div>
              <div className="flex items-center gap-2">
                <FaHeart className="w-5 h-5" />
                <span className="text-lg font-semibold">{totalLikes.toLocaleString()} Likes</span>
              </div>
            </div>
            {userProfile.bio && (
              <div className="mt-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
                <div className="bio-section rounded-2xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-3 text-center">About {userProfile.full_name}</h3>
                  <p className="text-blue-100 text-center leading-relaxed">
                    {userProfile.bio}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white/20 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-yellow-400/30 rounded-full animate-float animation-delay-2000"></div>
      </section>

      <div className="max-w-7xl mx-auto w-full px-4 py-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {userProfile.full_name}'s Posts
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {userPosts.length === 0 
              ? "No posts published yet." 
              : `Discover ${userPosts.length} ${userPosts.length === 1 ? 'post' : 'posts'} by ${userProfile.full_name}`
            }
          </p>
        </div>

        {userPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Posts Yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {userProfile.full_name} hasn't published any posts yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {userPosts.map((post) => (
              <BlogListItem
                key={post.id}
                post={post}
                onSelect={() => navigate(`/post/${post.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
