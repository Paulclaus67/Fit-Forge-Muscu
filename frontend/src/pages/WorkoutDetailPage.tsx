// src/pages/WorkoutDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkout } from '../api/workouts';
import type { WorkoutDetail } from '../api/workouts';
import { useAuth } from '../context/AuthContext';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import {
  ArrowLeftIcon,
  PlayIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const WorkoutDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await getWorkout(Number(id));
        setWorkout(data);
      } catch (err: any) {
        setError(err.message || 'Erreur chargement séance');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  return (
    <Layout>
      {loading && (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-app-secondary border border-app rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-app-secondary rounded mb-2"></div>
              <div className="h-3 bg-app-secondary rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-100/50 border border-red-300 rounded-xl p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {workout && (
        <div className="space-y-6">
          {/* Hero Header */}
          <div className="relative overflow-hidden rounded-2xl bg-app-secondary p-4 sm:p-6 shadow-2xl border border-app">
            <div className="space-y-4">
              {/* Breadcrumb */}
              <button
                onClick={() => navigate('/workouts')}
                className="inline-flex items-center gap-2 text-sm text-app-secondary hover:text-app transition-colors mb-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Retour aux séances
              </button>

              {/* Title and Badge */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-app mb-2">{workout.name}</h1>
                    {workout.description && (
                      <p className="text-sm text-app-secondary max-w-2xl">{workout.description}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap sm:flex-col gap-2 flex-shrink-0">
                    <span className={`text-xs px-3 py-1.5 rounded-full border font-medium w-fit ${
                      workout.type === 'CIRCUIT'
                        ? 'border-orange-500/50 text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-500/10'
                        : 'border-blue-500/50 text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/10'
                    }`}>
                      {workout.type === 'CIRCUIT' ? '⚙️ Circuit' : '🏋️ Simple'}
                    </span>
                    {workout.ownerId === null && (
                      <span className="text-xs px-3 py-1.5 rounded-full border border-primary text-primary bg-app-secondary font-medium w-fit">
                        📋 Template
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => navigate(`/workouts/${workout.id}/play`)}
                  className="flex items-center justify-center gap-2 btn-primary px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-sm transition-all flex-1 sm:flex-none"
                >
                  <PlayIcon className="w-4 h-4" />
                  Lancer
                </button>
                <button
                  onClick={async () => {
                    if (!token) return;
                    try {
                      setActionError(null);
                      setActionLoading(true);
                      if (workout.ownerId == null) {
                        const cloned = await (await import('../api/workouts')).cloneWorkout(workout.id, token);
                        navigate(`/workouts/${cloned.id}/edit`);
                      } else {
                        navigate(`/workouts/${workout.id}/edit`);
                      }
                    } catch (err: any) {
                      setActionError(err.message || 'Impossible de modifier la séance. Veuillez réessayer.');
                    } finally {
                      setActionLoading(false);
                    }
                  }}
                  disabled={actionLoading || !token}
                  className="flex items-center justify-center gap-2 bg-app-secondary text-app px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-sm transition-all border border-app hover:bg-app-secondary disabled:opacity-50 flex-1 sm:flex-none"
                >
                  <PencilIcon className="w-4 h-4" />
                  {actionLoading ? 'Chargement...' : 'Modifier'}
                </button>
                {workout.ownerId != null && (
                  <button
                    onClick={() => {
                      if (!token) return;
                      setShowDeleteDialog(true);
                    }}
                    disabled={actionLoading || !token}
                    className="flex items-center justify-center gap-2 btn-danger px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-sm transition-all flex-1 sm:flex-none disabled:opacity-50"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Supprimer
                  </button>
                )}
              </div>

              {actionError && (
                <div className="bg-red-100/50 border border-red-300 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-red-700">{actionError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Exercises Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-app">Exercices</h2>
                <p className="text-sm text-app-secondary mt-1">{workout.exercises.length} exercice{workout.exercises.length > 1 ? 's' : ''} à effectuer</p>
              </div>
            </div>

            {workout.exercises.length === 0 ? (
              <div className="text-center py-12 bg-app-secondary border border-app rounded-xl">
                <div className="w-16 h-16 bg-app-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-app-secondary font-medium">Aucun exercice</p>
                <p className="text-xs text-app-secondary mt-2">Cette séance ne contient pas d'exercice</p>
              </div>
            ) : (
              <div className="space-y-3">
                {workout.exercises.map((step, idx) => (
                  <div
                    key={`${step.exercise.id}-${step.order}`}
                    className="bg-app-secondary border border-app rounded-lg p-4 hover:border-app transition-all"
                  >
                    {/* Exercise Header */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-app flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <h3 className="text-base font-semibold text-app flex-1">{step.exercise.name}</h3>
                    </div>

                    {/* Exercise Details - Compact Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      {step.sets !== null && (
                        <div className="bg-blue-100 border border-blue-300 rounded-lg p-2">
                          <div className="text-xs text-blue-700 font-medium mb-0.5">Séries</div>
                          <div className="text-base font-bold text-blue-700">{step.sets}</div>
                        </div>
                      )}
                      {step.reps !== null && (
                        <div className="bg-purple-100 border border-purple-300 rounded-lg p-2">
                          <div className="text-xs text-purple-700 font-medium mb-0.5">Reps</div>
                          <div className="text-base font-bold text-purple-700">
                            {step.reps === 0 ? 'max' : step.reps}
                          </div>
                        </div>
                      )}
                      {step.durationSec !== null && (
                        <div className="bg-orange-100 border border-orange-300 rounded-lg p-2">
                          <div className="text-xs text-orange-700 font-medium mb-0.5">Durée</div>
                          <div className="text-base font-bold text-orange-700">{step.durationSec}s</div>
                        </div>
                      )}
                      {step.restSec !== null && (
                        <div className="bg-indigo-100 border border-indigo-300 rounded-lg p-2">
                          <div className="text-xs text-indigo-700 font-medium mb-0.5">Repos</div>
                          <div className="text-base font-bold text-indigo-700">
                            {Math.round(step.restSec / 60)}m
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {step.notes && (
                      <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-700">
                        <p className="text-xs text-app-secondary">
                          <span className="text-app-secondary font-medium">Notes : </span>
                          {step.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Supprimer cette séance ?"
        description={
          workout
            ? `Êtes-vous sûr de vouloir supprimer définitivement la séance "${workout.name}" ? Cette action est irréversible.`
            : "Êtes-vous sûr de vouloir supprimer cette séance ?"
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        tone="danger"
        isConfirming={actionLoading}
        onCancel={() => {
          if (!actionLoading) setShowDeleteDialog(false);
        }}
        onConfirm={async () => {
          if (!token || !id) return;
          try {
            setActionError(null);
            setActionLoading(true);
            await (await import('../api/workouts')).deleteWorkout(Number(id), token);
            navigate('/workouts');
          } catch (err: any) {
            setActionError(err.message || 'Impossible de supprimer la séance. Veuillez réessayer.');
          } finally {
            setActionLoading(false);
            setShowDeleteDialog(false);
          }
        }}
      />
    </Layout>
  );
};

export default WorkoutDetailPage;
