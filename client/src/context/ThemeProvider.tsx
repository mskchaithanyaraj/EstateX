import React, { useEffect, useState } from "react";
import { ThemeContext, type Theme } from "./theme-context";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") return "system";

    return (localStorage.getItem("theme") as Theme) || "system";
  });

  const [isInitialized, setIsInitialized] = useState(false);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const applyTheme = () => {
      const root = window.document.documentElement;
      const isSystemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      // Remove both classes first
      root.classList.remove("light", "dark");

      // Apply the correct theme
      if (theme === "dark" || (theme === "system" && isSystemDark)) {
        root.classList.add("dark");
      } else {
        root.classList.add("light");
      }

      // Mark as initialized after first theme application
      if (!isInitialized) {
        setIsInitialized(true);
      }
    };

    // Apply theme immediately
    applyTheme();

    // Listen for system theme changes only if theme is "system"
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, isInitialized]);

  // Don't render until theme is initialized to prevent flash
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        {/* Optional: Add a loading spinner here */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
