// src/components/Layout.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  UserIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';
import { ThemeSwitcher } from './ThemeSwitcher';

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean; // pour masquer la nav en mode s�ance
}

const tabs = [
  { path: '/', label: "Aujourd'hui", Icon: HomeIcon },
  { path: '/workouts', label: 'Séances', Icon: ClipboardDocumentListIcon },
  { path: '/weekly-plan', label: 'Planning', Icon: CalendarDaysIcon },
  { path: '/profile', label: 'Profil', Icon: UserIcon },
];

export const Layout: React.FC<LayoutProps> = ({ children, hideNav }) => {
  const location = useLocation();

  // Déterminer quel onglet est actif
  let activeIndex = tabs.findIndex((tab) => {
    if (tab.path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(tab.path);
  });
  if (activeIndex === -1) activeIndex = 0;

  return (
    <div className="min-h-screen flex flex-col bg-app text-app transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-2xl bg-gradient-to-b from-app-secondary/95 to-app-secondary/70 border-b border-primary/20 shadow-md transition-all duration-300">
        <div className="px-6 py-4 flex items-center justify-between max-w-md mx-auto">
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-active:scale-95" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)' }}>
              <BoltIcon className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-app leading-tight">FitForge</h1>
              <p className="text-xs text-app-secondary font-medium">Entraînement</p>
            </div>
          </Link>
          
          <ThemeSwitcher />
        </div>
      </header>

      {/* Contenu */}
      <main className={hideNav ? 'flex-1 p-4 pb-4' : 'flex-1 p-4 pb-20'}>
        <div className="max-w-md mx-auto">{children}</div>
      </main>

      {/* Bottom nav */}
      {!hideNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-20 bg-app-secondary/95 backdrop-blur-xl border-t border-app/30 shadow-2xl transition-colors">
          <div
            className="max-w-md mx-auto px-3 pt-1 pb-1"
            style={{
              paddingBottom: 'max(calc(env(safe-area-inset-bottom, 0px) + 0.25rem), 0.5rem)',
            }}
          >
            <div className="relative h-16 flex items-stretch">
              {/* Onglets */}
              <div className="relative z-10 flex w-full h-full gap-1">
                {tabs.map((tab, index) => {
                  const isActive = index === activeIndex;
                  const Icon = tab.Icon;
                  return (
                    <Link
                      key={tab.path}
                      to={tab.path}
                      className="flex-1 flex items-center justify-center group relative"
                    >
                      {/* Underline indicator (active state) */}
                      {isActive && (
                        <div 
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full transition-all duration-300 shadow-lg"
                          style={{ background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)' }}
                        />
                      )}
                      
                      <div
                        className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 transition-all duration-300 ${
                          isActive 
                            ? 'text-primary scale-105' 
                            : 'text-app-secondary hover:text-app group-hover:scale-105 active:scale-95'
                        }`}
                      >
                        {/* Icône et label */}
                        <Icon className={`transition-all duration-300 ${isActive ? 'w-6 h-6' : 'w-5 h-5 group-hover:w-6 group-hover:h-6'}`} />
                        <span className={`text-[10px] font-semibold transition-all duration-300 ${
                          isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                        }`}>
                          {tab.label}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};
