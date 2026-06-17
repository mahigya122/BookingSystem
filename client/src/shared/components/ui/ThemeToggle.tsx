import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex h-9 w-9 md:h-11 md:w-11 items-center justify-center rounded-xl md:rounded-2xl border transition-all duration-500 shadow-sm"
      style={{
        background: "var(--app-surface-elevated)",
        borderColor: "var(--app-border)",
      }}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      {/* Background Hover Effect */}
      <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-sky-500/0 group-hover:bg-sky-500/10 transition-colors duration-500" />
      
      <div className="relative z-10 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
        {isLight ? (
          <Moon size={18} className="md:size-[22px] text-slate-500 group-hover:text-sky-500 transition-colors duration-500" />
        ) : (
          <Sun size={18} className="md:size-[22px] text-amber-400 group-hover:text-amber-300 transition-colors duration-500" />
        )}
      </div>

      {/* Shine Highlight */}
      <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-400/40 blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};

export default ThemeToggle;
