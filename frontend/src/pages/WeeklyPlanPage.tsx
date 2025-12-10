// src/pages/WeeklyPlanPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import type {
  WeeklyPlan,
  DayOfWeek,
  WeeklyPlanItem,
} from '../api/weeklyPlan';
import {
  getWeeklyPlan,
  updateWeeklyPlanItem,
} from '../api/weeklyPlan';
import {
  getWorkouts,
  getMyWorkouts,
} from '../api/workouts';
import type { Workout } from '../api/workouts';
import { useAuth } from '../context/AuthContext';
import {
  PlayIcon,
  CalendarDaysIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

const dayLabel: Record<DayOfWeek, string> = {
  MONDAY: 'Lundi',
  TUESDAY: 'Mardi',
  WEDNESDAY: 'Mercredi',
  THURSDAY: 'Jeudi',
  FRIDAY: 'Vendredi',
  SATURDAY: 'Samedi',
  SUNDAY: 'Dimanche',
};

const dayOrder: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

const WeeklyPlanPage: React.FC = () => {
  const { token } = useAuth();
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingItemId, setSavingItemId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState<DayOfWeek>('MONDAY');

  const [templates, setTemplates] = useState<Workout[]>([]);
  const [mine, setMine] = useState<Workout[]>([]);

  const today = useMemo<DayOfWeek>(() => {
    const jsDay = new Date().getDay();
    if (jsDay === 0) return 'SUNDAY';
    if (jsDay === 1) return 'MONDAY';
    if (jsDay === 2) return 'TUESDAY';
    if (jsDay === 3) return 'WEDNESDAY';
    if (jsDay === 4) return 'THURSDAY';
    if (jsDay === 5) return 'FRIDAY';
    return 'SATURDAY';
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchAll = async () => {
      try {
        setError(null);
        setLoading(true);

        const [planRes, templatesRes, mineRes] = await Promise.all([
          getWeeklyPlan(token),
          getWorkouts(),
          getMyWorkouts(token),
        ]);

        setPlan(planRes);
        setTemplates(templatesRes);
        setMine(mineRes);
      } catch (err: any) {
        setError(err.message || 'Erreur chargement planning');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  const itemsByDay = useMemo(() => {
    if (!plan) return {} as Record<DayOfWeek, WeeklyPlanItem[]>;
    const grouped: Record<DayOfWeek, WeeklyPlanItem[]> = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    };
    for (const item of plan.items) {
      const label = (item.label || '').toLowerCase();
      const isStretching = label.includes('étirement') || label.includes('etirement') || label.includes('stretch');
      const isWarmup = label.includes('échauffement') || label.includes('echauffement') || label.includes('poirier');
      if (isStretching) continue; // Ne pas afficher la partie étirement
      if (isWarmup) continue; // Les échauffements sont affichés séparément
      grouped[item.dayOfWeek].push(item);
    }
    for (const day of dayOrder) {
      grouped[day].sort((a, b) => a.order - b.order);
    }
    return grouped;
  }, [plan]);

  const warmupsByDay = useMemo(() => {
    if (!plan) return {} as Record<DayOfWeek, WeeklyPlanItem[]>;
    const grouped: Record<DayOfWeek, WeeklyPlanItem[]> = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    };
    for (const item of plan.items) {
      const label = (item.label || '').toLowerCase();
      const isWarmup = label.includes('échauffement') || label.includes('echauffement') || label.includes('poirier');
      if (isWarmup) {
        grouped[item.dayOfWeek].push(item);
      }
    }
    for (const day of dayOrder) {
      grouped[day].sort((a, b) => a.order - b.order);
    }
    return grouped;
  }, [plan]);

  const handleChangeWorkout = async (itemId: number, value: string) => {
    if (!token || !plan) return;
    try {
      setSavingItemId(itemId);
      const workoutId = value === '' ? null : Number(value);

      const updatedItem = await updateWeeklyPlanItem(
        itemId,
        { workoutId },
        token
      );

      // On met à jour localement le plan
      setPlan((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.map((it) =>
            it.id === itemId ? { ...it, ...updatedItem } : it
          ),
        };
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du planning');
    } finally {
      setSavingItemId(null);
    }
  };

  const activeMain = itemsByDay[activeDay] ?? [];
  const activeWarmups = warmupsByDay[activeDay] ?? [];

  const weeklySummary = useMemo(
    () =>
      dayOrder.map((day) => {
        const mainLabel = itemsByDay[day]?.[0]?.label ?? null;
        const warmupLabel = warmupsByDay[day]?.[0]?.label ?? null;
        const label = mainLabel || warmupLabel || 'Repos';
        const hasContent = (itemsByDay[day]?.length ?? 0) + (warmupsByDay[day]?.length ?? 0) > 0;

        return {
          day,
          label,
          hasContent,
        };
      }),
    [itemsByDay, warmupsByDay]
  );

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header allégé */}
        <div className="rounded-2xl border border-app bg-app-secondary/70 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.14em] text-app-secondary">Planning hebdo</p>
              <h1 className="text-xl font-semibold text-app">Vue mobile · 7 jours</h1>
              <p className="text-sm text-app-secondary">Voir ta semaine et lancer la séance du jour sans scroll.</p>
            </div>
            <span className="px-3 py-1 rounded-full border border-app text-[11px] text-app bg-app shadow-inner">Hebdo</span>
          </div>
        </div>

        {/* Sélecteur de jours en pills */}
        <div className="sticky top-4 z-10 backdrop-blur">
          <div className="flex items-center gap-2 text-[11px] text-app-secondary mb-2 px-1">
            <CalendarDaysIcon className="w-4 h-4" />
            <span>Ta semaine en un coup d’œil</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-3 px-1 no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
            {dayOrder.map((day) => {
              const hasContent = (itemsByDay[day]?.length ?? 0) + (warmupsByDay[day]?.length ?? 0) > 0;
              const isActive = activeDay === day;
              const isToday = day === today;

              return (
                <button
                  key={`tab-${day}`}
                  onClick={() => setActiveDay(day)}
                  className={`relative shrink-0 rounded-full border px-3.5 py-2 text-sm font-semibold transition-all duration-200 shadow-sm min-w-[72px] ${
                    isActive
                      ? 'bg-primary text-app border-primary shadow-primary/30'
                      : 'bg-app-secondary/70 text-app border-app hover:border-primary/50 hover:text-primary'
                  } ${isToday && !isActive ? 'ring-1 ring-primary/50' : ''}`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>{dayLabel[day].slice(0, 3)}</span>
                    <span className={`h-2 w-2 rounded-full ${hasContent ? 'bg-primary' : 'bg-app-secondary'}`} aria-hidden />
                  </span>
                  {isToday && isActive && (
                    <span className="absolute -top-2 right-2 text-[10px] rounded-full bg-app text-app-secondary px-2 py-0.5 border border-primary/40">Aujourd’hui</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-app-secondary border border-app rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-app-secondary rounded mb-2"></div>
                <div className="h-3 bg-app-secondary rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100/50 border border-red-300 rounded-xl p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Content */}
        {plan && !loading && (
          <>
            <section className="rounded-2xl border border-app bg-app-secondary/70 p-4 shadow-sm space-y-4">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.12em] text-app-secondary">{dayLabel[activeDay]}</p>
                  <h2 className="text-lg font-semibold text-app">Programme du jour</h2>
                  <p className="text-xs text-app-secondary">
                    {activeMain.length === 0 && activeWarmups.length === 0
                      ? 'Rien de prévu pour ce jour. Tu peux associer une séance.'
                      : `${activeMain.length} séance${activeMain.length > 1 ? 's' : ''} · ${activeWarmups.length} échauffement${activeWarmups.length > 1 ? 's' : ''}`}
                  </p>
                </div>
                {activeDay === today && (
                  <span className="px-2 py-1 rounded-full border border-primary/50 text-[11px] text-primary bg-primary/10">Aujourd’hui</span>
                )}
              </div>

              {activeWarmups.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {activeWarmups.map((wu) => (
                    <span
                      key={`wu-${wu.id}`}
                      className="px-2.5 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-[11px] text-primary font-semibold"
                    >
                      <FireIcon className="w-3 h-3 inline" /> {wu.label}
                    </span>
                  ))}
                </div>
              )}

              {activeMain.length === 0 && activeWarmups.length === 0 ? (
                <div className="text-center py-8 px-4 bg-app/60 border border-app rounded-xl shadow-inner">
                  <div className="w-12 h-12 bg-app text-app rounded-full flex items-center justify-center mx-auto mb-2 shadow">
                    <CalendarDaysIcon className="w-7 h-7" />
                  </div>
                  <p className="text-app font-semibold">Jour de repos</p>
                  <p className="text-xs text-app-secondary">Associe une séance ou laisse ce jour off.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeMain.map((item) => (
                    <div key={item.id} className="rounded-xl border border-app bg-app p-3 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold text-app flex items-center gap-2">
                            {item.label}
                            {item.isOptional && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full border border-app text-app-secondary">Facultatif</span>
                            )}
                          </h3>
                          <p className="text-[11px] text-app-secondary">
                            {item.workout ? `Séance associée : ${item.workout.name}` : 'Pas de séance associée pour ce créneau'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">
                        <label className="text-[11px] font-medium text-app-secondary block">Séance associée</label>
                        <select
                          className="w-full px-3 py-2 bg-app-secondary/60 border border-app rounded-lg text-sm text-app focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
                          value={item.workout?.id ?? ''}
                          onChange={(e) => handleChangeWorkout(item.id, e.target.value)}
                          disabled={savingItemId === item.id}
                        >
                          <option value="">Aucune séance</option>

                          {templates.length > 0 && (
                            <optgroup label="Séances classiques">
                              {templates.map((w) => (
                                <option key={`t-${w.id}`} value={w.id}>
                                  {w.name}
                                </option>
                              ))}
                            </optgroup>
                          )}

                          {mine.length > 0 && (
                            <optgroup label="Mes séances personnelles">
                              {mine.map((w) => (
                                <option key={`m-${w.id}`} value={w.id}>
                                  {w.name}
                                </option>
                              ))}
                            </optgroup>
                          )}
                        </select>

                        {item.workout && (
                          <button
                            onClick={() => window.location.href = `/workouts/${item.workout!.id}/play`}
                            className="w-full flex items-center justify-center gap-2 btn-primary px-4 py-2.5 rounded-lg font-semibold text-sm shadow-md"
                          >
                            <PlayIcon className="w-4 h-4" />
                            Lancer la séance
                          </button>
                        )}

                        {savingItemId === item.id && (
                          <p className="text-[11px] text-primary text-center">Sauvegarde en cours...</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-app bg-app-secondary/70 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-app-secondary">Cette semaine</p>
                  <h3 className="text-base font-semibold text-app">Vue condensée</h3>
                </div>
              </div>
              <ul className="divide-y divide-app/60">
                {weeklySummary.map(({ day, label, hasContent }) => (
                  <li key={day} className="flex items-center justify-between py-2.5">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-app w-10">{dayLabel[day].slice(0, 3)}</span>
                      <span className="text-sm text-app-secondary">{label}</span>
                    </span>
                    <span className={`h-2.5 w-2.5 rounded-full ${hasContent ? 'bg-primary' : 'bg-app-secondary'}`} aria-hidden />
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default WeeklyPlanPage;
