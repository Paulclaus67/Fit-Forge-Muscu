import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark';
type ThemeName = 'default' | 'forest' | 'ocean' | 'sunset';

interface ThemeContextValue {
  mode: ThemeMode;
  theme: ThemeName;
  toggleMode: () => void;
  setTheme: (name: ThemeName) => void;
  availableThemes: ThemeName[];
}

const STORAGE_KEY_MODE = 'app-mode';
const STORAGE_KEY_THEME = 'app-theme';

// Palette CSS variables par thème et mode
const THEMES: Record<ThemeName, Record<ThemeMode, Record<string, string>>> = {
  default: {
    light: {
      '--bg': '#f8fafc',
      '--bg-secondary': '#ffffff',
      '--text': '#0f172a',
      '--text-secondary': '#64748b',
      '--border': '#e2e8f0',
      '--border-accent': '#94a3b8',
      '--primary': '#10b981',
      '--primary-light': '#d1fae5',
      '--accent': '#0ea5e9',
    },
    dark: {
      '--bg': '#020617',
      '--bg-secondary': '#0f172a',
      '--text': '#f8fafc',
      '--text-secondary': '#cbd5e1',
      '--border': '#334155',
      '--border-accent': '#475569',
      '--primary': '#10b981',
      '--primary-light': '#065f46',
      '--accent': '#0ea5e9',
    },
  },
  forest: {
    light: {
      '--bg': '#e6f4ea',
      '--bg-secondary': '#c7e9c1',
      '--text': '#1b3a1b',
      '--text-secondary': '#4b6043',
      '--border': '#a3b18a',
      '--border-accent': '#5a8c3a',
      '--primary': '#047857',
      '--primary-light': '#a7f3d0',
      '--accent': '#f59e0b',
      '--accent-secondary': '#7bb661',
      '--highlight': '#b7e4c7',
    },
    dark: {
      '--bg': '#183a2a',
      '--bg-secondary': '#22543d',
      '--text': '#e6f4ea',
      '--text-secondary': '#b7e4c7',
      '--border': '#3a5a40',
      '--border-accent': '#2d5a3d',
      '--primary': '#34d399',
      '--primary-light': '#047857',
      '--accent': '#fbbf24',
      '--accent-secondary': '#7bb661',
      '--highlight': '#4b6043',
    },
  },
  ocean: {
    light: {
      '--bg': '#e0f7fa',
      '--bg-secondary': '#b2ebf2',
      '--text': '#00334e',
      '--text-secondary': '#0077b6',
      '--border': '#90caf9',
      '--border-accent': '#0288d1',
      '--primary': '#0260a3',
      '--primary-light': '#a7e9f7',
      '--accent': '#f97316',
      '--accent-secondary': '#00bcd4',
      '--highlight': '#ffb703',
    },
    dark: {
      '--bg': '#102542',
      '--bg-secondary': '#1b3a4b',
      '--text': '#e0f7fa',
      '--text-secondary': '#90caf9',
      '--border': '#0077b6',
      '--border-accent': '#0d2d42',
      '--primary': '#06d6ff',
      '--primary-light': '#003d52',
      '--accent': '#ff6b35',
      '--accent-secondary': '#00bcd4',
      '--highlight': '#ffb703',
    },
  },
    sunset: {
    light: {
      '--bg': '#ffe5d9',
      '--bg-secondary': '#ffd6ba',
      '--text': '#6a040f',
      '--text-secondary': '#ff7f50',
      '--border': '#ffb4a2',
      '--border-accent': '#ff7f50',
      '--primary': '#ea580c',
      '--primary-light': '#ffb703',
      '--accent': '#dc2626',
      '--accent-secondary': '#ff7f50',
    },
    dark: {
      '--bg': '#6a040f',
      '--bg-secondary': '#9d0208',
      '--text': '#ffd6ba',
      '--text-secondary': '#ffb4a2',
      '--border': '#ff7f50',
      '--border-accent': '#ff6b35',
      '--primary': '#ff9966',
      '--primary-light': '#ea580c',
      '--accent': '#ff4444',
      '--accent-secondary': '#ff7f50',
      '--highlight': '#9d0208',
    },
  },
};
 

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MODE) as ThemeMode | null;
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  const [theme, setTheme] = useState<ThemeName>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME) as ThemeName | null;
      if (saved && ['default', 'forest', 'ocean', 'sunset'].includes(saved)) return saved as ThemeName;
    } catch {}
    return 'default';
  });

  // Appliquer la classe dark au <html>
  useLayoutEffect(() => {
    const html = document.documentElement;
    if (mode === 'dark') html.classList.add('dark'); else html.classList.remove('dark');
  }, [mode]);

  // Appliquer variables CSS selon thème + mode
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const vars = THEMES[theme][mode];
    Object.entries(vars).forEach(([key, val]) => html.style.setProperty(key, val));
    html.style.backgroundColor = vars['--bg'];
    html.style.color = vars['--text'];
    body.style.backgroundColor = vars['--bg'];
    body.style.color = vars['--text'];
    try {
      localStorage.setItem(STORAGE_KEY_MODE, mode);
      localStorage.setItem(STORAGE_KEY_THEME, theme);
    } catch {}
  }, [theme, mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const availableThemes: ThemeName[] = ['default', 'forest', 'ocean', 'sunset'];

  const value = useMemo(
    () => ({ mode, theme, toggleMode, setTheme, availableThemes }),
    [mode, theme, toggleMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
