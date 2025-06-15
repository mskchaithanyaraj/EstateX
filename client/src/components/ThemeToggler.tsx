import React, { useState } from "react";
import { useTheme } from "../context/theme-context";
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react";

const ThemeToggler: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { value: "system", label: "System", icon: Monitor },
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
  ];

  const currentTheme = themes.find((t) => t.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                   text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 
                   hover:border-blue-500 dark:hover:border-blue-400 rounded-full px-3 py-2 
                   transition-all duration-300 group"
      >
        <CurrentIcon
          size={16}
          className="text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200"
        />
        <span className="hidden sm:block text-sm font-medium">
          {currentTheme.label}
        </span>
        <ChevronDown
          size={14}
          className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                          rounded-xl shadow-lg z-20 overflow-hidden backdrop-blur-md"
          >
            {themes.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => {
                  setTheme(value as "light" | "dark" | "system");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left 
                           transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 group
                           ${
                             theme === value
                               ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-500 dark:border-blue-400"
                               : "text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                           }`}
              >
                <Icon
                  size={18}
                  className={`transition-transform duration-200 group-hover:scale-110
                             ${
                               theme === value
                                 ? "text-blue-600 dark:text-blue-400"
                                 : "text-gray-500 dark:text-gray-400"
                             }`}
                />
                <span className="font-medium">{label}</span>
                {theme === value && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggler;
