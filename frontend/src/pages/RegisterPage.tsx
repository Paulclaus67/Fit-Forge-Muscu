// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { MoonIcon, SunIcon, BoltIcon } from '@heroicons/react/24/outline';
import { Alert } from '../components/ui/Alert';

type ThemeName = 'default' | 'forest' | 'ocean' | 'sunset';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { mode, theme, toggleMode, setTheme, availableThemes } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [openThemeMenu, setOpenThemeMenu] = useState(false);
  const themeButtonRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenThemeMenu(false);
    };
    const onClickAway = (e: MouseEvent) => {
      if (!openThemeMenu) return;
      const target = e.target as Node;
      if (themeButtonRef.current && !themeButtonRef.current.contains(target)) {
        setOpenThemeMenu(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('click', onClickAway);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('click', onClickAway);
    };
  }, [openThemeMenu]);

  const validateForm = (): boolean => {
    if (!email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return false;
    }
    if (username.length < 3) {
      setError('Le pseudo doit contenir au moins 3 caractères');
      return false;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await register(email, username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const themeLabels: Record<ThemeName, string> = {
    default: '🎯 Défaut',
    forest: '🌲 Forêt',
    ocean: '🌊 Océan',
    sunset: '🌅 Sunset'
  };

  const themeColors: Record<ThemeName, { primary: string; accent: string }> = {
    default: { primary: '#10b981', accent: '#0ea5e9' },
    forest: { primary: '#10b981', accent: '#fbbf24' },
    ocean: { primary: '#00bcd4', accent: '#ff6b35' },
    sunset: { primary: '#ff7f50', accent: '#ff4444' }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-app text-app px-4 transition-colors">
      {/* Theme Button */}
      <div className="absolute top-6 right-6">
        <button
          type="button"
          onClick={() => setOpenThemeMenu((o) => !o)}
          ref={themeButtonRef}
          className="group relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-primary via-accent to-primary shadow-lg border-2 border-primary/50 transition-all duration-300 hover:scale-110 hover:shadow-xl active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Choisir le thème"
          aria-expanded={openThemeMenu}
        >
          <div className="absolute inset-0 rounded-full bg-linear-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {mode === 'dark' ? (
            <SunIcon className="w-6 h-6 text-white relative z-10 transition-transform group-hover:rotate-180 duration-500 drop-shadow-md" />
          ) : (
            <MoonIcon className="w-6 h-6 text-white relative z-10 transition-transform group-hover:-rotate-12 duration-300 drop-shadow-md" />
          )}
        </button>
        
        {openThemeMenu && (
          <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-primary/30 bg-app-secondary shadow-2xl z-30 overflow-hidden animate-scale-in backdrop-blur-sm">
            {/* Mode toggle */}
            <div className="p-4 border-b border-app/50">
              <div className="text-xs font-bold text-app mb-3 uppercase tracking-wider opacity-75">Apparence</div>
              <div className="flex gap-2">
                <button 
                  onClick={toggleMode}
                  className={`flex-1 px-4 py-3.5 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 group relative overflow-hidden ${
                    mode === 'light' 
                      ? 'bg-app text-app-secondary shadow-lg scale-105 border-2 border-primary' 
                      : 'bg-app/50 text-app-secondary hover:bg-app/70 hover:text-app hover:scale-105 border border-app'
                  }`}
                  type="button"
                >
                  {mode === 'light' && (
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent" />
                  )}
                  <SunIcon className={`w-7 h-7 relative z-10 transition-transform duration-300 ${mode === 'light' ? 'text-primary rotate-180' : 'group-hover:rotate-12'}`} />
                  <span className="text-xs font-semibold relative z-10">Clair</span>
                </button>
                
                <button 
                  onClick={toggleMode}
                  className={`flex-1 px-4 py-3.5 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 group relative overflow-hidden ${
                    mode === 'dark' 
                      ? 'bg-app text-app-secondary shadow-lg scale-105 border-2 border-primary' 
                      : 'bg-app/50 text-app-secondary hover:bg-app/70 hover:text-app hover:scale-105 border border-app'
                  }`}
                  type="button"
                >
                  {mode === 'dark' && (
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent" />
                  )}
                  <MoonIcon className={`w-7 h-7 relative z-10 transition-transform duration-300 ${mode === 'dark' ? 'text-primary -rotate-12' : 'group-hover:-rotate-12'}`} />
                  <span className="text-xs font-semibold relative z-10">Sombre</span>
                </button>
              </div>
            </div>
            
            {/* Theme colors */}
            <div className="p-4">
              <div className="text-xs font-bold text-app mb-3 uppercase tracking-wider opacity-75">Couleurs</div>
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
                      type="button"
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
                            background: `linear-gradient(135deg, ${themeColors[t].primary} 0%, ${themeColors[t].accent} 100%)` 
                          }} 
                        />
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary border-2 border-app-secondary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="relative z-10 flex-1 text-left">
                        <span className={`text-sm font-semibold transition-colors ${
                          isSelected ? 'text-app' : 'text-app-secondary group-hover:text-app'
                        }`}>
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

      {/* Main Content */}
      <div className="w-full max-w-sm animate-slide-in">
        {/* Logo & Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 bg-linear-to-br from-primary to-accent">
            <BoltIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-app">FitForge</h1>
          <p className="text-sm text-app-secondary mt-1">Forge ton corps</p>
        </div>

        {/* Form */}
        <div className="bg-app-secondary rounded-2xl border border-app shadow-lg p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-app">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-app border-2 border-app/50 text-app placeholder:text-app-secondary focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
                required
              />
            </div>

            {/* Username Input */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-app">
                Pseudo (3+ caractères)
              </label>
              <input
                id="username"
                type="text"
                placeholder="Votre pseudo unique"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-app border-2 border-app/50 text-app placeholder:text-app-secondary focus:border-primary focus:outline-none transition-colors disabled:opacity-50"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-app">
                Mot de passe (6+ caractères)
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre mot de passe sécurisé"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-app border-2 border-app/50 text-app placeholder:text-app-secondary focus:border-primary focus:outline-none transition-colors disabled:opacity-50 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-app-secondary hover:text-app transition-colors p-1"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-app">
                Confirmez le mot de passe
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmez votre mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-app border-2 border-app/50 text-app placeholder:text-app-secondary focus:border-primary focus:outline-none transition-colors disabled:opacity-50 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-app-secondary hover:text-app transition-colors p-1"
                  aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert
                variant="error"
                message={error}
                closeable
                onClose={() => setError(null)}
              />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl btn-primary font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          {/* Login Link */}
          <div className="pt-4 border-t border-app/30">
            <p className="text-center text-sm text-app-secondary">
              Déjà un compte ?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
