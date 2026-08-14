import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define your Light and Dark color palettes
const lightTheme = {
  background: '#FFF8ED',   // warm cream
  card: '#FFFFFF',
  primary: '#EBBF87',      // caramel
  primaryDark: '#4A2E1B',  // deep brown
  rust: '#9A4C41',
  brown: '#936046',
  coral: '#EE2D2C',
  text: '#2B1B12',
  textMuted: '#7A6A5C',
  border: '#EFE3D3',
  white: '#FFFFFF',
};

const darkTheme = {
  background: '#1A1412',   // Deep coffee black
  card: '#2B221E',         // Dark brown card
  primary: '#D4A36A',      // Muted caramel
  primaryDark: '#4A2E1B',
  rust: '#B85C4F',         // Brighter rust for dark mode
  brown: '#7A5448',
  coral: '#EE2D2C',
  text: '#F2EBE1',         // Creamy off-white
  textMuted: '#A09185',
  border: '#3D322C',
  white: '#FFFFFF',
};

type ThemeType = typeof lightTheme;

interface ThemeContextType {
  theme: ThemeType;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load saved theme preference on app start
  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem('userTheme');
      if (saved === 'dark') setIsDarkMode(true);
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('userTheme', newMode ? 'dark' : 'light');
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};