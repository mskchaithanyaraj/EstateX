import React from "react";
import { useTheme } from "../context/theme-context";

const ThemeToggler: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
      className="p-2 rounded bg-gray-200 dark:bg-gray-700"
    >
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
};

export default ThemeToggler;
