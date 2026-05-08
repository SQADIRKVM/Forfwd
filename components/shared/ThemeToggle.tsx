"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === "dark";
  
  // Styles adapt automatically based on active theme
  const styles = "bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 border-slate-200 dark:border-white/10 text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${styles}`}
    >
      <Sun className={`w-4 h-4 absolute transition-all duration-300 ${isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
      <Moon className={`w-4 h-4 absolute transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} />
    </button>
  );
}
