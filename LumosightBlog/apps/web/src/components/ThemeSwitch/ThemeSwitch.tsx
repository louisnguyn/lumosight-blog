import { useTheme } from "../../ThemeProvider";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-20 right-6 z-50 p-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 text-black dark:text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 backdrop-blur-md border border-gray-200/50 dark:border-gray-600/50 hover:bg-white dark:hover:bg-gray-700 group"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === "dark" ? (
        <FaSun className="w-6 h-6 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-200 group-hover:rotate-30" />
      ) : (
        <FaMoon className="w-6 h-6 text-blue-600 group-hover:text-blue-500 transition-colors duration-200 group-hover:-rotate-30" />
      )}
    </button>
  );
}