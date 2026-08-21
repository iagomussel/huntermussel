import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

const applyTheme = (theme: Theme) => {
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    setTheme(stored === "light" || stored === "dark" ? stored : "system");
  }, []);

  const cycleTheme = () => {
    const next: Theme =
      theme === "system" ? "light" : theme === "light" ? "dark" : "system";
    setTheme(next);
    if (next === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", next);
    }
    applyTheme(next);
  };

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;
  const label =
    theme === "light" ? "Light theme" : theme === "dark" ? "Dark theme" : "System theme";

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={`Theme: ${label}. Click to change.`}
      title={label}
      className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted/50 hover:text-primary"
    >
      <Icon size={18} />
    </button>
  );
};

export default ThemeToggle;
