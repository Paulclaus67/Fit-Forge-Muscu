// src/pages/ExercisesPage.tsx
import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { getExercises } from '../api/exercises';
import type { Exercise } from '../api/exercises';
import { Link } from 'react-router-dom';

const muscleLabel: Record<string, string> = {
  CHEST: 'Pecs',
  BACK: 'Dos',
  LEGS: 'Jambes',
  SHOULDERS: 'Épaules',
  BICEPS: 'Biceps',
  TRICEPS: 'Triceps',
  CORE: 'Gainage',
  GLUTES: 'Fessiers',
  FULL_BODY: 'Full body',
  OTHER: 'Autre',
};

const difficultyLabel: Record<string, string> = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
};

const ExercisesPage: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await getExercises();
        setExercises(data);
      } catch (err: any) {
        setError(err.message || 'Erreur chargement exercices');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <Layout>
      <h1 className="text-lg font-semibold text-app mb-3">Tous les exercices</h1>
      {loading && <p className="text-sm text-app-secondary">Chargement...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-2">
        {exercises.map((ex) => {
          const primaryMuscle = ex.muscles.find((m) => m.isPrimary);
          return (
            <Link
              key={ex.id}
              to={`/exercises/${ex.id}`}
              className="block bg-app-secondary border border-app rounded-lg p-3 text-sm text-app hover:bg-app-secondary transition-colors shadow-sm"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{ex.name}</span>
                {ex.difficulty && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full border border-app text-app-secondary bg-app-secondary">
                    {difficultyLabel[ex.difficulty] ?? ex.difficulty}
                  </span>
                )}
              </div>
              <div className="text-xs text-app-secondary flex justify-between">
                <span>
                  {primaryMuscle
                    ? muscleLabel[primaryMuscle.group] ?? primaryMuscle.group
                    : 'Muscles divers'}
                </span>
                {ex.equipment && <span>{ex.equipment}</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </Layout>
  );
};

export default ExercisesPage;
