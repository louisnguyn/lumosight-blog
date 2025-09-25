import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaHeart, FaArrowUp } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-5 h-5" />
        </button>
      )}

      <footer className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="col-span-2 lg:col-span-1">
              <Link to="/" className="flex items-center mb-4 group">
                <img 
                  src="/Lumosight_logo.png" 
                  alt="Lumosight Logo" 
                  className="h-20 w-auto group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <p className="text-blue-100 dark:text-gray-300 mb-6 leading-relaxed">
                Discover amazing stories, share your thoughts, and connect with a community of passionate writers.
              </p>
              <div className="flex space-x-4">
                <Link 
                  to="/" 
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 group"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
                </Link>
                {/* <Link 
                  to="/" 
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 group"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
                </Link> */}
                <Link 
                  to="/" 
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 group"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
                </Link>
                {/* <Link 
                  to="/" 
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 group"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
                </Link>
                <Link 
                  to="/" 
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 group"
                  aria-label="GitHub"
                >
                  <FaGithub className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
                </Link> */}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-yellow-400">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/blog" 
                    className="text-blue-100 hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/our-story" 
                    className="text-blue-100 hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Our Story
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/post-management" 
                    className="text-blue-100 hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Post Management
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="text-blue-100 hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/signup" 
                    className="text-blue-100 hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-yellow-400">Support</h3>
              <ul className="space-y-3">
                {/* <li>
                  <Link 
                    to="/user-info" 
                    className="text-blue-100 hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    User Information
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/change-password" 
                    className="text-blue-100 hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Change Password
                  </Link>
                </li> */}
                <li>
                  <Link 
                    to="/contact" 
                    className="text-blue-100 hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy" 
                    className="text-blue-100 hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="col-span-2 lg:col-span-1">
              <h3 className="text-xl font-bold mb-6 text-yellow-400">Stay Updated</h3>
              <p className="text-blue-100 dark:text-gray-300 mb-4">
                Subscribe to our newsletter for the latest posts and updates.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                />
                <button className="w-full px-6 py-2 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-blue-200 mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/20 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center text-blue-100 dark:text-gray-300 mb-4 md:mb-0">
                <span className="mr-2">Made with</span>
                <FaHeart className="text-red-400 animate-pulse mx-1" />
                <span className="ml-2">by the Louis Nguyen</span>
              </div>
              <div className="text-blue-100 dark:text-gray-300 text-sm">
                &copy; {new Date().getFullYear()} Lumosight. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}