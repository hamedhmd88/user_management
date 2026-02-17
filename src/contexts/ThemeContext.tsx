import React, { createContext, useContext, useEffect, useState } from "react";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeCtx = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialize theme from localStorage on mount, default to dark
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      const savedTheme = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | null;
      return savedTheme || "dark"; // Default to dark theme
    } catch (error) {
      console.warn(
        "Error accessing localStorage, defaulting to dark theme:",
        error
      );
      return "dark";
    }
  });

  // Apply theme to document element when theme changes
  useEffect(() => {
    try {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.warn("Error saving theme to localStorage:", error);
    }
  }, [theme]);

  // Update theme when it changes
  useEffect(() => {
    try {
      // Apply theme to document element
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", theme);
    } catch (error) {
      console.warn("Error saving theme to localStorage:", error);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeCtx.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useTheme = () => useContext(ThemeCtx)!;
