import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

// Reusable theme switcher button + menu to keep styling consistent across screens.
interface ThemeSwitcherProps {
  size?: 'sm' | 'md';
  className?: string;
  withLabel?: boolean;
}

type ThemeName = 'default' | 'forest' | 'ocean' | 'sunset';

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  size = 'md',
  className = '',
  withLabel = false,
}) => {
  const { mode, theme, toggleMode, setTheme, availableThemes } = useTheme();
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClickAway = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as Node;
      if (buttonRef.current && !buttonRef.current.contains(target)) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('click', onClickAway);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('click', onClickAway);
    };
  }, [open]);

  const buttonSize = size === 'sm' ? 'w-11 h-11' : 'w-12 h-12';
  const label = mode === 'dark' ? 'Basculer clair' : 'Basculer sombre';

  const themeLabels: Record<ThemeName, string> = {
    default: '🎯 Défaut',
    forest: '🌲 Forêt',
    ocean: '🌊 Océan',
    sunset: '🌅 Sunset',
  };

  const themeColors: Record<ThemeName, { primary: string; accent: string }> = {
    default: { primary: '#10b981', accent: '#0ea5e9' },
    forest: { primary: '#10b981', accent: '#fbbf24' },
    ocean: { primary: '#00bcd4', accent: '#ff6b35' },
    sunset: { primary: '#ff7f50', accent: '#ff4444' },
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        ref={buttonRef}
        className={`group relative inline-flex items-center justify-center ${buttonSize} rounded-full dark:bg-gradient-to-br dark:from-primary dark:via-accent dark:to-primary bg-app-secondary shadow-lg border-2 dark:border-primary/50 border-app shadow-md transition-all duration-300 hover:scale-110 dark:hover:shadow-xl hover:shadow-lg active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary overflow-hidden`}
        aria-label="Choisir le thème"
        title="Choisir le thème"
      >
        <div className="absolute inset-0 rounded-full dark:bg-linear-to-br dark:from-white/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {mode === 'dark' ? (
          <SunIcon className="w-6 h-6 dark:text-white text-primary relative z-10 transition-transform group-hover:rotate-180 duration-500 drop-shadow-md" />
        ) : (
          <MoonIcon className="w-6 h-6 dark:text-white text-primary relative z-10 transition-transform group-hover:-rotate-12 duration-300 drop-shadow-md" />
        )}
        {withLabel && (
          <span className="sr-only">{label}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-app bg-app-secondary shadow-2xl z-30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mode toggle */}
          <div className="p-4 border-b border-app/50">
            <div className="text-xs font-bold text-app mb-3 uppercase tracking-wider">Apparence</div>
            <div className="flex gap-2">
              <button
                onClick={toggleMode}
                className={`flex-1 px-4 py-3.5 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 group relative overflow-hidden ${
                  mode === 'light'
                    ? 'bg-app text-app shadow-lg scale-105 border-2 border-primary'
                    : 'bg-app/50 text-app-secondary hover:bg-app/70 hover:text-app hover:scale-105 border border-app'
                }`}
              >
                {mode === 'light' && (
                  <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent" />
                )}
                <SunIcon
                  className={`w-7 h-7 relative z-10 transition-transform duration-300 ${
                    mode === 'light' ? 'text-primary rotate-180' : 'group-hover:rotate-12'
                  }`}
                />
                <span className="text-xs font-semibold relative z-10">Clair</span>
              </button>

              <button
                onClick={toggleMode}
                className={`flex-1 px-4 py-3.5 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 group relative overflow-hidden ${
                  mode === 'dark'
                    ? 'bg-app text-app shadow-lg scale-105 border-2 border-primary'
                    : 'bg-app/50 text-app-secondary hover:bg-app/70 hover:text-app hover:scale-105 border border-app'
                }`}
              >
                {mode === 'dark' && (
                  <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent" />
                )}
                <MoonIcon
                  className={`w-7 h-7 relative z-10 transition-transform duration-300 ${
                    mode === 'dark' ? 'text-primary -rotate-12' : 'group-hover:-rotate-12'
                  }`}
                />
                <span className="text-xs font-semibold relative z-10">Sombre</span>
              </button>
            </div>
          </div>

          {/* Theme colors */}
          <div className="p-4">
            <div className="text-xs font-bold text-app mb-3 uppercase tracking-wider">Couleurs</div>
            <div className="grid grid-cols-2 gap-3">
              {availableThemes.map((t) => {
                const isSelected = t === theme;

                return (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${
                      isSelected
                        ? 'bg-app shadow-xl scale-105 border-2 border-primary'
                        : 'bg-app/50 hover:bg-app hover:scale-105 hover:shadow-lg border border-app'
                    }`}
                    aria-label={`Choisir le thème ${t}`}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10" />
                    )}

                    <div className="relative z-10 shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full shadow-md transition-transform duration-300 ${
                          isSelected ? 'scale-110 ring-2 ring-primary ring-offset-2 ring-offset-app-secondary' : 'group-hover:scale-110'
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${themeColors[t].primary} 0%, ${themeColors[t].accent} 100%)`,
                        }}
                      />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-app-secondary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                      )}
                    </div>

                    <div className="relative z-10 flex-1 text-left">
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          isSelected ? 'text-app' : 'text-app-secondary group-hover:text-app'
                        }`}
                      >
                        {themeLabels[t]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
