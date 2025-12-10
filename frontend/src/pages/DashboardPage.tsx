// src/pages/DashboardPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import {
  getWeeklyPlan,
  type DayOfWeek,
  type WeeklyPlan,
  type WeeklyPlanItem,
} from '../api/weeklyPlan';

const dayLabelShort: Record<DayOfWeek, string> = {
  MONDAY: 'Lun',
  TUESDAY: 'Mar',
  WEDNESDAY: 'Mer',
  THURSDAY: 'Jeu',
  FRIDAY: 'Ven',
  SATURDAY: 'Sam',
  SUNDAY: 'Dim',
};

const dayLabelLong: Record<DayOfWeek, string> = {
  MONDAY: 'Lundi',
  TUESDAY: 'Mardi',
  WEDNESDAY: 'Mercredi',
  THURSDAY: 'Jeudi',
  FRIDAY: 'Vendredi',
  SATURDAY: 'Samedi',
  SUNDAY: 'Dimanche',
};

const orderedDays: DayOfWeek[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

interface ActiveSessionState {
  workoutId: number;
  exerciseIndex: number;
  setNumber: number;
  completed: boolean;
  startedAt: number;
}

const ACTIVE_SESSION_KEY = 'activeSession';

function getTodayDayOfWeek(): DayOfWeek {
  const jsDay = new Date().getDay(); // 0 = dimanche, 1 = lundi, ...
  switch (jsDay) {
    case 1:
      return 'MONDAY';
    case 2:
      return 'TUESDAY';
    case 3:
      return 'WEDNESDAY';
    case 4:
      return 'THURSDAY';
    case 5:
      return 'FRIDAY';
    case 6:
      return 'SATURDAY';
    case 0:
    default:
      return 'SUNDAY';
  }
}

function loadActiveSession(): ActiveSessionState | null {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveSessionState;
    if (parsed.completed) return null;
    return parsed;
  } catch {
    return null;
  }
}

const DashboardPage: React.FC = () => {
  const { user, token } = useAuth();
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSession, setActiveSession] =
    useState<ActiveSessionState | null>(null);

  const today = getTodayDayOfWeek();
  const todayDateText = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    });
  }, []);

  useEffect(() => {
    setActiveSession(loadActiveSession());
  }, []);

  useEffect(() => {
    if (!token) return;
    const run = async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await getWeeklyPlan(token);
        setPlan(res);
      } catch (err: any) {
        setError(err.message || 'Erreur chargement du planning');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token]);

  const todayItems: WeeklyPlanItem[] = useMemo(() => {
    if (!plan) return [];
    return plan.items
      .filter((it) => it.dayOfWeek === today)
      .sort((a, b) => a.order - b.order);
  }, [plan, today]);

  const todayMainWorkout = useMemo(() => {
    return todayItems.find((it) => it.workout != null) || null;
  }, [todayItems]);

  const activeWorkoutName = useMemo(() => {
    if (!activeSession || !plan) return null;
    const found = plan.items.find((it) => it.workout?.id === activeSession.workoutId);
    return found?.workout?.name ?? null;
  }, [activeSession, plan]);

  const weekSummary = useMemo<Record<DayOfWeek, WeeklyPlanItem[]>>(() => {
    const grouped: Record<DayOfWeek, WeeklyPlanItem[]> = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    };
    if (!plan) return grouped;
    for (const it of plan.items) {
      grouped[it.dayOfWeek].push(it);
    }
    orderedDays.forEach((d) => grouped[d].sort((a, b) => a.order - b.order));
    return grouped;
  }, [plan]);

  const hasPlan = !!plan && plan.items.length > 0;
  const todayLabel = dayLabelLong[today];
  const activeWorkoutId = activeSession?.workoutId ?? null;
  const totalWeekItems = plan?.items.length ?? 0;
  const hasTodayContent = todayItems.length > 0;

  return (
    <Layout>
      <div className="space-y-5 text-app">
        {/* Hero : carte de la séance du jour */}
        <section className="rounded-3xl border border-app bg-gradient-to-br from-primary/20 via-app-secondary to-app p-5 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <Link to="/profile" className="shrink-0">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Photo de profil"
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/30 shadow-lg"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-app-secondary border-2 border-primary/30 flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-app-secondary" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </Link>

              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-primary bg-app-secondary/70 inline-flex items-center px-2.5 py-1 rounded-full border border-primary/30">
                  {todayDateText}
                </p>
                <p className="text-sm text-app-secondary">{user ? `Salut ${user.username} 👋` : 'Salut 👋'}</p>
                <h1 className="text-xl font-bold text-app truncate">
                  {activeWorkoutId ? `Reprendre : ${activeWorkoutName ?? 'ta séance'}` : todayMainWorkout?.workout ? `Séance du jour : ${todayMainWorkout.workout.name}` : 'Aucune séance prévue'}
                </h1>
                <p className="text-sm text-app-secondary">
                  {hasPlan
                    ? `Planning prêt · ${todayItems.length} bloc${todayItems.length > 1 ? 's' : ''} aujourd’hui`
                    : 'Aucun planning actif · choisis ou crée ta séance'}
                </p>
              </div>
            </div>

            {activeWorkoutId && (
              <span className="px-3 py-1 text-[11px] rounded-full border border-primary bg-app text-primary font-semibold shadow-inner">
                Séance en cours
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {activeWorkoutId && (
              <PrimaryButton as="link" to={`/workouts/${activeWorkoutId}/play`}>
                Reprendre ma séance
              </PrimaryButton>
            )}

            {!activeWorkoutId && todayMainWorkout?.workout && (
              <PrimaryButton as="link" to={`/workouts/${todayMainWorkout.workout.id}/play`}>
                Démarrer {todayMainWorkout.workout.name}
              </PrimaryButton>
            )}

            {!activeWorkoutId && !todayMainWorkout?.workout && (
              <PrimaryButton as="link" to="/workouts">
                Choisir une séance
              </PrimaryButton>
            )}
          </div>

          <p className="mt-3 text-[12px] text-app-secondary">
            Aujourd’hui : {todayItems.length} bloc{todayItems.length > 1 ? 's' : ''} · {hasPlan ? 'Planning actif' : 'Planning à configurer'} · Semaine : {totalWeekItems} élément{totalWeekItems > 1 ? 's' : ''}
          </p>
        </section>

        {/* Aujourd’hui : résumé des blocs */}
        <section className="bg-app-secondary border border-app rounded-2xl p-4 space-y-3 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-app-secondary font-semibold">Aujourd'hui</div>
              <div className="text-base font-bold text-app">{todayLabel}</div>
            </div>
            {activeWorkoutId && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-app border border-primary">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-medium text-primary">En cours</span>
              </div>
            )}
          </div>

          {!hasPlan && (
            <div className="bg-app border border-app rounded-xl p-4 text-center">
              <p className="text-xs text-app-secondary mb-2">Aucun planning configuré.</p>
              <Link
                to="/weekly-plan"
                className="inline-flex items-center gap-1 text-xs text-primary hover:opacity-90 font-medium transition-colors"
              >
                Configurer →
              </Link>
            </div>
          )}

          {hasPlan && (
            <>
              {!hasTodayContent ? (
                <div className="bg-app border border-app rounded-xl p-4 text-center">
                  <span className="text-xl mb-2 block">🏖️</span>
                  <p className="text-xs font-medium text-app-secondary">Jour de repos</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {todayItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-app bg-app flex gap-3 items-start"
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {idx < todayItems.length - 1 && (
                          <div className="flex-1 w-px bg-app-secondary/60 mt-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-app-secondary">#{idx + 1}</span>
                          <h2 className="text-sm font-semibold text-app truncate">{item.label}</h2>
                          {item.isOptional && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-app-secondary border border-app text-app-secondary">Opt.</span>
                          )}
                        </div>
                        {item.workout && (
                          <p className="text-xs text-app-secondary mt-1 truncate">{item.workout.name}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* Cette semaine : vue synthétique */}
        <section className="rounded-2xl border border-app bg-app-secondary p-4 shadow-sm text-xs space-y-3">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-sm font-semibold text-app">Cette semaine</h2>
            <Link to="/weekly-plan" className="text-[11px] text-primary hover:underline">Gérer le planning</Link>
          </div>

          {!hasPlan && <p className="text-app-secondary">Aucune semaine configurée pour l'instant.</p>}

          {hasPlan && (
            <div className="space-y-1 divide-y divide-app/60">
              {orderedDays.map((day) => {
                const items = weekSummary[day];
                const hasWorkout = items.some((it) => it.workout);
                const isToday = day === today;
                const label = items.length === 0 ? 'Repos' : items.map((it) => (it.workout ? it.workout.name : it.label)).join(' · ');

                return (
                  <div key={day} className="flex items-center justify-between py-1.5">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className={`text-[12px] font-semibold ${isToday ? 'text-primary' : 'text-app'}`}>{dayLabelShort[day]}</span>
                      <span className="text-[12px] text-app-secondary truncate">{label}</span>
                    </span>
                    <span className={`h-2.5 w-2.5 rounded-full ${hasWorkout ? 'bg-primary' : 'bg-app-secondary border border-app'}`} aria-hidden />
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {loading && <p className="text-xs text-app-secondary">Chargement...</p>}
        {error && <p className="text-xs text-red-600">Erreur: {error}</p>}
      </div>
    </Layout>
  );
};

export default DashboardPage;
