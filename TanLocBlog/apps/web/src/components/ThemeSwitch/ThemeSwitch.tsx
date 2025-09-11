import { useTheme } from "../../ThemeProvider";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-20 right-6 z-50 px-3 py-3 rounded bg-white dark:bg-gray-700 dark:text-white dark:hover:bg-gray-900 text-black shadow-lg hover:bg-gray-200"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <FaSun /> : <FaMoon />}
    </button>
  );
}