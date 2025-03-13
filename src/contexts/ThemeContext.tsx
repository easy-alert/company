import { createContext, useContext, useState, ReactNode } from 'react';

import { transformColor } from '@utils/colorTransform';

import { theme as defaultTheme } from '@styles/theme';

interface ThemeContextType {
  currentTheme: typeof defaultTheme;
  updateThemeColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  const updateThemeColor = (color = '#B21D1D') => {
    const newTheme = {
      ...currentTheme,

      color: {
        ...currentTheme.color,
        primary: color,
        primaryM: transformColor(color, 0, 0, 10),
        primaryL: transformColor(color, 0, 0, 20),
      },
    };

    setCurrentTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, updateThemeColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useCustomTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeContextProvider');
  }

  return context;
}
