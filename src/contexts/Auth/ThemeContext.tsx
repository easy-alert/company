import { createContext, useContext, useState, ReactNode } from 'react';
import { theme as defaultTheme } from '@styles/theme';

interface ThemeContextType {
  currentTheme: typeof defaultTheme;
  updateThemeColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);

  const updateThemeColor = (color: string) => {
    const newTheme = {
      ...currentTheme,
      color: {
        ...currentTheme.color,
        primary: color,
        primaryM: `color-mix(in srgb, ${color}  50%, white)`,
        primaryL: `color-mix(in srgb, ${color}  80%, white)`,
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

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeContextProvider');
  }
  return context;
}
