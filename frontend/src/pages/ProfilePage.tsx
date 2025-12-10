// src/pages/ProfilePage.tsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserCircleIcon, EnvelopeIcon, CalendarDaysIcon, ArrowRightOnRectangleIcon, CameraIcon } from '@heroicons/react/24/outline';
import { getMyWorkouts } from '../api/workouts';
import { updateProfilePicture } from '../api/auth';
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const MAX_PROFILE_DIMENSION = 512;
const IMAGE_QUALITY = 0.82;

async function compressImage(file: File): Promise<string> {
  const fileDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Erreur lecture fichier'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Erreur chargement image'));
    image.src = fileDataUrl;
  });

  const scale = Math.min(
    1,
    MAX_PROFILE_DIMENSION / Math.max(img.width, img.height)
  );

  const targetWidth = Math.max(1, Math.round(img.width * scale));
  const targetHeight = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return fileDataUrl;
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  return canvas.toDataURL('image/jpeg', IMAGE_QUALITY);
}

const ProfilePage: React.FC = () => {
  const { user, token, logout, updateUser } = useAuth();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [loadingStats, setLoadingStats] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [createdCount, setCreatedCount] = useState(0);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installStatus, setInstallStatus] = useState<'idle' | 'available' | 'prompted' | 'installed'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Pour le graphique : date -> temps passé (en minutes)
  const [sessionStats, setSessionStats] = useState<{ dateLabel: string; dateValue: number; duration: number }[]>([]);

  const memberSinceText = useMemo(
    () => new Date(user?.createdAt ?? Date.now()).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    [user?.createdAt]
  );

  const totalDurationMin = useMemo(
    () => sessionStats.reduce((sum, s) => sum + s.duration, 0),
    [sessionStats]
  );

  const handleInstall = async () => {
    if (!installPromptEvent) return;
    try {
      await installPromptEvent.prompt();
      const choice = await installPromptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        setInstallStatus('prompted');
      } else {
        setInstallStatus('idle');
      }
    } finally {
      setInstallPromptEvent(null);
    }
  };

  useEffect(() => {
    if (!token) return;
    setLoadingStats(true);
    getMyWorkouts(token)
      .then((data) => {
        setCreatedCount(data.length);
        setCompletedCount(data.filter((w) => !!w.completedAt).length);
        // Statistiques mensuelles (création)
        const stats: { [month: string]: number } = {};
        data.forEach((w) => {
          const date = new Date(w.createdAt as string);
          const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
          stats[key] = (stats[key] || 0) + 1;
        });
        // Préparer les stats pour le graphique (date, temps passé)
        const sessions = data
          .map((w) => {
            const date = w.completedAt || w.createdAt; // fallback si pas de completedAt
            if (!date || !Array.isArray(w.exercises)) return null;
            const totalSec = w.exercises.reduce((sum, ex) => sum + (ex.durationSec || 0), 0);
            const durationMin = Math.round(totalSec / 60);
            if (!durationMin) return null;
            const d = new Date(date as string);
            return {
              dateLabel: d.toLocaleDateString('fr-FR'),
              dateValue: d.getTime(),
              duration: durationMin,
            };
          })
          .filter((s): s is { dateLabel: string; dateValue: number; duration: number } => !!s)
          .sort((a, b) => a.dateValue - b.dateValue);
        setSessionStats(sessions);
      })
      .finally(() => setLoadingStats(false));
  }, [token]);

  // PWA install prompt handling
  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    if (isStandalone) {
      setInstallStatus('installed');
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      const bip = event as BeforeInstallPromptEvent;
      bip.preventDefault();
      setInstallPromptEvent(bip);
      setInstallStatus('available');
    };

    const handleAppInstalled = () => {
      setInstallStatus('installed');
      setInstallPromptEvent(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    // Vérifier la taille (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('L\'image est trop volumineuse (max 2MB)');
      return;
    }

    setUploadingPicture(true);

    compressImage(file)
      .then((base64) => updateProfilePicture(token, base64))
      .then((result) => updateUser(result.user))
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.error('Erreur lors de l\'upload:', error);
        }
        alert('Erreur lors de l\'upload de l\'image');
      })
      .finally(() => setUploadingPicture(false));
  };
  if (!user) {
    // En théorie, on passe par ProtectedRoute donc ça ne devrait pas arriver
    return null;
  }

  return (
    <Layout>
      <div className="space-y-5">
        {/* Carte identité compacte */}
        <section className="rounded-2xl border border-app bg-app-secondary/80 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center overflow-hidden border-2 border-primary/40">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <UserCircleIcon className="w-12 h-12 text-app" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPicture}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
                title="Changer la photo de profil"
              >
                <CameraIcon className="w-4 h-4 text-white" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <h1 className="text-xl font-bold text-app truncate">{user.username}</h1>
              <p className="text-sm text-app-secondary">Membre depuis {memberSinceText}</p>
              <p className="text-xs text-app-secondary">Profil · Identité & paramètres</p>
              {uploadingPicture && <p className="text-[11px] text-primary">Mise à jour de la photo...</p>}
            </div>
          </div>
        </section>

        {/* Infos compte */}
        <section className="rounded-2xl border border-app bg-app-secondary p-4 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-app rounded-lg flex items-center justify-center flex-shrink-0">
              <UserCircleIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-app-secondary">Pseudo</p>
              <p className="text-app font-semibold">{user.username}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-app rounded-lg flex items-center justify-center flex-shrink-0">
              <EnvelopeIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-app-secondary">Email</p>
              <p className="text-app">{user.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-app rounded-lg flex items-center justify-center flex-shrink-0">
              <CalendarDaysIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-app-secondary">Compte créé le</p>
              <p className="text-app">{new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="rounded-2xl border border-app bg-app-secondary p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-app">Actions</h2>
            <span className="text-[11px] text-app-secondary">Compte & app</span>
          </div>

          <div className="grid gap-2">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 btn-danger px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Se déconnecter de cet appareil
            </button>

            <button
              className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                installStatus === 'installed'
                  ? 'border-app text-app-secondary cursor-default'
                  : installPromptEvent
                  ? 'border-primary text-primary hover:border-primary/70'
                  : 'border-app text-app-secondary hover:text-app'
              }`}
              onClick={handleInstall}
              disabled={!installPromptEvent || installStatus === 'installed'}
            >
              {installStatus === 'installed'
                ? 'App déjà installée'
                : installPromptEvent
                ? 'Installer l’app (PWA)'
                : 'Installer l’app (PWA) — attends le prompt (bientôt)'}
            </button>

            <button
              className="w-full px-4 py-2.5 rounded-xl border border-app text-sm text-app-secondary hover:text-app transition-colors"
              disabled
            >
              Signaler un bug / feedback
            </button>
          </div>
        </section>

        {/* Statistiques */}
        <section className="rounded-2xl border border-app bg-app-secondary p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-app">Statistiques</h2>
            <span className="text-[11px] text-app-secondary">Vue synthétique</span>
          </div>

          {loadingStats ? (
            <div className="text-app-secondary text-sm">Chargement...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl border border-app bg-app py-3 px-2">
                  <div className="text-2xl font-bold text-primary">{createdCount}</div>
                  <p className="text-[11px] text-app-secondary">Séances créées</p>
                </div>
                <div className="rounded-xl border border-app bg-app py-3 px-2">
                  <div className="text-2xl font-bold text-primary">{completedCount}</div>
                  <p className="text-[11px] text-app-secondary">Séances complétées</p>
                </div>
                <div className="rounded-xl border border-app bg-app py-3 px-2">
                  <div className="text-2xl font-bold text-primary">{totalDurationMin}</div>
                  <p className="text-[11px] text-app-secondary">Minutes mesurées</p>
                </div>
                <div className="rounded-xl border border-app bg-app py-3 px-2">
                  <div className="text-2xl font-bold text-primary">{sessionStats.length}</div>
                  <p className="text-[11px] text-app-secondary">Séances avec durée</p>
                </div>
              </div>

              <div className="bg-app border border-app rounded-xl p-4">
                <h3 className="text-sm font-semibold text-app mb-2">Temps passé par séance</h3>
                {sessionStats.length === 0 ? (
                  <div className="text-sm text-app-secondary">Aucune séance complétée avec durée mesurée pour l'instant.</div>
                ) : (
                  <Line
                    data={{
                      labels: sessionStats.map((s) => s.dateLabel),
                      datasets: [
                        {
                          label: 'Temps passé (min)',
                          data: sessionStats.map((s) => s.duration),
                          fill: false,
                          borderColor: 'var(--primary)',
                          backgroundColor: 'var(--primary)',
                          tension: 0.35,
                          pointRadius: 4,
                          pointHoverRadius: 6,
                          pointBackgroundColor: 'var(--primary)',
                          pointBorderColor: isDark ? '#1e293b' : '#fff',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                        title: { display: false },
                        tooltip: {
                          callbacks: {
                            label: (ctx) => `${ctx.parsed.y} min`,
                          },
                        },
                      },
                      scales: {
                        x: {
                          title: { display: true, text: 'Date', color: isDark ? '#fff' : '#1f2937' },
                          grid: { color: isDark ? 'rgba(100,116,139,0.2)' : 'rgba(200,210,220,0.3)' },
                          ticks: { color: isDark ? '#fff' : '#1f2937' },
                        },
                        y: {
                          title: { display: true, text: 'Temps (min)', color: isDark ? '#fff' : '#1f2937' },
                          beginAtZero: true,
                          suggestedMax: Math.max(...sessionStats.map((s) => s.duration), 10) + 5,
                          grid: { color: isDark ? 'rgba(100,116,139,0.2)' : 'rgba(200,210,220,0.3)' },
                          ticks: { color: isDark ? '#fff' : '#1f2937' },
                        },
                      },
                    }}
                    height={200}
                  />
                )}
              </div>
            </>
          )}
        </section>

        {/* Infos app / PWA */}
        <section className="rounded-2xl border border-app bg-app-secondary p-4 shadow-sm space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-app">App & PWA</h2>
            <span className="text-[11px] text-app-secondary">Infos appareil</span>
          </div>
          <p className="text-app-secondary text-sm">Mode hors-ligne : les dernières séances restent accessibles. Synchronisation au prochain réseau.</p>
          <p className="text-app-secondary text-sm">Installation PWA : utilise le bouton ci-dessus quand le navigateur propose l’installation.</p>
          <p className="text-app-secondary text-sm">Version : dev</p>
        </section>
      </div>
    </Layout>
  );
};

export default ProfilePage;
