// src/pages/WorkoutsPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { getWorkouts, getMyWorkouts, createWorkout, cloneWorkout, deleteWorkout } from '../api/workouts';
import type { Workout } from '../api/workouts';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, MagnifyingGlassIcon, DocumentDuplicateIcon, PlayIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

interface WorkoutCardProps {
  workout: Workout;
  kind: 'mine' | 'template';
  onDuplicate: (id: string) => void;
  onDelete?: (id: string) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, kind, onDuplicate, onDelete }) => {
  const { token } = useAuth();
  const exerciseCount = workout.exercises?.length ?? null;
  const metaParts = [workout.type === 'CIRCUIT' ? 'Circuit' : 'Simple'];
  if (exerciseCount) {
    metaParts.push(`${exerciseCount} exos`);
  }

  return (
    <div className="group rounded-2xl border border-app bg-app-secondary/80 p-4 shadow-sm hover:shadow-md hover:border-primary/50 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1">
          <Link to={`/workouts/${workout.id}`} className="block">
            <h3 className="text-lg font-semibold text-app group-hover:text-primary transition-colors">
              {workout.name}
            </h3>
          </Link>
          <p className="text-[12px] text-app-secondary">
            {metaParts.join(' · ')}
          </p>
          {workout.description && (
            <p className="text-sm text-app-secondary line-clamp-2">{workout.description}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[11px] px-2 py-1 rounded-full border border-app text-app bg-app">
            {workout.type === 'CIRCUIT' ? 'Circuit' : 'Simple'}
          </span>
          {kind === 'template' && (
            <span className="text-[11px] px-2 py-1 rounded-full border border-primary/60 text-primary bg-primary/10">
              Template
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <Link
          to={`/workouts/${workout.id}/play`}
          className="w-full flex items-center justify-center gap-2 btn-primary px-4 py-2.5 rounded-lg font-semibold text-sm shadow-md"
        >
          <PlayIcon className="w-4 h-4" />
          Lancer la séance
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-[12px] text-app-secondary">
          {kind === 'mine' && (
            <Link
              to={`/workouts/${workout.id}/edit`}
              className="px-3 py-2 rounded-lg border border-app text-app text-sm hover:border-primary/40 hover:text-primary transition-colors"
            >
              <PencilIcon className="w-4 h-4 inline" /> Modifier
            </Link>
          )}

          <Link to={`/workouts/${workout.id}`} className="hover:text-primary transition-colors">
            Détails
          </Link>

          {kind === 'mine' && onDelete && (
            <button
              onClick={() => onDelete(String(workout.id))}
              className="text-red-500 hover:text-red-400 transition-colors"
              title="Supprimer la séance"
            >
              <TrashIcon className="w-4 h-4 inline" /> Supprimer
            </button>
          )}

          {token && kind === 'template' && (
            <button
              onClick={() => onDuplicate(String(workout.id))}
              className="text-app hover:text-primary transition-colors"
            >
              <DocumentDuplicateIcon className="w-4 h-4 inline" /> Cloner
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const WorkoutsPage: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]); // templates (ownerId = null)
  const [myWorkouts, setMyWorkouts] = useState<Workout[]>([]); // personal
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'mine' | 'templates'>(token ? 'mine' : 'templates');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);
        setLoading(true);
        const [templates, mine] = await Promise.all([
          getWorkouts(),
          token ? getMyWorkouts(token) : Promise.resolve([] as Workout[]),
        ]);
        setWorkouts(templates);
        setMyWorkouts(mine);
      } catch (err: any) {
        setError(err.message || 'Erreur chargement séances');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token]);

  const filteredMine = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return myWorkouts;
    return myWorkouts.filter((w) =>
      w.name.toLowerCase().includes(q) || (w.description ?? '').toLowerCase().includes(q)
    );
  }, [query, myWorkouts]);

  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return workouts;
    return workouts.filter((w) =>
      w.name.toLowerCase().includes(q) || (w.description ?? '').toLowerCase().includes(q)
    );
  }, [query, workouts]);

  const combinedResults = useMemo(() => {
    const results: Array<{ kind: 'mine' | 'template'; w: Workout }> = [];
    if (token) {
      results.push(...filteredMine.map((w) => ({ kind: 'mine' as const, w })));
    }
    results.push(...filteredTemplates.map((w) => ({ kind: 'template' as const, w })));
    return results;
  }, [filteredMine, filteredTemplates, token]);

  const handleCreate = async () => {
    if (!token || !newName.trim()) return;
    if (newName.trim().length < 3) {
      alert('Le nom doit contenir au moins 3 caractères');
      return;
    }
    try {
      await createWorkout({ name: newName.trim() }, token);
      setShowCreateModal(false);
      setNewName('');
      const [templates, mine] = await Promise.all([
        getWorkouts(),
        getMyWorkouts(token),
      ]);
      setWorkouts(templates);
      setMyWorkouts(mine);
      setTab('mine');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la création de la séance. Veuillez réessayer.');
    }
  };

  async function handleDuplicate(workoutId: string) {
    if (!token) return;
    try {
      await cloneWorkout(Number(workoutId), token);
      const [templates, mine] = await Promise.all([
        getWorkouts(),
        getMyWorkouts(token),
      ]);
      setWorkouts(templates);
      setMyWorkouts(mine);
      setTab('mine');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la duplication de la séance. Veuillez réessayer.');
    }
  }

  function handleDelete(workoutId: string) {
    if (!token) return;
    const workout = myWorkouts.find(w => w.id === Number(workoutId));
    if (!workout) return;
    
    setWorkoutToDelete(workout);
    setShowDeleteDialog(true);
  }

  async function confirmDelete() {
    if (!token || !workoutToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteWorkout(workoutToDelete.id, token);
      const [templates, mine] = await Promise.all([
        getWorkouts(),
        getMyWorkouts(token),
      ]);
      setWorkouts(templates);
      setMyWorkouts(mine);
      setShowDeleteDialog(false);
      setWorkoutToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression de la séance. Veuillez réessayer.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Layout>
      <div className="space-y-5">
        {/* Header compact */}
        <div className="rounded-2xl border border-app bg-app-secondary/70 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.14em] text-app-secondary">Séances</p>
              <h1 className="text-xl font-semibold text-app">Crée, modifie et lance tes séances</h1>
              <p className="text-sm text-app-secondary">Mode gestion pour organiser, mode action pour lancer direct.</p>
            </div>
            {token && (
              <button
                onClick={() => { setNewName(''); setShowCreateModal(true); }}
                className="flex items-center gap-2 btn-primary px-4 py-2 rounded-lg font-semibold text-sm shadow-md"
              >
                <PlusIcon className="w-4 h-4" />
                Créer
              </button>
            )}
          </div>

          <div className="relative mt-3">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-app-secondary" />
            <input
              className="w-full pl-10 pr-4 py-3 bg-app border border-app rounded-xl text-sm text-app placeholder-app-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Rechercher une séance..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-app-secondary/70 rounded-xl border border-app shadow-sm">
          {token && (
            <button
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-colors ${
                tab === 'mine'
                  ? 'bg-primary text-app shadow-primary/20 shadow'
                  : 'text-app-secondary hover:bg-app'
              }`}
              onClick={() => setTab('mine')}
            >
              Mes séances
            </button>
          )}
          <button
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-colors ${
              tab === 'templates'
                ? 'bg-primary text-app shadow-primary/20 shadow'
                : 'text-app-secondary hover:bg-app'
            }`}
            onClick={() => setTab('templates')}
          >
            Templates
          </button>
        </div>
      </div>

      {/* Loading State */}
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

      {/* Error State */}
      {error && (
        <div className="bg-app-secondary border border-app rounded-xl p-4">
          <p className="text-sm text-app">{error}</p>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {/* My Workouts */}
          {!query.trim() && tab === 'mine' && token && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-app mb-4">Mes séances perso</h2>
              {filteredMine.length === 0 ? (
                <div className="text-center py-12 bg-app-secondary border border-app rounded-xl">
                  <div className="w-16 h-16 bg-app rounded-full flex items-center justify-center mx-auto mb-4">
                    <DocumentDuplicateIcon className="w-8 h-8 text-app-secondary" />
                  </div>
                  <p className="text-app-secondary mb-4">Aucune séance personnelle</p>
                  <button
                    onClick={() => { setNewName(''); setShowCreateModal(true); }}
                    className="btn-primary px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Créer ma première séance
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 text-app">
                  {filteredMine.map((w) => (
                    <WorkoutCard key={`mine-${w.id}`} workout={w} kind="mine" onDuplicate={handleDuplicate} onDelete={handleDelete} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Templates */}
          {!query.trim() && tab === 'templates' && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold text-app mb-4">Templates de base</h2>
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-app-secondary">Aucune séance classique trouvée</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredTemplates.map((w) => (
                    <WorkoutCard key={`tpl-${w.id}`} workout={w} kind="template" onDuplicate={handleDuplicate} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search Results */}
          {query.trim() && (
            <div>
              <h2 className="text-lg font-semibold text-app mb-4">Résultats de recherche</h2>
              {combinedResults.length === 0 ? (
                <div className="text-center py-12">
                  <MagnifyingGlassIcon className="w-16 h-16 text-app-secondary mx-auto mb-4" />
                  <p className="text-app-secondary">Aucun résultat pour "{query}"</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {combinedResults.map(({ kind, w }) => (
                    <WorkoutCard key={`${kind}-${w.id}`} workout={w} kind={kind} onDuplicate={handleDuplicate} onDelete={kind === 'mine' ? handleDelete : undefined} />
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-sm bg-app-secondary border border-app rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <PlusIcon className="w-5 h-5 text-app" />
              </div>
              <h2 className="text-lg font-semibold text-app">Nouvelle séance</h2>
            </div>
            <label className="block text-sm text-app-secondary mb-2">
              Nom de la séance
              <span className="text-xs text-app-secondary ml-2">({newName.length}/50)</span>
            </label>
            <input
              className="w-full px-4 py-3 bg-app-secondary border border-app rounded-xl text-app placeholder-app-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              value={newName}
              onChange={(e) => {
                if (e.target.value.length <= 50) {
                  setNewName(e.target.value);
                }
              }}
              placeholder="Ex: Full Body du lundi"
              autoFocus
              maxLength={50}
            />
            <div className="mt-6 flex gap-3">
              <button
                className="flex-1 btn-secondary py-3 rounded-xl font-medium transition-colors"
                onClick={() => setShowCreateModal(false)}
              >
                Annuler
              </button>
              <button
                className="flex-1 btn-primary py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newName.trim()}
                onClick={handleCreate}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        title="Supprimer cette séance ?"
        description={
          workoutToDelete
            ? `Êtes-vous sûr de vouloir supprimer définitivement la séance "${workoutToDelete.name}" ? Cette action est irréversible.`
            : "Êtes-vous sûr de vouloir supprimer cette séance ?"
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        tone="danger"
        isConfirming={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setShowDeleteDialog(false);
            setWorkoutToDelete(null);
          }
        }}
        onConfirm={confirmDelete}
      />
    </Layout>
  );
};

export default WorkoutsPage;
