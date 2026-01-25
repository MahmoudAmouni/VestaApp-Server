import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext, ThemeMode } from "./ThemeContext";
import { lightTheme, darkTheme } from "@/constants/theme";

const STORAGE_KEY = "vesta_theme_preference";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    (async () => {
      try {
        const savedMode = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedMode === "light" || savedMode === "dark") {
          setModeState(savedMode);
        }
      } catch (error) {
        console.error("Failed to load theme preference:", error);
      }
    })();
  }, []);

  const setMode = useCallback(async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, newMode);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
  }, [mode, setMode]);

  const theme = mode === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
