// src/api/weeklyPlan.ts
import { api } from './client';

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface WeeklyPlanItem {
  id: number;
  dayOfWeek: DayOfWeek;
  order: number;
  label: string;
  isOptional: boolean;
  workout?: {
    id: number;
    name: string;
  } | null;
}

export interface WeeklyPlan {
  id: number;
  name: string;
  isActive: boolean;
  items: WeeklyPlanItem[];
}

export async function setupDefaultWeeklyPlan(token: string): Promise<WeeklyPlan> {
  return api.post<WeeklyPlan>('/weekly-plan/setup-default', {}, token);
}

export async function getWeeklyPlan(token: string): Promise<WeeklyPlan> {
  return api.get<WeeklyPlan>('/weekly-plan', token);
}

export interface WeeklyPlanItemUpdatePayload {
  workoutId?: number | null;
  label?: string;
  isOptional?: boolean;
}

export async function updateWeeklyPlanItem(
  id: number,
  payload: WeeklyPlanItemUpdatePayload,
  token: string
): Promise<WeeklyPlanItem> {
  return api.put<WeeklyPlanItem>(`/weekly-plan/items/${id}`, payload, token);
}
