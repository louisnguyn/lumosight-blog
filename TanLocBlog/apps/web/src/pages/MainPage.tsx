import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { supabase } from "../db/supabaseClient";
import { FaArrowRight, FaCalendarAlt, FaEye, FaHeart } from "react-icons/fa";
import "./MainPage.css";
import { BsFilePost } from 'react-icons/bs';
interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id: string;
  author_name?: string;
  author_avatar?: string;
  profile_slug?: string;
  posts_slug?: string;
  views?: number;
  likes?: number;
  comments_count?: number;
}

interface TopAuthor {
  author_id: string;
  author_name: string;
  author_avatar: string;
  profile_slug?: string;
  posts_count: number;
  total_views: number;
}

function MainPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [topAuthors, setTopAuthors] = useState<TopAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentPosts();
    fetchTopAuthors();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (postsError) throw postsError;

      const authorIds = [...new Set(postsData?.map(post => post.author_id) || [])];
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profile')
        .select('user_id, full_name, avatar_url, profile_slug')
        .in('user_id', authorIds);

      if (profilesError) throw profilesError;

      const profilesMap = profilesData?.reduce((acc: any, profile: any) => {
        acc[profile.user_id] = profile;
        return acc;
      }, {}) || {};

      const postsWithAuthors = postsData?.map(post => ({
        ...post,
        author_name: profilesMap[post.author_id]?.full_name || 'Unknown Author',
        author_avatar: profilesMap[post.author_id]?.avatar_url || '/profile.jpeg',
        profile_slug: profilesMap[post.author_id]?.profile_slug
      })) || [];

      setPosts(postsWithAuthors);
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    }
  };

  const fetchTopAuthors = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('author_id, views')
        .eq('active', true);

      if (postsError) throw postsError;

      const authorIds = [...new Set(postsData?.map(post => post.author_id) || [])];
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profile')
        .select('user_id, full_name, avatar_url, profile_slug')
        .in('user_id', authorIds);

      if (profilesError) throw profilesError;

      const profilesMap = profilesData?.reduce((acc: any, profile: any) => {
        acc[profile.user_id] = profile;
        return acc;
      }, {}) || {};

      const authorStats = postsData?.reduce((acc: any, post: any) => {
        const authorId = post.author_id;
        const profile = profilesMap[authorId];
        const authorName = profile?.full_name || 'Unknown Author';
        const authorAvatar = profile?.avatar_url || '/profile.jpeg';

        if (!acc[authorId]) {
          acc[authorId] = {
            author_id: authorId,
            author_name: authorName,
            author_avatar: authorAvatar,
            profile_slug: profile?.profile_slug,
            posts_count: 0,
            total_views: 0
          };
        }

        acc[authorId].posts_count += 1;
        acc[authorId].total_views += post.views || 0;
        return acc;
      }, {});

      const topAuthors = Object.values(authorStats || {})
        .sort((a: any, b: any) => {
          if (b.posts_count !== a.posts_count) {
            return b.posts_count - a.posts_count;
          }
          return b.total_views - a.total_views;
        })
        .slice(0, 3);

      setTopAuthors(topAuthors as TopAuthor[]);
    } catch (error) {
      console.error('Error fetching top authors:', error);
    } finally {
      setLoading(false);
    }
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const getContentPreview = (content: string, maxLength: number = 150) => {
    const strippedContent = stripHtmlTags(content);
    return strippedContent.length > maxLength 
      ? strippedContent.substring(0, maxLength) + '...'
      : strippedContent;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 animate-fade-in-up">
              Welcome to <span className="text-yellow-400">Lumosight</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
              Discover amazing stories, share your thoughts, and connect with a community of passionate writers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Link 
                to="/blog" 
                className="px-8 py-4 bg-yellow-400 text-blue-900 font-bold rounded-xl hover:bg-yellow-300 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore Blog
                <FaArrowRight className="inline-block ml-2" />
              </Link>
              <Link 
                to="/our-story" 
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-900 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/20 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-400/30 rounded-full animate-float animation-delay-2000"></div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Stories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the most recent posts from our amazing community of writers
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading posts...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <article 
                  key={post.id}
                  className="bg-white dark:bg-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-4">
                    <div className="flex items-center mb-4">
                      <img
                        src={post.author_avatar}
                        alt={post.author_name}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/user/${post.profile_slug || post.author_id}`);
                          }}
                          className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors duration-300 text-left"
                        >
                          {post.author_name}
                        </button>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {formatDate(post.created_at)}
                        </p>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {getContentPreview(post.content)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <FaEye className="mr-1" />
                          {post.views || 0}
                        </span>
                        <span className="flex items-center">
                          <FaHeart className="mr-1" />
                          {post.likes || 0}
                        </span>
                      </div>
                      <Link 
                        to={`/post/${post.posts_slug || post.id}`}
                        className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link 
              to="/blog"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              View All Posts
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Contributors Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Top Contributors
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Meet our most active writers who share amazing content with our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topAuthors.map((author, index) => (
              <div 
                key={author.author_id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 p-8 text-center group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative mb-6">
                  <img
                    src={author.author_avatar}
                    alt={author.author_name}
                    className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-blue-200 dark:border-blue-600 group-hover:border-blue-400 dark:group-hover:border-blue-400 transition-colors"
                  />
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(`/user/${author.profile_slug || author.author_id}`)}
                  className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors hover:underline"
                >
                  {author.author_name}
                </button>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
                    <BsFilePost className="mr-2" />
                    <span className="font-semibold">{author.posts_count} Posts</span>
                  </div>
                  <div className="flex items-center justify-center text-gray-600 dark:text-gray-300">
                    <FaEye className="mr-2" />
                    <span className="font-semibold">{author.total_views} Views</span>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(`/user/${author.profile_slug || author.author_id}`)}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  View Posts
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-tl from-blue-600 via-blue-700 to-purple-800 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Share Your Story?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of writers and start sharing your thoughts with the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/login"
              className="px-8 py-4 bg-yellow-400 text-blue-900 font-bold rounded-xl hover:bg-yellow-300 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link 
              to="/blog"
              className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-900 hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Explore Content
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default MainPage;