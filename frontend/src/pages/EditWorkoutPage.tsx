// src/pages/EditWorkoutPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { useParams } from 'react-router-dom';
import {
  getWorkout,
  updateWorkout,
  type WorkoutDetail,
  type UpdateWorkoutExercisePayload,
} from '../api/workouts';
import { useAuth } from '../context/AuthContext';
import { getExercises, type Exercise } from '../api/exercises';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  Bars3Icon,
  CheckIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

interface WorkoutExercise {
  exerciseId: number;
  exerciseName: string;
  order: number;
  sets: string;
  reps: string;
  durationSec: string;
  restSec: string;
  notes: string;
  circuitIndex: string;
  circuitOrder: string;
}

interface ExerciseCardProps {
  exercise: WorkoutExercise;
  index: number;
  onChange: (index: number, field: string, value: string) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ 
  exercise, 
  index, 
  onChange, 
  onRemove, 
  onMoveUp, 
  onMoveDown, 
  isFirst, 
  isLast
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-app-secondary border border-app rounded-lg overflow-hidden hover:bg-app transition-all">
      {/* Header - toujours visible */}
      <div className="p-3">
        <div className="flex items-center gap-2">
          {/* Numéro d'ordre avec contrôles de mouvement */}
          <div className="flex flex-col items-center gap-0.5 px-2 py-1 bg-app-secondary rounded">
            <button
              onClick={onMoveUp}
              disabled={isFirst}
              className="p-1 hover:bg-app rounded disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              title="Monter cet exercice"
            >
              <ChevronUpIcon className="w-5 h-5 text-app" />
            </button>
            <span className="text-sm font-bold text-primary leading-none">
              {index + 1}
            </span>
            <button
              onClick={onMoveDown}
              disabled={isLast}
              className="p-1 hover:bg-app rounded disabled:opacity-20 disabled:cursor-not-allowed transition-all"
              title="Descendre cet exercice"
            >
              <ChevronDownIcon className="w-5 h-5 text-app" />
            </button>
          </div>

          {/* Nom de l'exercice */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 text-left flex items-center gap-2 hover:text-primary transition-colors"
          >
            <h3 className="text-sm font-semibold text-app">{exercise.exerciseName}</h3>
          </button>

          {/* Infos rapides avec badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {exercise.sets && (
              <div className="px-2 py-1 rounded bg-app-secondary border border-app flex items-center gap-1" title="Nombre de séries">
                <span className="text-xs text-app font-semibold">⊕</span>
                <span className="text-xs text-app">{exercise.sets}</span>
              </div>
            )}
            {exercise.reps && (
              <div className="px-2 py-1 rounded bg-app-secondary border border-app flex items-center gap-1" title="Nombre de répétitions">
                <span className="text-xs text-app font-semibold">⟲</span>
                <span className="text-xs text-app">{exercise.reps === '0' ? 'max' : exercise.reps}</span>
              </div>
            )}
            {exercise.durationSec && (
              <div className="px-2 py-1 rounded bg-app-secondary border border-app flex items-center gap-1" title="Durée de l'exercice">
                <span className="text-xs text-app font-semibold">⏱</span>
                <span className="text-xs text-app">{exercise.durationSec}s</span>
              </div>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 hover:bg-app rounded transition-all group relative"
              title={expanded ? "Réduire les détails" : "Voir les détails"}
            >
              <Bars3Icon className="w-5 h-5 text-app" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-app text-xs text-app opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {expanded ? "Réduire" : "Détails"}
              </span>
            </button>
            <button
              onClick={onRemove}
              className="p-2 hover:bg-app-secondary rounded transition-all group relative"
              title="Supprimer cet exercice"
            >
              <TrashIcon className="w-5 h-5 text-app" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded bg-app text-xs text-app opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Supprimer
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Détails - affichés uniquement si expanded */}
      {expanded && (
        <div className="px-3 pb-3 pt-0 space-y-3 border-t border-app">
          <div className="grid grid-cols-4 gap-2 mt-3">
            <div>
              <label className="block text-xs font-medium text-app-secondary mb-1">Séries</label>
              <input
                type="number"
                min="0"
                max="99"
                className="w-full px-2 py-1.5 text-sm bg-app-secondary border border-app rounded text-app placeholder-app-secondary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="3"
                value={exercise.sets}
                onChange={(e) => onChange(index, 'sets', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-app-secondary mb-1">
                Reps <span className="text-[10px] text-app-secondary">(0=max)</span>
              </label>
              <input
                type="number"
                min="0"
                max="999"
                className="w-full px-2 py-1.5 text-sm bg-app-secondary border border-app rounded text-app placeholder-app-secondary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="10"
                value={exercise.reps}
                onChange={(e) => onChange(index, 'reps', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-app-secondary mb-1">Durée (s)</label>
              <input
                type="number"
                min="0"
                max="3600"
                className="w-full px-2 py-1.5 text-sm bg-app-secondary border border-app rounded text-app placeholder-app-secondary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="30"
                value={exercise.durationSec}
                onChange={(e) => onChange(index, 'durationSec', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-app-secondary mb-1">Repos (s)</label>
              <input
                type="number"
                min="0"
                max="600"
                className="w-full px-2 py-1.5 text-sm bg-app-secondary border border-app rounded text-app placeholder-app-secondary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                placeholder="60"
                value={exercise.restSec}
                onChange={(e) => onChange(index, 'restSec', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-app-secondary mb-1">Notes</label>
            <textarea
              rows={2}
              className="w-full px-2 py-1.5 text-sm bg-app-secondary border border-app rounded text-app placeholder-app-secondary focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
              placeholder="Instructions spéciales..."
              value={exercise.notes}
              onChange={(e) => onChange(index, 'notes', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const EditWorkoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [exerciseQuery, setExerciseQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [workoutName, setWorkoutName] = useState('');

  const handleExerciseChange = (index: number, field: string, value: string) => {
    setExercises(prev => prev.map((ex, i) => i === index ? { ...ex, [field]: value } : ex));
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleMoveExerciseUp = (index: number) => {
    if (index === 0) return;
    setExercises(prev => {
      const newExercises = [...prev];
      [newExercises[index - 1], newExercises[index]] = [newExercises[index], newExercises[index - 1]];
      return newExercises.map((ex, i) => ({ ...ex, order: i + 1 }));
    });
  };

  const handleMoveExerciseDown = (index: number) => {
    setExercises(prev => {
      if (index === prev.length - 1) return prev;
      const newExercises = [...prev];
      [newExercises[index], newExercises[index + 1]] = [newExercises[index + 1], newExercises[index]];
      return newExercises.map((ex, i) => ({ ...ex, order: i + 1 }));
    });
  };

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      try {
        setError(null);
        setLoading(true);
        const [data, exs] = await Promise.all([
          getWorkout(Number(id)),
          getExercises(),
        ]);
        setWorkout(data);
        setWorkoutName(data.name);
        setAllExercises(exs);
        setExercises(
          data.exercises.map((e) => ({
            exerciseId: e.exercise.id,
            exerciseName: e.exercise.name,
            order: e.order,
            sets: e.sets?.toString() ?? '',
            reps: e.reps?.toString() ?? '',
            durationSec: e.durationSec?.toString() ?? '',
            restSec: e.restSec?.toString() ?? '',
            notes: e.notes ?? '',
            circuitIndex: e.circuitIndex?.toString() ?? '',
            circuitOrder: e.circuitOrder?.toString() ?? '',
          }))
        );
      } catch (err: any) {
        setError(err.message || 'Erreur chargement séance');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  const filteredExercises = useMemo(() => {
    const q = exerciseQuery.trim().toLowerCase();
    if (!q) return allExercises;
    return allExercises.filter((e) =>
      e.name.toLowerCase().includes(q) ||
      (e.description ?? '').toLowerCase().includes(q)
    );
  }, [exerciseQuery, allExercises]);

  const parseNumber = (value: string): number | null => {
    const trimmed = value.trim();
    if (trimmed === '') return null;
    const num = Number(trimmed);
    return isNaN(num) ? null : num;
  };

  const handleSave = async () => {
    if (!id) return;
    if (!token) {
      setSaveError('Veuillez vous connecter pour sauvegarder la séance.');
      return;
    }
    if (!workoutName.trim()) {
      setSaveError('Le nom de la séance ne peut pas être vide.');
      return;
    }
    if (workoutName.trim().length < 3) {
      setSaveError('Le nom doit contenir au moins 3 caractères.');
      return;
    }
    try {
      setSaveError(null);
      setSaving(true);

      const payloadExercises: UpdateWorkoutExercisePayload[] = exercises
        .map((e) => ({
          exerciseId: e.exerciseId,
          order: Number(e.order) || 0,
          sets: parseNumber(e.sets),
          reps: parseNumber(e.reps),
          durationSec: parseNumber(e.durationSec),
          restSec: parseNumber(e.restSec),
          notes: e.notes || null,
          circuitIndex: parseNumber(e.circuitIndex),
          circuitOrder: parseNumber(e.circuitOrder),
        }))
        .sort((a, b) => a.order - b.order);

      const updated = await updateWorkout(
        Number(id),
        {
          name: workoutName,
          exercises: payloadExercises,
        },
        token
      );

      setWorkout(updated);
      // Force a hard reload to ensure sessions list reflects the new name
      window.location.assign('/workouts');
    } catch (err: any) {
      setSaveError(err.message || 'Impossible de sauvegarder la séance. Vérifiez votre connexion et réessayez.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout hideNav>
      {/* Hero / header */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-app-secondary p-4 sm:p-6 shadow-2xl border border-app">
        <div className="space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-app text-sm">
            <Link to="/workouts" className="hover:text-white inline-flex items-center gap-1">
              <ArrowLeftIcon className="w-4 h-4" /> Retour aux séances
            </Link>
            <span className="text-app-secondary">/</span>
            <span className="text-app font-semibold">Édition</span>
          </div>

          {/* Title and counter */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 text-xl sm:text-2xl font-bold bg-transparent text-app placeholder-app-secondary focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-2 py-1"
                value={workoutName}
                onChange={(e) => {
                  if (e.target.value.length <= 50) {
                    setWorkoutName(e.target.value);
                  }
                }}
                placeholder="Nom de la séance"
                maxLength={50}
              />
              <span className="text-xs text-app-secondary whitespace-nowrap">{workoutName.length}/50</span>
            </div>
            <p className="text-sm text-app-secondary">
              Personnalisez votre séance : nom, exercices, séries, répétitions et temps de repos.
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 text-xs text-app">
            <span className="px-3 py-1 rounded-full border border-primary bg-app-secondary">
              {exercises.length} exercice{exercises.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Action buttons - placed at the bottom on all screens */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 btn-primary px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60"
            >
              <CheckIcon className="w-4 h-4" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <Link
              to="/workouts"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 btn-secondary px-6 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" /> Retour
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-app-secondary border border-app rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-app rounded mb-2"></div>
                <div className="h-3 bg-app rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-app-secondary border border-app rounded-xl p-4">
            <p className="text-sm text-app">{error}</p>
          </div>
        )}

        {/* Save Error */}
        {saveError && (
          <div className="bg-app-secondary border border-app rounded-xl p-4">
            <p className="text-sm text-app">{saveError}</p>
          </div>
        )}

        {workout && !loading && (
          <>
            {/* Exercises Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-app">Exercices</h2>
                  <p className="text-sm text-app-secondary">Réorganisez les séries, répétitions, durées et repos.</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 btn-primary px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                  Ajouter
                </button>
              </div>

              {exercises.length === 0 ? (
                <div className="text-center py-12 bg-app-secondary border border-app rounded-xl">
                  <div className="w-16 h-16 bg-app rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bars3Icon className="w-8 h-8 text-app-secondary" />
                  </div>
                  <p className="text-app-secondary mb-2 font-medium">Aucun exercice</p>
                  <p className="text-xs text-app-secondary mb-4">Commencez par ajouter des exercices à votre séance</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Ajouter un exercice
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {exercises.map((e, index) => (
                    <ExerciseCard
                      key={`${e.exerciseId}-${index}`}
                      exercise={e}
                      index={index}
                      onChange={handleExerciseChange}
                      onRemove={() => handleRemoveExercise(index)}
                      onMoveUp={() => handleMoveExerciseUp(index)}
                      onMoveDown={() => handleMoveExerciseDown(index)}
                      isFirst={index === 0}
                      isLast={index === exercises.length - 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add Exercise Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-sm bg-app-secondary border border-app rounded-2xl p-6 shadow-2xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-app">Ajouter un exercice</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-app-secondary hover:text-app transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="relative mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-app-secondary" />
              <input
                className="w-full pl-10 pr-4 py-3 bg-app-secondary border border-app rounded-lg text-app placeholder-app-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Rechercher un exercice..."
                value={exerciseQuery}
                onChange={(e) => setExerciseQuery(e.target.value)}
              />
            </div>

            <div className="overflow-y-auto max-h-64 space-y-2">
              {filteredExercises.map((ex) => (
                <button
                  key={ex.id}
                  className="w-full text-left p-3 bg-app-secondary hover:bg-app border border-app rounded-lg transition-colors"
                  onClick={() => {
                    setExercises((prev) => [
                      ...prev,
                      {
                        exerciseId: ex.id,
                        exerciseName: ex.name,
                        order: (prev.at(-1)?.order ?? 0) + 1,
                        sets: '',
                        reps: '',
                        durationSec: '',
                        restSec: '',
                        notes: '',
                        circuitIndex: '',
                        circuitOrder: '',
                      },
                    ]);
                    setShowAddModal(false);
                    setExerciseQuery('');
                  }}
                >
                  <div className="font-medium text-app">{ex.name}</div>
                  {ex.description && (
                    <div className="text-sm text-app-secondary mt-1">{ex.description}</div>
                  )}
                </button>
              ))}
              {filteredExercises.length === 0 && (
                <p className="text-center text-app-secondary py-4">Aucun exercice trouvé</p>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EditWorkoutPage;
