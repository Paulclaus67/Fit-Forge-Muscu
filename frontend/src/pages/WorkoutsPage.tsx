// src/pages/WorkoutsPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { getWorkouts, getMyWorkouts, createWorkout, cloneWorkout } from '../api/workouts';
import type { Workout } from '../api/workouts';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PlusIcon, MagnifyingGlassIcon, DocumentDuplicateIcon, PlayIcon, PencilIcon } from '@heroicons/react/24/outline';

interface WorkoutCardProps {
  workout: Workout;
  kind: 'mine' | 'template';
  onDuplicate: (id: string) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, kind, onDuplicate }) => {
  const { token } = useAuth();

  return (
    <div className="group bg-app-secondary border border-app rounded-xl p-4 hover:bg-app transition-colors duration-200 shadow-sm hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link to={`/workouts/${workout.id}`} className="block">
            <h3 className="text-lg font-semibold text-app group-hover:text-primary transition-colors">
              {workout.name}
            </h3>
          </Link>
          {workout.description && (
            <p className="text-sm text-app-secondary mt-1 line-clamp-2">{workout.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className={`text-xs px-2 py-1 rounded-full border ${
            workout.type === 'CIRCUIT'
              ? 'border-app text-app bg-app-secondary'
              : 'border-app text-app bg-app-secondary'
          }`}>
            {workout.type === 'CIRCUIT' ? 'Circuit' : 'Simple'}
          </span>
          {kind === 'template' && (
            <span className="text-xs px-2 py-1 rounded-full border border-primary text-primary bg-app-secondary">
              Template
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        <Link
          to={`/workouts/${workout.id}/play`}
          className="flex items-center gap-2 btn-primary px-3 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          <PlayIcon className="w-4 h-4" />
          Lancer
        </Link>

        <Link
          to={`/workouts/${workout.id}`}
          className="flex items-center gap-2 btn-secondary px-3 py-2 rounded-lg text-sm transition-colors"
        >
          Détails
        </Link>

        {kind === 'mine' && (
          <Link
            to={`/workouts/${workout.id}/edit`}
            className="flex items-center gap-2 btn-secondary px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            Modifier
          </Link>
        )}

        {token && kind === 'template' && (
          <button
            onClick={() => onDuplicate(String(workout.id))}
            className="flex items-center gap-2 btn-secondary px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
            Cloner
          </button>
        )}
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

  return (
    <Layout>
      {/* Hero Header */}
      <div className="relative mb-6 overflow-hidden rounded-2xl bg-app-secondary p-6 shadow-2xl border border-app">
        <div>
          <h1 className="text-2xl font-bold text-app mb-2">Séances</h1>
          <p className="text-sm text-app-secondary mb-4">Consultez, modifiez, créez et lancez vos séances.</p>

          {/* Search and Create */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-app-secondary" />
              <input
                className="w-full pl-10 pr-4 py-3 bg-app-secondary border border-app rounded-xl text-sm text-app placeholder-app-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Rechercher une séance..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            {token && (
              <button
                onClick={() => { setNewName(''); setShowCreateModal(true); }}
                className="flex items-center gap-2 btn-primary px-4 py-3 rounded-xl font-semibold text-sm transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Créer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      {!query.trim() && (
        <div className="mb-6 flex gap-2 p-1 bg-app-secondary rounded-xl border border-app">
          {token && (
            <button
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                tab === 'mine'
                  ? 'bg-primary text-app'
                  : 'text-app-secondary hover:bg-app'
              }`}
              onClick={() => setTab('mine')}
            >
              Mes séances
            </button>
          )}
          <button
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
              tab === 'templates'
                ? 'bg-primary text-app'
                : 'text-app-secondary hover:bg-app'
            }`}
            onClick={() => setTab('templates')}
          >
            Templates
          </button>
        </div>
      )}

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
            <div>
              <h2 className="text-lg font-semibold text-app mb-4">Mes séances personnalisées</h2>
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
                    <WorkoutCard key={`mine-${w.id}`} workout={w} kind="mine" onDuplicate={handleDuplicate} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Templates */}
          {!query.trim() && tab === 'templates' && (
            <div>
              <h2 className="text-lg font-semibold text-app mb-4">Templates pré-configurés</h2>
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
                    <WorkoutCard key={`${kind}-${w.id}`} workout={w} kind={kind} onDuplicate={handleDuplicate} />
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
    </Layout>
  );
};

export default WorkoutsPage;
