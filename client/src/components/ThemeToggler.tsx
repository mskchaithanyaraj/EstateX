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
        className="flex items-center space-x-2 bg-section hover:bg-input
                   text-primary border border-default 
                   hover:border-input-focus rounded-full px-3 py-2 
                   transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-orange-500/20"
      >
        <CurrentIcon
          size={16}
          className="text-accent group-hover:scale-110 transition-transform duration-200"
        />
        <span className="hidden sm:block text-sm font-medium">
          {currentTheme.label}
        </span>
        <ChevronDown
          size={14}
          className={`text-muted transition-transform duration-200 ${
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
            className="absolute right-0 mt-2 w-48 bg-card border border-default 
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
                           transition-all duration-200 hover:bg-section group
                           focus:outline-none focus:ring-2 focus:ring-orange-500/20
                           ${
                             theme === value
                               ? "bg-orange-50 dark:bg-orange-950/20 text-accent border-r-2 border-accent"
                               : "text-primary hover:text-accent"
                           }`}
              >
                <Icon
                  size={18}
                  className={`transition-transform duration-200 group-hover:scale-110
                             ${
                               theme === value
                                 ? "text-accent"
                                 : "text-muted group-hover:text-accent"
                             }`}
                />
                <span className="font-medium">{label}</span>
                {theme === value && (
                  <div className="ml-auto w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                )}
              </button>
            ))}

            {/* Theme Preview Hint */}
            <div className="px-4 py-2 border-t border-default bg-section">
              <p className="text-xs text-muted text-center">
                Theme applies to entire app
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggler;
