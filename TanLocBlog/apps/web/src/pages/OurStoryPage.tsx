import { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { FaLightbulb, FaUsers, FaRocket, FaHeart, FaGlobe, FaCode, FaBookOpen, FaComments, FaTrophy } from "react-icons/fa";

export default function OurStoryPage() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-white py-16 sm:py-24">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="text-center">
                        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            Our Story
                        </h1>
                        <p className={`text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            Illuminating minds, inspiring change, and building a community where every voice matters
                        </p>
                    </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-float"></div>
                <div className="absolute top-40 right-20 w-16 h-16 bg-white/20 rounded-full animate-float animation-delay-1000"></div>
                <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-yellow-400/30 rounded-full animate-float animation-delay-2000"></div>
            </section>

            {/* The Beginning */}
            <section className="py-16 bg-white dark:bg-gray-800">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                                The Spark That Started It All
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                                Lumosight was born from a simple yet powerful idea: what if we could create a platform where 
                                every story matters, every voice is heard, and every perspective adds value to our collective understanding?
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                In a world overflowing with information, we saw the need for a space that prioritizes quality, 
                                authenticity, and meaningful connections over viral content and empty metrics.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <FaLightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Innovation</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Thinking beyond conventional boundaries</p>
                                </div>
                            </div>
                        </div>
                        <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaBookOpen className="w-12 h-12 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">2025</h3>
                                    <p className="text-gray-600 dark:text-gray-300">The year Lumosight came to life</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Mission */}
            <section className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            Our Mission & Values
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            We're not just another blogging platform. We're a movement dedicated to elevating discourse, 
                            fostering creativity, and building bridges between diverse perspectives.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-2xl flex items-center justify-center mb-6">
                                <FaUsers className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Community First</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                We believe that the best ideas emerge from diverse communities where everyone feels welcome to share their unique perspectives.
                            </p>
                        </div>

                        <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-2xl flex items-center justify-center mb-6">
                                <FaRocket className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Innovation</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                We're constantly pushing the boundaries of what's possible, exploring new ways to enhance the writing and reading experience.
                            </p>
                        </div>

                        <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-2xl flex items-center justify-center mb-6">
                                <FaHeart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Authenticity</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                We champion genuine voices and authentic stories, creating a space where vulnerability and honesty are celebrated.
                            </p>
                        </div>

                        <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '800ms' }}>
                            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-2xl flex items-center justify-center mb-6">
                                <FaGlobe className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Global Reach</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Our platform connects writers and readers from around the world, breaking down barriers and building understanding.
                            </p>
                        </div>

                        <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '1000ms' }}>
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-2xl flex items-center justify-center mb-6">
                                <FaCode className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Technology</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                We leverage cutting-edge technology to create seamless, intuitive experiences that enhance rather than distract from content.
                            </p>
                        </div>

                        <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '1200ms' }}>
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center mb-6">
                                <FaComments className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Engagement</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                We foster meaningful conversations and connections through thoughtful commenting and community interaction features.
                            </p>
                        </div>
                    </div>
                </div>
            </section>


            {/* The Future */}
            <section className="py-16 bg-gradient-to-tl from-blue-600 via-blue-700 to-purple-800 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-white">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                        The Future We're Building
                    </h2>
                    <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
                        We're just getting started. Our vision extends far beyond today, as we work to create 
                        the most inclusive, innovative, and inspiring platform for writers and readers worldwide.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                            <FaRocket className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-3">AI-Powered Features</h3>
                            <p className="text-blue-100">
                                Intelligent content recommendations, writing assistance, and personalized reading experiences.
                            </p>
                        </div>
                    
                        
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
                            <FaUsers className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-3">Community Growth</h3>
                            <p className="text-blue-100">
                                Enhanced collaboration tools and community-driven features for deeper connections.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-4xl mx-auto">
                        <h3 className="text-2xl font-bold mb-4">Join Our Journey</h3>
                        <p className="text-lg text-blue-100 mb-6">
                            Whether you're a seasoned writer, an aspiring author, or someone who simply loves great stories, 
                            there's a place for you in our community. Together, we're not just sharing content—we're 
                            building the future of digital storytelling.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href="/blog" 
                                className="px-8 py-4 bg-yellow-400 text-blue-900 font-bold rounded-xl hover:bg-yellow-300 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Start Reading
                            </a>
                            <a 
                                href="/signup" 
                                className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-blue-900 hover:scale-105 active:scale-95 transition-all duration-300"
                            >
                                Join Our Community
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}