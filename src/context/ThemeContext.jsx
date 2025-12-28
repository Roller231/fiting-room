import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('fitroom-theme');
    return saved || null;
  });
  
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    return !localStorage.getItem('fitroom-theme');
  });

  useEffect(() => {
    if (theme) {
      localStorage.setItem('fitroom-theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const selectTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    setIsFirstVisit(false);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      selectTheme, 
      isFirstVisit,
      isDark: theme === 'dark'
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
