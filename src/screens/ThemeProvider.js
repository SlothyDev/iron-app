import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState(systemScheme || 'light');
  const [useSystem, setUseSystem] = useState(true); 

  useEffect(() => {
    if (useSystem) {
      setTheme(systemScheme);
    }
  }, [systemScheme, useSystem]);

  const toggleTheme = () => {
    setUseSystem(false);
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };
  const useSystemTheme = () => setUseSystem(true);


  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, useSystemTheme, useSystem }}>
      {children}
    </ThemeContext.Provider>
  );
};



export const useTheme = () => useContext(ThemeContext);