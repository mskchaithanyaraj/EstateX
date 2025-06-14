import React, { useEffect, useState } from "react";
import { ThemeContext, type Theme } from "./theme-context";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme) || "system";
  });

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

      root.classList.remove("light", "dark");

      if (theme === "dark" || (theme === "system" && isSystemDark)) {
        root.classList.add("dark");
      } else {
        root.classList.add("light");
      }
    };

    applyTheme();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
