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
  MagnifyingGlassIcon,
  PlayIcon,
  CalendarDaysIcon,
  SparklesIcon,
  FireIcon,
  ChevronRightIcon,
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
  const [query, setQuery] = useState('');
  const [activeDay, setActiveDay] = useState<DayOfWeek>('MONDAY');

  const [templates, setTemplates] = useState<Workout[]>([]);
  const [mine, setMine] = useState<Workout[]>([]);

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
    // Filter by query on label
    const q = query.trim().toLowerCase();
    if (q) {
      for (const d of dayOrder) {
        grouped[d] = grouped[d].filter((it) =>
          it.label.toLowerCase().includes(q)
        );
      }
    }
    return grouped;
  }, [plan, query]);

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
    // Apply query filter
    const q = query.trim().toLowerCase();
    if (q) {
      for (const d of dayOrder) {
        grouped[d] = grouped[d].filter((it) => it.label.toLowerCase().includes(q));
      }
    }
    return grouped;
  }, [plan, query]);

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

  return (
    <Layout>
      {/* Hero Header */}
      <div className="relative mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-app-secondary to-app p-4 shadow-xl border border-app/80">
        <div className="absolute inset-0 pointer-events-none" aria-hidden />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold text-primary bg-app-secondary/70 px-2.5 py-1 rounded-full border border-primary/30">
              <SparklesIcon className="w-4 h-4" />
              Planning mobile
            </p>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-app">Planning Hebdomadaire</h1>
              <span className="text-[11px] px-2 py-1 rounded-full border border-app text-app-secondary bg-app/70">vue compacte</span>
            </div>
            <p className="text-xs text-app-secondary">Accède vite à l’info, moins de scroll.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-app-secondary">
            <span className="px-3 py-2 rounded-lg border border-app bg-app text-app font-semibold shadow-inner">7 jours</span>
            <span className="px-3 py-2 rounded-lg border border-primary/40 bg-primary/10 text-primary font-semibold flex items-center gap-1">
              <FireIcon className="w-4 h-4" /> routine complète
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mt-4 group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur pointer-events-none" />
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary transition-colors duration-200 group-focus-within:text-primary" />
          <input
            className="w-full pl-12 pr-4 py-3 bg-gradient-to-br from-app-secondary/80 to-app-secondary/60 border border-app/60 rounded-2xl text-sm text-app placeholder-app-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/30 transition-all backdrop-blur-sm shadow-lg hover:border-primary/30 hover:bg-gradient-to-br hover:from-app-secondary hover:to-app-secondary/70"
            placeholder="Rechercher une séance..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Day Tabs */}
      <div className="mb-4 space-y-2 sticky top-4 z-10 backdrop-blur">
        <div className="flex items-center justify-between px-1 text-[11px] text-app-secondary">
          <div className="flex items-center gap-2">
            <CalendarDaysIcon className="w-4 h-4" />
            <span>Vue planning rapide</span>
          </div>
          <span className="px-2 py-1 rounded-full border border-app text-app-secondary bg-app-secondary/70">
            {(plan?.items.length ?? 0)} créneau{(plan?.items.length ?? 0) > 1 ? 'x' : ''}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 pt-1 px-2 no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
          {dayOrder.map((day) => {
            const mainCount = itemsByDay[day]?.length ?? 0;
            const warmupCount = warmupsByDay[day]?.length ?? 0;

            return (
              <button
                key={`tab-${day}`}
                onClick={() => setActiveDay(day)}
                className={`min-w-[120px] shrink-0 rounded-2xl border px-3 py-3 text-left transition-all duration-300 shadow-sm group/day ${
                  activeDay === day
                    ? 'bg-gradient-to-br from-primary/95 to-primary/80 text-app border-primary shadow-lg shadow-primary/40'
                    : 'bg-gradient-to-br from-app-secondary/70 to-app-secondary/50 border-app/70 text-app hover:border-primary/50 hover:shadow-md hover:from-app-secondary/80 hover:to-app-secondary/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className={`text-sm font-bold leading-tight transition-colors ${activeDay === day ? 'text-app' : 'text-app group-hover/day:text-primary'}`}>{dayLabel[day]}</div>
                  <ChevronRightIcon className={`w-4 h-4 transition-transform ${activeDay === day ? 'rotate-90' : ''}`} />
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] flex-wrap">
                  <span className={`px-2.5 py-1 rounded-full border font-medium ${
                    activeDay === day
                      ? 'border-app/30 bg-app/25 text-app'
                      : 'border-app/50 text-app-secondary bg-app/10 group-hover/day:border-primary/30 group-hover/day:text-primary group-hover/day:bg-primary/5'
                  }`}>{mainCount} séance{mainCount > 1 ? 's' : ''}</span>
                  {warmupCount > 0 && (
                    <span className={`px-2.5 py-1 rounded-full text-[10px] flex items-center gap-1 font-medium border ${
                      activeDay === day ? 'bg-app/25 text-app border-app/30' : 'bg-primary/10 text-primary border-primary/40 group-hover/day:border-primary/60'
                    }`}>
                      <FireIcon className="w-3 h-3" />
                      {warmupCount}
                    </span>
                  )}
                </div>
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
        <div className="space-y-6">
          {dayOrder.map((day) => (
            <section
              key={day}
              className={`${activeDay === day ? '' : 'hidden'} transition-all duration-200`}
            >
              <div className="mb-3 flex items-center justify-between gap-3 bg-app-secondary/70 border border-app rounded-xl p-3 shadow-sm backdrop-blur">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-app-secondary">{dayLabel[day]}</p>
                  <h2 className="text-base font-semibold text-app mt-0.5">Ton programme du jour</h2>
                  <p className="text-xs text-app-secondary">
                    {itemsByDay[day].length === 0 && warmupsByDay[day].length === 0
                      ? 'Aucune séance prévue ce jour'
                      : `${itemsByDay[day].length} séance${itemsByDay[day].length > 1 ? 's' : ''} programmée${itemsByDay[day].length > 1 ? 's' : ''}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-app-secondary">
                  <span className="px-2.5 py-1.5 rounded-lg border border-app bg-app text-app font-semibold shadow-inner">
                    {itemsByDay[day].length + warmupsByDay[day].length} bloc{(itemsByDay[day].length + warmupsByDay[day].length) > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Warmups Section */}
              {warmupsByDay[day].length > 0 && (
                <div className="mb-3 bg-app-secondary/70 border border-primary/40 rounded-xl p-3 shadow-sm backdrop-blur">
                  <h3 className="text-xs font-semibold text-primary mb-2 flex items-center gap-2">
                    <FireIcon className="w-4 h-4" />
                    Échauffements
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {warmupsByDay[day].map((wu) => (
                      <span
                        key={`wu-${wu.id}`}
                        className="px-2.5 py-1.5 rounded-lg border border-primary/30 bg-primary/10 text-[11px] text-primary font-semibold"
                      >
                        {wu.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Workouts */}
              {itemsByDay[day].length === 0 && warmupsByDay[day].length === 0 ? (
                <div className="text-center py-8 px-4 bg-app-secondary/70 border border-app rounded-xl shadow-inner backdrop-blur">
                  <div className="w-12 h-12 bg-app text-app rounded-full flex items-center justify-center mx-auto mb-2 shadow">
                    <CalendarDaysIcon className="w-7 h-7" />
                  </div>
                  <p className="text-app font-semibold">Jour off</p>
                  <p className="text-xs text-app-secondary">Profite du repos ou ajoute une séance.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {itemsByDay[day].map((item) => (
                    <div
                      key={item.id}
                      className="group relative bg-app-secondary/80 border border-app rounded-xl p-3 hover:border-primary/60 transition-all duration-200 shadow-sm hover:shadow-lg backdrop-blur"
                    >
                      <div className="absolute inset-y-3 left-0 w-1 rounded-full bg-primary/80" aria-hidden />
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-base font-semibold text-app mb-1 flex items-center gap-2">
                            {item.label}
                            {item.isOptional && (
                              <span className="ml-2 text-xs px-2 py-1 rounded-full border border-app text-app-secondary">
                                Facultatif
                              </span>
                            )}
                          </h3>
                          <p className="text-[11px] text-app-secondary">
                            {item.workout ? `Séance: ${item.workout.name}` : 'Associe une séance pour ce créneau'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <label className="text-[11px] font-medium text-app-secondary sm:w-32">Séance associée</label>
                          <select
                            className="w-full px-3 py-2.5 bg-app border border-app rounded-lg text-sm text-app focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 shadow-inner"
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
                        </div>

                        {item.workout && (
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <button
                              onClick={() => window.location.href = `/workouts/${item.workout!.id}/play`}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 btn-primary px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-md"
                            >
                              <PlayIcon className="w-4 h-4" />
                              Lancer cette séance
                            </button>
                            <span className="text-[11px] text-app-secondary sm:text-right">Durée estimée selon ta séance</span>
                          </div>
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
          ))}
        </div>
      )}
    </Layout>
  );
};

export default WeeklyPlanPage;
