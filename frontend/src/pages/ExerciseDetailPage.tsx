// src/pages/ExerciseDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useParams } from 'react-router-dom';
import { getExercise } from '../api/exercises';
import type { Exercise } from '../api/exercises';

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

const ExerciseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const run = async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await getExercise(Number(id));
        setExercise(data);
      } catch (err: any) {
        setError(err.message || "Erreur chargement de l'exercice");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

  return (
    <Layout>
      {loading && <p className="text-sm text-app-secondary">Chargement...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {exercise && (
        <div className="space-y-3">
          <h1 className="text-lg font-semibold text-app">{exercise.name}</h1>

          <div className="flex flex-wrap gap-2 text-[10px]">
            {exercise.difficulty && (
              <span className="px-2 py-1 rounded-full border border-app text-app-secondary bg-app-secondary">
                {difficultyLabel[exercise.difficulty] ?? exercise.difficulty}
              </span>
            )}
            {exercise.equipment && (
              <span className="px-2 py-1 rounded-full border border-app text-app-secondary bg-app-secondary">
                Matériel : {exercise.equipment}
              </span>
            )}
          </div>

          <div className="text-xs text-app-secondary space-y-1">
            <h2 className="font-semibold text-app">Muscles travaillés</h2>
            {exercise.muscles.length === 0 && <p>Non renseigné.</p>}
            {exercise.muscles.length > 0 && (
              <ul className="list-disc list-inside space-y-0.5">
                {exercise.muscles.map((m) => (
                  <li key={`${m.exerciseId}-${m.group}`}>
                    {muscleLabel[m.group] ?? m.group}{' '}
                    {m.isPrimary && (
                      <span className="text-[10px] text-emerald-400">
                        (principal)
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {exercise.description && (
            <div className="text-xs text-app-secondary space-y-1">
              <h2 className="font-semibold text-app">Description</h2>
              <p>{exercise.description}</p>
            </div>
          )}

          {exercise.instructions && (
            <div className="text-xs text-app-secondary space-y-1">
              <h2 className="font-semibold text-app">
                Consignes d&apos;exécution
              </h2>
              <p>{exercise.instructions}</p>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default ExerciseDetailPage;
