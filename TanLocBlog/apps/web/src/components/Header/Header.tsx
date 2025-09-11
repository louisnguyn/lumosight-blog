import { NavLink, Link } from "react-router-dom"
import { useState, useEffect } from "react";
import { useTheme } from "../../ThemeProvider";
import { supabase } from "../../db/supabaseClient";
import { FaSun } from 'react-icons/fa';
import { FaMoon } from 'react-icons/fa';
export default function Header({ onSearch }: { onSearch: (search?: string) => void }) {
    const [search, setSearch] = useState("");
    const { theme, toggleTheme } = useTheme();
    const [user, setUser] = useState<any>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        onSearch(e.target.value);
    };
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data?.user ?? null));
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => { listener?.subscription.unsubscribe(); };
    }, []);
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setDropdownOpen(false);
    };
    return (
        <header className="w-full bg-blue-600 dark:bg-gray-900 text-white py-4 px-6 flex items-center justify-between">
            <Link>
                { theme === "light" ? (
                    <img src="./logo_transparent.png" className="h-20" />
                ) : (
                    <img src="./logo.png" className="h-20" />
                )}
            </Link>
            <div>
                <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={handleSearchChange}
                className="px-3 py-2 rounded bg-white text-black focus:outline-none sm:w-60 lg:w-120"
                />
            </div>
            <nav className="flex items-center justify-center relative">
                <button
                onClick={toggleTheme}
                className="ml-4 px-3 py-3 rounded bg-gray-200 dark:bg-gray-700 dark:text-white text-black"
                >
                {theme === "dark" ? <FaSun /> : <FaMoon/>}
                </button>
                {!user ? (
                    <NavLink to="/login" className="ml-4 hover:underline">Login</NavLink>
                ) : (
                    <div className="ml-4 inline-block">
                        <button
                            onClick={() => setDropdownOpen((open) => !open)}
                            className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white text-black"
                        >
                            {user.user_metadata.full_name || user.email}
                        </button>
                        {dropdownOpen && (
                            <div className="absolute text-black right-6 mt-2 w-48 bg-white dark:bg-gray-800 rounded shadow-lg z-10">
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => {/* TODO: implement change password */ setDropdownOpen(false); }}
                                >
                                    Change Password
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => {/* TODO: implement change info */ setDropdownOpen(false); }}
                                >
                                    Change Information
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600"
                                    onClick={handleLogout}
                                >
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