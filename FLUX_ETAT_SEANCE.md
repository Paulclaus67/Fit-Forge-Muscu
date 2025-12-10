# Flux d'état - Page Séance Refactorisée

## 🔄 Diagramme d'état

```
┌──────────────────────────────────────────────────────────────────┐
│                      ACTIVE WORKOUT PAGE                         │
└──────────────────────────────────────────────────────────────────┘

                           Page chargée
                                 ↓
                    ┌────────────────────────┐
                    │   AFFICHER RÉSUMÉ      │
                    │   (showSummary=true)   │
                    │                        │
                    │ Séance Jambes          │
                    │ 5 exercices, 20min     │
                    │                        │
                    │ [Commencer la séance]  │
                    └────────────────────────┘
                                 ↓
                        Clic "Commencer"
                                 ↓
            ┌───────────────────────────────────────┐
            │   ÉTAT EXÉCUTION                      │
            │   (restRemaining === null)            │
            │                                       │
            │  Pistol Squat                         │
            │  Exercice 1/2 · Série 1/4             │
            │                                       │
            │  [4 séries] [10 reps]                 │
            │                                       │
            │  Technique: Descendre lentement...    │
            │                                       │
            │  À suivre: Squats sautés              │
            │                                       │
            │  ┌──────────────────────────────────┐ │
            │  │ SÉRIE TERMINÉE (PRIMARY)         │ │
            │  └──────────────────────────────────┘ │
            │                                       │
            │  ← Précédent    Suivant →             │
            └───────────────────────────────────────┘
                                 ↓
                  Clic "Série terminée"
                                 ↓
                  handleCompleteSet() déclenche:
                  - setRestRemaining(45) ← temps de repos de l'exo suivant
                  - setRestRunning(true) ← démarrage auto du chrono
                                 ↓
            ┌───────────────────────────────────────┐
            │   ÉTAT REPOS                          │
            │   (restRemaining !== null)            │
            │                                       │
            │  Pistol Squat                         │
            │  Exercice 1/2 · Série 2/4             │
            │                                       │
            │           00:45                       │ ← GÉANT
            │        ⏳ En cours...                  │
            │                                       │
            │  ┌──────────────────────────────────┐ │
            │  │ Pause (PRIMARY)                  │ │
            │  └──────────────────────────────────┘ │
            │  ┌──────────────────────────────────┐ │
            │  │ +15s (SECONDARY)                 │ │
            │  └──────────────────────────────────┘ │
            │                                       │
            │  ▶ Détails & options (HIDDEN)        │
            │                                       │
            │  ┌──────────────────────────────────┐ │
            │  │ SÉRIE SUIVANTE (PRIMARY)         │ │
            │  └──────────────────────────────────┘ │
            │                                       │
            │  ← Précédent    Suivant →             │
            └───────────────────────────────────────┘
                           ↑        ↓ (auto-loop)
                           │      Chrono décrémente
                    handleToggleRest() handleAdd15Sec()
                    handleResetRest()
                           │
                  (Optionnel: Menu caché)
                           │
                    ▼ Détails & options
                      │                    │
                      ├─ Notes technique   │
                      │  "Descendre lent..."
                      │                    │
                      └─ ⟲ Réinit chrono   │ ← handleResetRest()
                         (ROUGE, danger)
```

---

## 📊 État du composant

### Variables d'état principales

```typescript
// Données séance
const [workout, setWorkout] = useState<WorkoutDetail | null>(null);
const [exerciseIndex, setExerciseIndex] = useState(0);
const [setNumber, setSetNumber] = useState(1);

// Chrono global
const [sessionStart, setSessionStart] = useState<number | null>(null);
const [elapsedSeconds, setElapsedSeconds] = useState(0);

// Chrono de repos (CLEF)
const [restRemaining, setRestRemaining] = useState<number | null>(null);
const [restRunning, setRestRunning] = useState(false);

// Affichage
const [showSummary, setShowSummary] = useState(true);
const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

// Gestion de l'UI
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [sessionDone, setSessionDone] = useState(false);
const [showQuitDialog, setShowQuitDialog] = useState(false);
```

### Logique d'affichage

```
if showSummary → RÉSUMÉ (avant de commencer)
else if restRemaining !== null → ÉTAT REPOS
else → ÉTAT EXÉCUTION
```

---

## 🎯 Transitions d'état

### Transition 1: Résumé → Exécution
```typescript
// Bouton "Commencer la séance"
onClick={() => setShowSummary(false)}
```
**Effet :** showSummary = false → affiche l'état EXÉCUTION

---

### Transition 2: Exécution → Repos
```typescript
// Bouton "Série terminée"
handleCompleteSet() {
  // Récupère le temps de repos de l'exo suivant
  const nextExercise = workout.exercises[exerciseIndex + 1];
  if (nextExercise.restSec > 0) {
    setRestRemaining(nextExercise.restSec);
    setRestRunning(true); // Démarrage auto
  }
  // Sauvegarde progression
  saveSession({...});
}
```
**Effet :** restRemaining ≠ null → affiche l'état REPOS

---

### Transition 3: Repos → Exécution (prochaine série)
```typescript
// Bouton "Série suivante" (état repos)
handleCompleteSet() {
  // Même handler qu'exécution!
  if (setNumber < totalSets) {
    setSetNumber(setNumber + 1);
    setRestRemaining(null); // Retour à EXÉCUTION
  } else {
    // Passer à l'exercice suivant
    setExerciseIndex(exerciseIndex + 1);
    setSetNumber(1);
    setRestRemaining(null); // Retour à EXÉCUTION
  }
}
```
**Effet :** restRemaining = null → affiche l'état EXÉCUTION (prochaine série)

---

### Transition 4: Repos → Repos (Pause/Reprendre)
```typescript
// Bouton "Pause" ou "Reprendre"
handleToggleRest() {
  setRestRunning(!restRunning);
}
```
**Effet :** restRemaining reste ≠ null, restRunning toggle → reste en REPOS

---

### Transition 5: Repos → Repos (+15s)
```typescript
// Bouton "+15s"
handleAdd15Sec() {
  setRestRemaining(Math.max(0, restRemaining + 15));
}
```
**Effet :** restRemaining ≠ null, augmente de 15s → reste en REPOS

---

### Transition 6: Repos → Repos (Reset chrono)
```typescript
// Bouton "⟲ Réinit chrono" (dans menu caché)
handleResetRest() {
  const nextExercise = workout.exercises[exerciseIndex + 1];
  setRestRemaining(nextExercise.restSec);
  setRestRunning(false); // Pause
}
```
**Effet :** restRemaining reset au temps initial → reste en REPOS
⚠️ **Important :** Cela ne réinitialise PAS l'exercice!

---

### Transition 7: Quelconque → Résumé
```typescript
// Bouton "Recap" en haut
onClick={() => setShowSummary(true)}
```
**Effet :** showSummary = true → retour au résumé

---

### Transition 8: Quelconque → Quitter
```typescript
// Bouton [X] en haut
handleQuitSession() {
  clearSession();
  navigate('/workouts');
}
```
**Effet :** Nettoie le localStorage et retour à la liste

---

## 🔄 Boucles fermées

### Boucle du chrono global
```
useEffect(() => {
  if (!sessionStart || showSummary || sessionDone) return;
  
  const interval = setInterval(() => {
    setElapsedSeconds(elapsed + 1);
  }, 1000);
  
  return () => clearInterval(interval);
}, [sessionStart, showSummary, sessionDone, elapsedSeconds]);
```

### Boucle du chrono de repos
```
useEffect(() => {
  if (!restRunning || restRemaining === null) return;
  
  const interval = setInterval(() => {
    setRestRemaining(prev => {
      if (prev <= 1) {
        // Repos fini, pas d'auto-advance
        setRestRunning(false);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  
  return () => clearInterval(interval);
}, [restRunning, restRemaining]);
```

### Wake Lock
```
// Empêcher la mise en veille pendant la séance
if (!showSummary && !sessionDone && 'wakeLock' in navigator) {
  navigator.wakeLock.request('screen');
}
```

---

## 📱 Rendu conditionnel

### Condition principale
```
if showSummary && workout
  → Afficher RÉSUMÉ
else if loading
  → Afficher CHARGEMENT
else if error
  → Afficher ERREUR
else if workout && currentExercise
  → Afficher SÉANCE
    └─ if restRemaining !== null
      → ÉTAT REPOS
    └─ else
      → ÉTAT EXÉCUTION
```

---

## 🔐 Sauvegarde et persistance

### localStorage: activeSession
```typescript
interface ActiveSessionState {
  workoutId: number;
  exerciseIndex: number;
  setNumber: number;
  completed: boolean;
  startedAt: number;
}
```

**Sauvegardé:**
- Après handleCompleteSet()
- À chaque changement d'exercice
- À la fin de la séance

**Restauré:**
- Au chargement de la page
- Si une session est en cours pour cette séance

---

## 🎯 Navigation

```
Dashboard
    ↓ (clic séance)
WorkoutDetailPage
    ↓ (clic "Lancer")
ActiveWorkoutPage
    ├─ showSummary
    │  └─ "Commencer" → Exécution
    ├─ État Exécution
    │  └─ "Série terminée" → Repos
    ├─ État Repos
    │  └─ "Série suivante" → Exécution (prochaine)
    └─ [X] → Dashboard
```

---

## ⚡ Performance

### Optimisations
- ✅ useEffect cleanup (intervals nettoyés)
- ✅ Wake Lock demandé une fois
- ✅ localStorage utilisé (pas API sur chaque change)
- ✅ Rendu minimal (pas de re-render inutile)
- ✅ CSS animé avec GPU (transform, opacity)

### Pas de performance issue
- ✅ Chrono met à jour toutes les 1s (léger)
- ✅ Pas de boucle d'update infinie
- ✅ Pas d'API call pendant le reste
- ✅ Images/vidéos non utilisées

