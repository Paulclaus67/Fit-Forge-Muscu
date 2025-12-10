// src/api/workouts.ts
import { api } from './client';

export interface Workout {
  id: number;
  name: string;
  description: string | null;
  type: 'SIMPLE' | 'CIRCUIT';
  isPublic: boolean;
  ownerId?: number | null; // pour le détail
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string | null;
  exercises?: WorkoutExercise[]; // optionnel sur /mine
}

export interface WorkoutExercise {
  id?: number;
  order: number;
  sets: number | null;
  reps: number | null;
  durationSec: number | null;
  restSec: number | null;
  notes: string | null;
  circuitIndex: number | null;
  circuitOrder: number | null;
  exercise: {
    id: number;
    name: string;
    description: string | null;
    difficulty: string | null;
  };
}

export interface WorkoutDetail extends Workout {
  exercises: WorkoutExercise[];
}

export async function getWorkouts(): Promise<Workout[]> {
  return api.get<Workout[]>('/workouts');
}

export async function getWorkout(id: number): Promise<WorkoutDetail> {
  return api.get<WorkoutDetail>(`/workouts/${id}`);
}

export async function getMyWorkouts(token: string): Promise<Workout[]> {
  return api.get<Workout[]>('/workouts/mine', token);
}

export async function cloneWorkout(
  id: number,
  token: string,
  name?: string
): Promise<WorkoutDetail> {
  return api.post<WorkoutDetail>(
    `/workouts/${id}/clone`,
    name ? { name } : {},
    token
  );
}

export interface UpdateWorkoutExercisePayload {
  exerciseId: number;
  order: number;
  sets?: number | null;
  reps?: number | null;
  durationSec?: number | null;
  restSec?: number | null;
  notes?: string | null;
  circuitIndex?: number | null;
  circuitOrder?: number | null;
}

export interface UpdateWorkoutPayload {
  name?: string;
  description?: string | null;
  type?: 'SIMPLE' | 'CIRCUIT';
  exercises?: UpdateWorkoutExercisePayload[];
}

export async function updateWorkout(
  id: number,
  payload: UpdateWorkoutPayload,
  token: string
): Promise<WorkoutDetail> {
  return api.put<WorkoutDetail>(`/workouts/${id}`, payload, token);
}

export interface CreateWorkoutPayload {
  name: string;
  description?: string | null;
  type?: 'SIMPLE' | 'CIRCUIT';
  exercises?: UpdateWorkoutExercisePayload[];
}

export async function createWorkout(
  payload: CreateWorkoutPayload,
  token: string
): Promise<WorkoutDetail> {
  return api.post<WorkoutDetail>('/workouts', payload, token);
}

export async function deleteWorkout(id: number, token: string): Promise<void> {
  return api.delete<void>(`/workouts/${id}`, token);
}
