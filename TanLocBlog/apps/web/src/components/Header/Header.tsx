import { NavLink } from "react-router-dom"
import { useState, useEffect } from "react";
import { useTheme } from "../../ThemeProvider";
export default function Header() {
    const [search, setSearch] = useState("");
    const { theme, toggleTheme } = useTheme();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    return (
        <header className="w-full bg-blue-600 dark:bg-gray-900 text-white py-4 px-6 flex items-center justify-between">
            <h1 className="text-xl font-bold">TanLoc Blog Logo Here</h1>
            <div>
                <input
                type="text"
                placeholder="Search posts..."
                value={search}
                onChange={handleSearchChange}
                className="px-3 py-2 rounded bg-white text-black focus:outline-none w-80"
                />
            </div>
            <nav>
        <button
          onClick={toggleTheme}
          className="ml-4 px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-white text-black"
        >
          {theme === "dark" ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>
                <NavLink to="/" className="ml-4 hover:underline">Login</NavLink>
            </nav>
        </header>
    );
}