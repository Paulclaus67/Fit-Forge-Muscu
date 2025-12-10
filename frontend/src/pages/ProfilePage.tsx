// src/pages/ProfilePage.tsx
import React, { useEffect, useState, useRef } from 'react';
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

const ProfilePage: React.FC = () => {
  const { user, token, logout, updateUser } = useAuth();
  const { mode } = useTheme();
  const isDark = mode === 'dark';
  const [loadingStats, setLoadingStats] = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [createdCount, setCreatedCount] = useState(0);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Pour le graphique : date -> temps passé (en minutes)
  const [sessionStats, setSessionStats] = useState<{ dateLabel: string; dateValue: number; duration: number }[]>([]);

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

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target?.result as string;
        const result = await updateProfilePicture(token, base64);
        updateUser(result.user);
      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        alert('Erreur lors de l\'upload de l\'image');
      } finally {
        setUploadingPicture(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!user) {
    // En théorie, on passe par ProtectedRoute donc ça ne devrait pas arriver
    return null;
  }

  return (
    <Layout>
      {/* Hero Header */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-app-secondary p-6 shadow-2xl border border-app">
        <div className="absolute inset-0" />
        <div className="relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center overflow-hidden">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-12 h-12 text-app" />
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPicture}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
                title="Changer la photo de profil"
              >
                <CameraIcon className="w-4 h-4 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-app">{user.username}</h1>
              <p className="text-sm text-app-secondary">Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
              {uploadingPicture && (
                <p className="text-xs text-primary mt-1">Mise à jour de la photo...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-app">Informations du compte</h2>
        
        <div className="bg-app-secondary border border-app rounded-xl p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-app rounded-lg flex items-center justify-center flex-shrink-0">
              <UserCircleIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-app-secondary mb-1">Pseudo</label>
              <div className="text-app font-medium">{user.username}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-app rounded-lg flex items-center justify-center flex-shrink-0">
              <EnvelopeIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-app-secondary mb-1">Email</label>
              <div className="text-app">{user.email}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-app rounded-lg flex items-center justify-center flex-shrink-0">
              <CalendarDaysIcon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-app-secondary mb-1">Compte créé le</label>
              <div className="text-app">{new Date(user.createdAt).toLocaleDateString('fr-FR', { 
                day: 'numeric',
                month: 'long', 
                year: 'numeric' 
              })}</div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="pt-4">
          <h2 className="text-lg font-semibold text-app mb-4">Actions</h2>
          
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 btn-danger px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Déconnexion
          </button>
        </div>

        {/* Stats Section */}
        <div className="pt-4">
          <h2 className="text-lg font-semibold text-app mb-4">Statistiques</h2>
          {loadingStats ? (
            <div className="text-app-secondary">Chargement...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-app-secondary border border-app rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{createdCount}</div>
                  <div className="text-xs text-app-secondary">Séances créées</div>
                </div>
                <div className="bg-app-secondary border border-app rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">{completedCount}</div>
                  <div className="text-xs text-app-secondary">Séances complétées</div>
                </div>
              </div>
              {/* Graphique temps passé par séance */}
              <div className="bg-app-secondary border border-app rounded-xl p-4">
                <h3 className="text-md font-semibold text-app mb-2">Temps passé par séance</h3>
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
                        legend: {
                          display: false,
                        },
                        title: {
                          display: false,
                        },
                        tooltip: {
                          callbacks: {
                            label: (ctx) => `${ctx.parsed.y} min`,
                          },
                        },
                      },
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Date',
                            color: isDark ? '#fff' : '#1f2937',
                          },
                          grid: {
                            color: isDark ? 'rgba(100,116,139,0.2)' : 'rgba(200,210,220,0.3)',
                          },
                          ticks: {
                            color: isDark ? '#fff' : '#1f2937',
                          },
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Temps (min)',
                            color: isDark ? '#fff' : '#1f2937',
                          },
                          beginAtZero: true,
                          suggestedMax: Math.max(...sessionStats.map((s) => s.duration), 10) + 5,
                          grid: {
                            color: isDark ? 'rgba(100,116,139,0.2)' : 'rgba(200,210,220,0.3)',
                          },
                          ticks: {
                            color: isDark ? '#fff' : '#1f2937',
                          },
                        },
                      },
                    }}
                    height={200}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
