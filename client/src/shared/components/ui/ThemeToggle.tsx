import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 text-slate-500 hover:text-sky-500 dark:text-slate-400 dark:hover:text-amber-400 transition-all duration-300 active:scale-90 focus:outline-none focus-visible:outline-none"
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      <div className={`transition-transform duration-500 ${isLight ? 'hover:-rotate-12' : 'hover:rotate-90'}`}>
        {isLight ? (
          <Moon size={22} className="drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.6)] transition-all" />
        ) : (
          <Sun size={22} className="drop-shadow-sm hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-all" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
