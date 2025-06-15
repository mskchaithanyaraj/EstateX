import { createContext, useContext } from "react";

export type Theme = "light" | "dark" | "system";

export const ThemeContext = createContext<ThemeContextProps>({
  theme: "system",
  setTheme: () => {},
});

export interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useTheme = () => useContext(ThemeContext);
