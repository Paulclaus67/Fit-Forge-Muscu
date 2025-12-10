// src/pages/ActiveWorkoutPage.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkout, type WorkoutDetail } from '../api/workouts';
import { XMarkIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import './ActiveWorkoutPage.css';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ThemeSwitcher } from '../components/ThemeSwitcher';

interface ActiveSessionState {
  workoutId: number;
  exerciseIndex: number;
  setNumber: number;
  completed: boolean;
  startedAt: number;
}

const STORAGE_KEY = 'activeSession';

function loadSession(workoutId: number): ActiveSessionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ActiveSessionState;
    if (parsed.workoutId !== workoutId) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveSession(state: ActiveSessionState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

function formatSeconds(sec: number): string {
  if (sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString()
    .padStart(2, '0')}`;
}

function formatTime(sec: number): { min: string; sec: string } {
  if (sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return {
    min: m.toString().padStart(2, '0'),
    sec: s.toString().padStart(2, '0'),
  };
}

const ActiveWorkoutPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [setNumber, setSetNumber] = useState(1);
  const [sessionDone, setSessionDone] = useState(false);
  const [showQuitDialog, setShowQuitDialog] = useState(false);

  // Chrono global de séance
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Chrono de repos
  const [restRemaining, setRestRemaining] = useState<number | null>(null);
  const [restRunning, setRestRunning] = useState(false);

  // Thème global
  const { mode } = useTheme();
  const isDarkMode = mode === 'dark';

  // Affichage du détail de l'exercice ou du chrono
  const [showDetails, setShowDetails] = useState(false);

  // Afficher le récap au démarrage
  const [showSummary, setShowSummary] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === null;
  });

  // Wake Lock pour empêcher la mise en veille
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Charger la séance + session sauvegardée
  useEffect(() => {
    if (!id) return;
    const run = async () => {
      try {
        setError(null);
        setLoading(true);
        const w = await getWorkout(Number(id));
        setWorkout(w);
        // Charger une session sauvegardée si présente
        const saved = loadSession(Number(id));
        if (saved) {
          setExerciseIndex(saved.exerciseIndex);
          setSetNumber(saved.setNumber);
          setSessionDone(saved.completed);
          setSessionStart(saved.startedAt);
        }
      } catch (err: any) {
        setError('Erreur lors du chargement de la séance.');
      } finally {
        setLoading(false);
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Démarrer la séance (initialiser le chrono global) quand on quitte le récap
  useEffect(() => {
    if (!showSummary && sessionStart === null) {
      setSessionStart(Date.now());
      setElapsedSeconds(0);
    }
  }, [showSummary, sessionStart]);

  // Gérer le Wake Lock pour empêcher la mise en veille pendant la séance
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator && !showSummary && !sessionDone) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          console.log('Wake Lock activé');
        }
      } catch (err) {
        console.warn('Wake Lock non supporté ou refusé:', err);
      }
    };

    const releaseWakeLock = async () => {
      if (wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
          console.log('Wake Lock désactivé');
        } catch (err) {
          console.warn('Erreur lors de la libération du Wake Lock:', err);
        }
      }
    };

    if (!showSummary && !sessionDone) {
      requestWakeLock();
    } else {
      releaseWakeLock();
    }

    // Nettoyer à la destruction du composant
    return () => {
      releaseWakeLock();
    };
  }, [showSummary, sessionDone]);

  // Réactiver le Wake Lock si la page devient visible à nouveau (retour de l'arrière-plan)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && !showSummary && !sessionDone) {
        try {
          if ('wakeLock' in navigator && !wakeLockRef.current) {
            wakeLockRef.current = await navigator.wakeLock.request('screen');
            console.log('Wake Lock réactivé après retour');
          }
        } catch (err) {
          console.warn('Impossible de réactiver le Wake Lock:', err);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [showSummary, sessionDone]);

  // Mettre à jour le chrono global (toutes les secondes)
  useEffect(() => {
    if (sessionStart === null) return;
    const t = setInterval(() => {
      const now = Date.now();
      setElapsedSeconds(Math.floor((now - sessionStart) / 1000));
    }, 1000);
    return () => clearInterval(t);
  }, [sessionStart]);

  // Compter le repos quand il est en cours
  useEffect(() => {
    if (!restRunning || restRemaining === null) return;
    const t = setInterval(() => {
      setRestRemaining(prev => {
        if (prev === null) return null;
        const next = prev - 1;
        return next <= 0 ? 0 : next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [restRunning, restRemaining]);

  const handleToggleRest = () => {
    if (restRemaining === null) return;
    setRestRunning(v => !v);
  };

  const handleResetRest = () => {
    setRestRemaining(null);
    setRestRunning(false);
  };

  const handleAdd15Sec = () => {
    setRestRemaining(prev => {
      if (prev === null) return 15;
      return prev + 15;
    });
  };

  const quitDialog = (
    <ConfirmDialog
      open={showQuitDialog}
      title="Quitter la séance ?"
      description="Êtes-vous sûr de vouloir quitter cette séance ? Votre progression sera sauvegardée."
      confirmLabel="Oui, quitter"
      cancelLabel="Continuer"
      onCancel={() => setShowQuitDialog(false)}
      onConfirm={confirmQuitSession}
    />
  );

  const bgClass = 'bg-app';
  const textClass = 'text-app';
  const subTextClass = 'text-app-secondary';
  const cardBgClass = 'bg-app-secondary';
  const borderClass = 'border-app';

  // UI Séance terminée
  if (sessionDone && workout && !loading) {
    return (
      <>
        <div
          className={`min-h-screen w-full flex flex-col justify-center items-center text-center space-y-6 ${bgClass} ${textClass}`}
        >
          <div className="text-6xl">✅</div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Séance terminée !</h1>
            <p className={`text-lg ${subTextClass}`}>{workout.name}</p>
          </div>
          {sessionStart && (
            <div className="space-y-1">
              <p className={`text-base ${subTextClass}`}>Durée totale</p>
              <p className="text-2xl font-mono font-bold text-primary">
                {formatSeconds(elapsedSeconds)}
              </p>
            </div>
          )}
          <button
            onClick={handleQuitSession}
            className="mt-8 px-8 py-3 btn-primary font-semibold rounded-full transition-colors active:scale-95"
          >
            Retour à l&apos;accueil
          </button>
        </div>
        {quitDialog}
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div
          className={`min-h-screen w-full flex justify-center items-center ${bgClass} ${textClass}`}
        >
          <p className={subTextClass}>Chargement...</p>
        </div>
        {quitDialog}
      </>
    );
  }

  if (error) {
    return (
      <>
        <div
          className={`min-h-screen w-full flex justify-center items-center ${bgClass} ${textClass}`}
        >
          <p className="text-red-400">{error}</p>
        </div>
        {quitDialog}
      </>
    );
  }

  // Formatage du chrono de repos
  const restTime = restRemaining !== null ? formatTime(restRemaining) : null;

  // Nombre total d'exercices
  const totalExercises = workout?.exercises.length ?? 0;

  // Exercice courant
  const currentExercise = workout?.exercises[exerciseIndex];

  // Nombre total de séries pour l'exercice courant
  const currentSetsTotal = currentExercise?.sets ?? 1;

  // Affichage du résumé de séance au démarrage
  if (showSummary && workout && !loading) {
    return (
      <>
        <div
          className={`summary-page w-full ${bgClass} ${textClass}`}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-3 border-b ${borderClass}`}>
            <button
              onClick={handleQuitSession}
              className="p-2 hover:bg-app-secondary rounded-lg transition-colors"
              title="Quitter"
            >
              <XMarkIcon className="w-6 h-6 text-red-400" />
            </button>
            <h1 className="text-lg font-bold flex-1 text-center">{workout.name}</h1>
            <ThemeSwitcher size="sm" />
          </div>

          {/* Contenu */}
          <div className="px-4 py-6">
            <div className="space-y-6">
              {/* Titre */}
              <div>
                <h2 className="text-2xl font-bold mb-2">📋 Récapitulatif de la séance</h2>
                <p className={subTextClass}>Voici ce qui vous attend aujourd'hui</p>
              </div>

              {/* Stats générales */}
              <div className="grid grid-cols-2 gap-3">
              <div className={`${cardBgClass} p-4 rounded-lg text-center`}>
                <p className={`text-xs uppercase ${subTextClass}`}>Nombre d'exercices</p>
                <p className="text-3xl font-bold mt-2">{workout.exercises.length}</p>
              </div>
              <div className={`${cardBgClass} p-4 rounded-lg text-center`}>
                <p className={`text-xs uppercase ${subTextClass}`}>Type de séance</p>
                <p className="text-lg font-bold mt-2">
                  {workout.type === 'CIRCUIT' ? '⚙️ Circuit' : '🏋️ Simple'}
                </p>
              </div>
            </div>

            {/* Liste des exercices */}
            <div className="space-y-3">
              <p className={`text-sm uppercase tracking-wide font-semibold ${subTextClass}`}>
                Les exercices
              </p>
              <div className="space-y-2">
                {workout.exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className={`${cardBgClass} p-4 rounded-lg border-l-4 ${
                      idx === 0 ? 'border-primary' : 'border-app'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold">
                          {idx + 1}. {ex.exercise.name}
                        </p>
                        {ex.exercise.description && (
                          <p className={`text-xs ${subTextClass} mt-1`}>
                            {ex.exercise.description}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          idx === 0
                            ? 'bg-app-secondary text-primary opacity-80'
                            : 'bg-app-secondary text-app-secondary'
                        }`}
                      >
                        {idx === 0 ? 'Actuel' : `#${idx + 1}`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3 text-xs">
                      {ex.sets !== null && (
                        <span className={`bg-app-secondary px-2 py-1 rounded`}>
                          {ex.sets} séries
                        </span>
                      )}
                      {ex.reps !== null && (
                        <span className={`bg-app-secondary px-2 py-1 rounded`}>
                          {ex.reps === 0 ? 'reps max' : `${ex.reps} reps`}
                        </span>
                      )}
                      {ex.durationSec !== null && (
                        <span className={`bg-app-secondary px-2 py-1 rounded`}>
                          {ex.durationSec}s
                        </span>
                      )}
                      {ex.restSec && ex.restSec > 0 && (
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                          Repos: {ex.restSec}s
                        </span>
                      )}
                    </div>
                    {ex.notes && (
                      <p className={`text-xs ${subTextClass} mt-2 italic`}>
                        💡 {ex.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Message d'encouragement */}
            <div className={`${cardBgClass} p-4 rounded-lg border-l-4 border-primary text-center`}>
              <p className="text-lg font-semibold">💪 Prêt? C'est parti!</p>
              <p className={`text-sm ${subTextClass} mt-1`}>
                Vous pouvez revenir à cette vue à tout moment via le mode détails
              </p>
            </div>
          </div>
        </div>

          {/* Bouton de démarrage */}
          <div className={`border-t ${borderClass} px-4 py-4`}>
            <button
              onClick={() => setShowSummary(false)}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-colors active:scale-95 btn-primary`}
            >
              Commencer la séance
            </button>
          </div>
        </div>
        {quitDialog}
      </>
    );
  }

    function handleCompleteSet(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
      event.preventDefault();

      if (!workout) return;

      const currentExercise = workout.exercises[exerciseIndex];
      const totalSets = currentExercise.sets ?? 1;

      // Si on n'est pas à la dernière série de l'exercice courant
      if (setNumber < totalSets) {
        setSetNumber(setNumber + 1);
        // Démarrer le chrono de repos si défini
        if (currentExercise.restSec && currentExercise.restSec > 0) {
          setRestRemaining(currentExercise.restSec);
          setRestRunning(true); // Démarrer automatiquement
        } else {
          setRestRemaining(null);
          setRestRunning(false);
        }
      } else {
        // Dernière série de l'exercice courant
        if (exerciseIndex < workout.exercises.length - 1) {
          setExerciseIndex(exerciseIndex + 1);
          setSetNumber(1);
          const nextExercise = workout.exercises[exerciseIndex + 1];
          if (nextExercise.restSec && nextExercise.restSec > 0) {
            setRestRemaining(nextExercise.restSec);
            setRestRunning(true); // Démarrer automatiquement
          } else {
            setRestRemaining(null);
            setRestRunning(false);
          }
        } else {
          // Dernière série du dernier exercice : séance terminée
          setSessionDone(true);
          clearSession();
        }
      }

      // Sauvegarder la progression
      saveSession({
        workoutId: workout.id,
        exerciseIndex: exerciseIndex < workout.exercises.length - 1 && setNumber === totalSets
          ? exerciseIndex + 1
          : exerciseIndex,
        setNumber: setNumber < totalSets ? setNumber + 1 : 1,
        completed: exerciseIndex === workout.exercises.length - 1 && setNumber === totalSets,
        startedAt: sessionStart ?? Date.now(),
      });
    }

    function handleQuitSession(): void {
      // If session is done, just clear and go home
      if (sessionDone) {
      clearSession();
      navigate('/');
      return;
      }
      // If already on quit dialog, do nothing
      if (!showQuitDialog) {
      setShowQuitDialog(true);
      }
    }

    function confirmQuitSession() {
      clearSession();
      navigate('/');
    }

  function handlePrevExercise(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    if (!workout) return;
    if (exerciseIndex > 0) {
      setExerciseIndex(exerciseIndex - 1);
      setSetNumber(1);
      const prevExercise = workout.exercises[exerciseIndex - 1];
      if (prevExercise.restSec && prevExercise.restSec > 0) {
        setRestRemaining(prevExercise.restSec);
        setRestRunning(false);
      } else {
        setRestRemaining(null);
        setRestRunning(false);
      }
      // Save session
      saveSession({
        workoutId: workout.id,
        exerciseIndex: exerciseIndex - 1,
        setNumber: 1,
        completed: false,
        startedAt: sessionStart ?? Date.now(),
      });
    }
  }

  function handleNextExercise(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    if (!workout) return;
    if (exerciseIndex < (workout.exercises.length - 1)) {
      setExerciseIndex(exerciseIndex + 1);
      setSetNumber(1);
      const nextExercise = workout.exercises[exerciseIndex + 1];
      if (nextExercise.restSec && nextExercise.restSec > 0) {
        setRestRemaining(nextExercise.restSec);
        setRestRunning(false);
      } else {
        setRestRemaining(null);
        setRestRunning(false);
      }
      // Save session
      saveSession({
        workoutId: workout.id,
        exerciseIndex: exerciseIndex + 1,
        setNumber: 1,
        completed: false,
        startedAt: sessionStart ?? Date.now(),
      });
    }
  }

  return (
    <>
      <div
        className={`active-workout min-h-screen w-full flex flex-col overflow-hidden ${bgClass} ${textClass}`}
        style={{ height: '100vh' }}
        data-theme={isDarkMode ? 'dark' : 'light'}
      >
        {/* Header minimaliste */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${borderClass}`}>
          <div className="flex gap-2">
            <button
              onClick={handleQuitSession}
              className="p-2 hover:bg-app-secondary rounded-lg transition-colors"
              title="Quitter la séance"
            >
              <XMarkIcon className="w-6 h-6 text-red-400" />
            </button>
            <button
              onClick={() => setShowSummary(true)}
              className="p-2 hover:bg-app-secondary rounded-lg transition-colors text-sm font-medium"
              title="Voir le récap"
            >
              Recap
            </button>
          </div>

          <div className="text-center flex-1">
            <p className={`text-xs uppercase tracking-wide ${subTextClass}`}>
              {workout?.name}
            </p>
            <p className="text-sm font-mono font-bold text-primary">
              ⏱ {formatSeconds(elapsedSeconds)}
            </p>
          </div>

          <ThemeSwitcher size="sm" />
        </div>

        {/* Barre de progression simplifiée - juste la barre sans texte redondant */}
        <div className={`px-4 py-2 border-b ${borderClass}`}>
                <div className={`w-full ${cardBgClass} rounded-full h-2 overflow-hidden`}>
            <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((exerciseIndex + 1) / totalExercises) * 100}%` }}
            />
          </div>
        </div>

        {/* Contenu principal */}
        {workout && currentExercise && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Affichage chrono ou détails */}
            {restRemaining !== null && !showDetails ? (
              // ===== VUE CHRONO PRINCIPAL =====
              <div className="flex-1 flex flex-col justify-between items-center px-4 py-3 sm:py-6 gap-3 sm:gap-6 overflow-y-auto">
                {/* En-tête avec contexte exercice/série - Compact sur mobile */}
                <div className={`w-full ${cardBgClass} border-2 border-primary rounded-lg p-2 sm:p-4 text-center space-y-2`}>
                  <div className="space-y-0.5">
                    <p className={`text-[10px] sm:text-xs uppercase tracking-wider font-bold ${subTextClass}`}>
                      Exercice actuel
                    </p>
                    <h2 className="text-lg sm:text-2xl font-bold text-primary line-clamp-2">
                      {currentExercise.exercise.name}
                    </h2>
                  </div>
                  
                  <div className="flex gap-2 sm:gap-4 justify-center pt-1 sm:pt-2">
                    <div className={`flex-1 bg-app-secondary rounded p-1.5 sm:p-2`}>
                      <p className={`text-[9px] sm:text-xs uppercase ${subTextClass}`}>Exercice</p>
                      <p className="text-base sm:text-lg font-bold text-primary">
                        {exerciseIndex + 1}/{totalExercises}
                      </p>
                    </div>
                    <div className={`flex-1 bg-app-secondary rounded p-1.5 sm:p-2`}>
                      <p className={`text-[9px] sm:text-xs uppercase ${subTextClass}`}>Série</p>
                      <p className="text-base sm:text-lg font-bold text-primary">
                        {setNumber}/{currentSetsTotal}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chrono géant */}
                <div className="flex flex-col items-center gap-2 sm:gap-4 flex-1 justify-center">
                  <p className={`text-xs sm:text-sm uppercase tracking-wide ${subTextClass}`}>
                    Temps de repos
                  </p>
                  <div className="flex items-baseline gap-1 select-none chrono-display">
                    <span className="chrono-giant text-6xl sm:text-[100px] md:text-[120px] font-mono font-bold leading-none">
                      {restTime?.min}
                    </span>
                    <span className="text-5xl sm:text-[90px] md:text-[100px] font-mono font-bold opacity-60 leading-none">
                      :
                    </span>
                    <span className="chrono-giant text-6xl sm:text-[100px] md:text-[120px] font-mono font-bold leading-none">
                      {restTime?.sec}
                    </span>
                  </div>
                </div>

                {/* Status repos */}
                <div className={`text-center ${subTextClass}`}>
                  {restRunning ? (
                    <p className="text-base sm:text-lg font-semibold">
                      {restRemaining === 0 ? '✅ Repos terminé!' : '⏳ En cours...'}
                    </p>
                  ) : (
                    <p className="text-base sm:text-lg font-semibold">⏸ En pause</p>
                  )}
                </div>

                {/* Boutons chrono */}
                <div className="flex gap-2 sm:gap-3 w-full max-w-xs">
                  <button
                    onClick={handleToggleRest}
                    className={`flex-1 py-2.5 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-colors active:scale-95 ${restRunning ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    {restRunning ? 'Pause' : 'Démarrer'}
                  </button>
                  <button
                    onClick={handleResetRest}
                    className={`flex-1 py-2.5 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg border-2 ${borderClass} transition-colors active:scale-95`}
                  >
                    Reset
                  </button>
                </div>

                {/* +15 sec */}
                <button
                  onClick={handleAdd15Sec}
                  className={`py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm border ${borderClass} hover:bg-app-secondary transition-colors active:scale-95`}
                >
                  +15s
                </button>

                {/* Détails de l'exercice */}
                <button
                  onClick={() => setShowDetails(true)}
                  className={`text-xs sm:text-sm ${subTextClass} hover:underline`}
                >
                  Voir les détails →
                </button>
              </div>
            ) : (
              // ===== VUE DÉTAILS / EXERCICE =====
              <div className="flex-1 flex flex-col overflow-y-auto px-4 py-6 gap-6">
                {/* Progression */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span className={subTextClass}>
                      Exercice {exerciseIndex + 1}/{totalExercises}
                    </span>
                    <span className={subTextClass}>
                      Série {setNumber}/{currentSetsTotal}
                    </span>
                  </div>
                  <div className={`w-full ${cardBgClass} rounded-full h-3`}>
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-300"
                      style={{ width: `${((exerciseIndex + 1) / totalExercises) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Exercice actuel */}
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold">
                    {currentExercise.exercise.name}
                  </h1>

                  <div className="grid grid-cols-3 gap-3">
                    {currentExercise.sets !== null && (
                      <div className={`${cardBgClass} p-3 rounded-lg text-center`}>
                        <p className={`text-xs uppercase ${subTextClass}`}>Séries</p>
                        <p className="text-2xl font-bold mt-1">
                          {currentExercise.sets}
                        </p>
                      </div>
                    )}
                    {currentExercise.reps !== null && (
                      <div className={`${cardBgClass} p-3 rounded-lg text-center`}>
                        <p className={`text-xs uppercase ${subTextClass}`}>Reps</p>
                        <p className="text-2xl font-bold mt-1">
                          {currentExercise.reps === 0 ? 'max' : currentExercise.reps}
                        </p>
                      </div>
                    )}
                    {currentExercise.durationSec !== null && (
                      <div className={`${cardBgClass} p-3 rounded-lg text-center`}>
                        <p className={`text-xs uppercase ${subTextClass}`}>Durée</p>
                        <p className="text-2xl font-bold mt-1">
                          {currentExercise.durationSec}s
                        </p>
                      </div>
                    )}
                  </div>

                  {currentExercise.notes && (
                    <div className={`${cardBgClass} p-4 rounded-lg`}>
                      <p className={`text-xs uppercase tracking-wide ${subTextClass} mb-2`}>Notes</p>
                      <p className={textClass}>{currentExercise.notes}</p>
                    </div>
                  )}
                </div>

                {/* Chrono de repos info */}
                {restRemaining !== null && (
                  <div className={`${cardBgClass} p-4 rounded-lg border-l-4 border-primary`}>
                    <p className={`text-xs uppercase ${subTextClass} mb-2`}>
                      Temps de repos
                    </p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-mono font-bold">
                        {formatSeconds(restRemaining)}
                      </span>
                      <span className={`${subTextClass} mb-1`}>
                        {restRunning ? '⏳' : '⏸'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Prochain exercice preview */}
                {exerciseIndex + 1 < totalExercises && (
                  <div className={`${cardBgClass} p-4 rounded-lg border-l-4 border-app`}>
                    <p className={`text-xs uppercase tracking-wide ${subTextClass} mb-3`}>
                      Prochain exercice
                    </p>
                    <div className="space-y-2">
                      <p className="font-semibold">
                        {workout.exercises[exerciseIndex + 1].exercise.name}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {workout.exercises[exerciseIndex + 1].sets !== null && (
                          <span className={`bg-app-secondary px-2 py-1 rounded`}>
                            {workout.exercises[exerciseIndex + 1].sets} séries
                          </span>
                        )}
                        {workout.exercises[exerciseIndex + 1].reps !== null && (
                          <span className={`bg-app-secondary px-2 py-1 rounded`}>
                            {workout.exercises[exerciseIndex + 1].reps === 0
                              ? 'reps max'
                              : `${workout.exercises[exerciseIndex + 1].reps} reps`}
                          </span>
                        )}
                        {workout.exercises[exerciseIndex + 1].durationSec !== null && (
                          <span className={`bg-app-secondary px-2 py-1 rounded`}>
                            {workout.exercises[exerciseIndex + 1].durationSec}s
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Fermer détails */}
                {restRemaining !== null && (
                  <button
                    onClick={() => setShowDetails(false)}
                    className={`py-3 rounded-xl font-semibold text-sm border ${borderClass} transition-colors active:scale-95`}
                  >
                    Retour au chrono
                  </button>
                )}
              </div>
            )}

            {/* Footer avec contrôles */}
            <div className={`border-t ${borderClass} px-4 py-4 space-y-2`}>
              {/* Boutons navigation exercices */}
              <div className="flex gap-2">
                <button
                  onClick={handlePrevExercise}
                  disabled={exerciseIndex === 0}
                  className={`flex-1 py-3 rounded-xl font-semibold border ${borderClass} transition-colors disabled:opacity-40 active:scale-95 flex items-center justify-center gap-2`}
                >
                  <ChevronUpIcon className="w-4 h-4" />
                  Exercice précédent
                </button>
                <button
                  onClick={handleNextExercise}
                  disabled={exerciseIndex >= totalExercises - 1}
                  className={`flex-1 py-3 rounded-xl font-semibold border ${borderClass} transition-colors disabled:opacity-40 active:scale-95 flex items-center justify-center gap-2`}
                >
                  Exercice suivant
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Bouton principal */}
              <button
                onClick={handleCompleteSet}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-colors active:scale-95 btn-primary`}
              >
                Série terminée
              </button>
            </div>
          </div>
        )}
      </div>
      {quitDialog}
    </>
  );
};

export default ActiveWorkoutPage;
