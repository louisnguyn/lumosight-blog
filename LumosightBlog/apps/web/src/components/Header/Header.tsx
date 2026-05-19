import { Link, NavLink} from "react-router-dom"
import { useState, useEffect } from "react";
import { useTheme } from "../../ThemeProvider";
import { supabase } from "../../db/supabaseClient";
import { CgPassword } from 'react-icons/cg';
import { FaUserEdit } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
export default function Header() {
    const { theme } = useTheme();
    const [user, setUser] = useState<any>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileAvatar, setProfileAvatar] = useState<string>("");
    const navigate = useNavigate();
    const [profileName, setProfileName] = useState<string>("");
    useEffect(() => {
        supabase.auth.getUser().then(async ({ data }) => {
            setUser(data?.user ?? null);
            if (data?.user?.id) {
                const { data: profile } = await supabase
                    .from("profile")
                    .select("full_name, avatar_url")
                    .eq("user_id", data.user.id)
                    .single();
                if (profile && profile.full_name) {
                    setProfileName(profile.full_name);
                    setProfileAvatar(profile.avatar_url)
                } else {
                    setProfileName("unknown user");
                    setProfileAvatar("");
                }
            }
        });
    }, []);
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setDropdownOpen(false);
        navigate("/")
        window.location.reload();
    };
    return (
        <header className="w-full bg-gradient-to-tl from-blue-600 via-blue-700 to-purple-800 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 text-white">
            <div className="py-3 px-6 flex items-center justify-between">
                <div>
                    <NavLink 
                        to="/" 
                        className="block transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        { theme === "light" ? (
                            <img 
                                src="/Lumosight_logo_black_transparent.png" 
                                className="h-25 transition-all duration-200 hover:brightness-110 hover:drop-shadow-lg" 
                                alt="Lumosight Logo"
                            />
                        ) : (
                            <img 
                                src="/Lumosight_logo_word.png" 
                                className="h-25 transition-all duration-200 hover:brightness-110 hover:drop-shadow-lg" 
                                alt="Lumosight Logo"
                            />
                        )}
                    </NavLink>
                </div>
                <nav className="hidden sm:flex items-center space-x-8">
                    <NavLink 
                        to="/our-story" 
                        className={({ isActive }) => 
                            `px-4 py-4 rounded-lg font-medium transition-all duration-200 hover:bg-blue-500/20 hover:scale-105 active:scale-95 ${
                                isActive 
                                    ? 'text-yellow-400 dark:text-blue-200 bg-blue-500/30 shadow-md' 
                                    : 'text-white hover:text-blue-100'
                            }`
                        }
                    >
                        Our Story
                    </NavLink>
                    <NavLink 
                        to="/blog" 
                        className={({ isActive }) => 
                            `px-4 py-4 rounded-lg font-medium transition-all duration-200 hover:bg-blue-500/20 hover:scale-105 active:scale-95 ${
                                isActive 
                                    ? 'text-yellow-400 dark:text-blue-200 bg-blue-500/30 shadow-md' 
                                    : 'text-white hover:text-blue-100'
                            }`
                        }
                    >
                        Blog
                    </NavLink>
                    {user ? (
                        <NavLink 
                            to="/post-management"
                            className={({ isActive }) => 
                                `px-4 py-4 rounded-lg font-medium transition-all duration-200 hover:bg-blue-500/20 hover:scale-105 active:scale-95 ${
                                    isActive 
                                        ? 'text-yellow-400 dark:text-blue-200 bg-blue-500/30 shadow-md' 
                                        : 'text-white hover:text-blue-100'
                                }`
                            }
                        >
                            Posts
                        </NavLink>
                    ) : (
                        <Link 
                            to="/login"
                            className="px-4 py-4 rounded-lg font-medium transition-all duration-200 hover:bg-blue-500/20 hover:scale-105 active:scale-95 text-white hover:text-blue-100"
                        >
                            Posts
                        </Link>
                    )}
                </nav>
                
                <nav className="flex items-center justify-center relative">
                {!user ? (
                    <NavLink 
                        to="/login" 
                        className="ml-4 px-6 py-2.5 rounded-lg bg-white text-blue-600 font-semibold shadow-md hover:shadow-lg hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:hover:shadow-gray-900/50"
                    >
                        Login
                    </NavLink>
                ) : (
                    <div className=" inline-block relative">
                        <button
                            onClick={() => setDropdownOpen((open) => !open)}
                            className="px-4 py-2.5 rounded-lg bg-white dark:bg-gray-700 dark:text-white text-black cursor-pointer min-w-[200px] flex items-center justify-left shadow-md hover:shadow-lg hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200 dark:hover:bg-gray-600 dark:hover:shadow-gray-900/50"
                        >
                            {profileAvatar ? (
                                <img
                                    src={profileAvatar}
                                    alt="Avatar"
                                    className="w-8 h-8 rounded-full object-cover mr-3"
                                />
                            ) : (
                                <img
                                    src="/profile.jpeg"
                                    alt="Avatar"
                                    className="w-8 h-8 rounded-full object-cover mr-3"
                                />
                            )}
                            <span>{profileName}</span>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute left-0 bottom-0 translate-y-full w-full dark:text-white text-black right-6 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-lg z-10">
                                <button
                                    className=" w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-left "
                                    onClick={() => {navigate("/change-password"); setDropdownOpen(false); }}
                                >
                                    <span  className="mr-5 ml-2"><CgPassword/></span>
                                    <span>Change Password</span>
                                </button>
                                <button
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-left"
                                    onClick={() => { navigate("/user-info"); setDropdownOpen(false); }}
                                >
                                    <span  className="mr-5 ml-2"><FaUserEdit/></span>
                                    User Information
                                </button>
                                {/* <button
                                className=" w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-left"
                                onClick={() => {
                                    // TODO: navigate to post management page
                                    navigate("/post-management");
                                    setDropdownOpen(false);
                                }}
                                >
                                    <span  className="mr-5 ml-2"><IoDocumentText/></span>
                                Post Management
                                </button> */}
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center justify-left"
                                    onClick={handleLogout}
                                >
                                    <span className="mr-5 ml-2"><MdLogout/></span>
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                )}
                </nav>
            </div>
            <nav className="sm:hidden border-t border-blue-500/30 dark:border-gray-700/50">
                <div className="flex items-center justify-around py-4 px-4">
                    <NavLink 
                        to="/our-story" 
                        className={({ isActive }) => 
                            `flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                                isActive 
                                    ? 'text-blue-200 bg-blue-500/30 shadow-lg shadow-blue-500/20' 
                                    : 'text-white hover:text-blue-100 hover:bg-blue-500/20'
                            }`
                        }
                    >
                        <span className="text-xs font-semibold">Our Story</span>
                    </NavLink>
                    <NavLink 
                        to="/blog" 
                        className={({ isActive }) => 
                            `flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                                isActive 
                                    ? 'text-blue-200 bg-blue-500/30 shadow-lg shadow-blue-500/20' 
                                    : 'text-white hover:text-blue-100 hover:bg-blue-500/20'
                            }`
                        }
                    >
                        <span className="text-xs font-semibold">Blog</span>
                    </NavLink>
                    {user ? (
                        <NavLink 
                            to="/post-management"
                            className={({ isActive }) => 
                                `flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
                                    isActive 
                                        ? 'text-blue-200 bg-blue-500/30 shadow-lg shadow-blue-500/20' 
                                        : 'text-white hover:text-blue-100 hover:bg-blue-500/20'
                                }`
                            }
                        >
                            <span className="text-xs font-semibold">Posts</span>
                        </NavLink>
                    ) : (
                        <Link 
                            to="/login"
                            className="flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-white hover:text-blue-100 hover:bg-blue-500/20"
                        >
                            <span className="text-xs font-semibold">Posts</span>
                        </Link>
                    )}
                </div>
            </nav>
        </header>
    );
}