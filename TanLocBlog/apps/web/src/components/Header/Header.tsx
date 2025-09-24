import { NavLink, Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { useTheme } from "../../ThemeProvider";
import { supabase } from "../../db/supabaseClient";
import SearchBar from "../SearchBar/SearchBar";
import { FaUser } from 'react-icons/fa';
import { CgPassword } from 'react-icons/cg';
import { FaUserEdit } from 'react-icons/fa';
import { IoDocumentText } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import { useNavigate } from "react-router-dom";
export default function Header({ onSearch }: { onSearch?: (search?: string) => void }) {
    const [search, setSearch] = useState("");
    const { theme, toggleTheme } = useTheme();
    const [user, setUser] = useState<any>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [profileAvatar, setProfileAvatar] = useState<string>("");
    const navigate = useNavigate();
    const [profileName, setProfileName] = useState<string>("");
    useEffect(() => {
        supabase.auth.getUser().then(async ({ data }) => {
            setUser(data?.user ?? null);
            if (data?.user?.id) {
                const { data: profile, error } = await supabase
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
        <header className="w-full bg-blue-600 dark:bg-gray-900 text-white py-4 px-6 flex items-center justify-between">
            <div>
                <NavLink to="/">
                    { theme === "light" ? (
                        <img src="/Lumosight_logo_black.png" className="h-25" />
                    ) : (
                        <img src="/Lumosight_logo.png" className="h-25" />
                    )}
                </NavLink>
            </div>
            {typeof onSearch === "function" && (
            <div className="hidden lg:block">
                <SearchBar
                value={search}
                onChange={val => {
                    setSearch(val);
                    onSearch(val);
                }}
                />
            </div>
            )}
            <nav className="flex items-center justify-center relative">
                {!user ? (
                    <NavLink to="/login" className="ml-4 px-4 py-2 rounded bg-white text-blue-600 font-semibold shadow hover:bg-blue-100 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-900">Login</NavLink>
                ) : (
                    <div className=" inline-block relative">
                        <button
                            onClick={() => setDropdownOpen((open) => !open)}
                            className="px-4 py-2 rounded bg-white dark:bg-gray-700 dark:text-white text-black cursor-pointer min-w-[220px] flex items-center justify-left "
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
                                <button
                                className=" w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-left"
                                onClick={() => {
                                    // TODO: navigate to post management page
                                    navigate("/post-management");
                                    setDropdownOpen(false);
                                }}
                                >
                                    <span  className="mr-5 ml-2"><IoDocumentText/></span>
                                Post Management
                                </button>
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
        </header>
    );
}