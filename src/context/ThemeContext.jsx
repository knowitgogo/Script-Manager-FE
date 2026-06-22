import { createContext, useContext, useState } from "react";

// Create a context for theme management
const ThemeContext = createContext();

// Theme provider component that wraps the app and provides theme state
export function ThemeProvider({ children }) {
  // Current theme state to track the current/default "dark" or "light" (white)
  const [theme, setTheme] = useState("dark");

  // Toggle between dark and light themes
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to consume the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
