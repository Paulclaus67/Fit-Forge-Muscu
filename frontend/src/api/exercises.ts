// src/api/exercises.ts
import { api } from './client';

export interface ExerciseMuscle {
  exerciseId: number;
  group: string; // MuscleGroup enum côté backend
  isPrimary: boolean;
}

export interface Exercise {
  id: number;
  name: string;
  description: string | null;
  instructions: string | null;
  difficulty: string | null;
  equipment: string | null;
  muscles: ExerciseMuscle[];
}

export async function getExercises(): Promise<Exercise[]> {
  return api.get<Exercise[]>('/exercises');
}

export async function getExercise(id: number): Promise<Exercise> {
  return api.get<Exercise>(`/exercises/${id}`);
}
