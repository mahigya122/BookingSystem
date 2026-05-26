import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-10 w-28 items-center rounded-full border p-1 shadow-sm transition-all hover:shadow-md"
      style={{
        background: "color-mix(in srgb, var(--app-surface-elevated) 84%, white 16%)",
        borderColor: "var(--app-border)",
      }}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full shadow-sm transition-all duration-300 ease-out ${isLight ? "left-1" : "left-[calc(50%+2px)]"}`}
        style={{
          background: "linear-gradient(135deg, rgba(229,9,20,0.22), rgba(255,90,95,0.18))",
          boxShadow: "0 12px 24px -16px rgba(15, 23, 42, 0.5)",
        }}
      />

      <div className="relative z-10 flex flex-1 items-center justify-center">
        <Sun size={14} className={`${isLight ? "text-amber-500" : "text-slate-500"} transition-colors duration-300`} />
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center">
        <Moon size={14} className={`${!isLight ? "text-red-500" : "text-slate-500"} transition-colors duration-300`} />
      </div>
    </button>
  );
};

export default ThemeToggle;