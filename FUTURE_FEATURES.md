# Fonctionnalités futures - Muscu PWA

Ce document liste les fonctionnalités prévues pour les prochaines versions de l'application.

## 🎯 Priorité haute

### Chronomètre pour exercices statiques (v2.0)

**Problème identifié :**
Certains exercices comme la chaise, la planche, ou les maintiens isométriques nécessitent un chronomètre de temps d'exécution plutôt qu'un compteur de répétitions.

**Solution proposée :**

#### 1. Modification du schéma de données
Ajouter un champ `executionType` aux exercices :
- `REPS` : exercices avec répétitions (par défaut)
- `DURATION` : exercices avec durée (statiques/isométriques)

```prisma
model Exercise {
  id              Int      @id @default(autoincrement())
  name            String
  description     String?
  muscleGroup     String
  executionType   ExecutionType @default(REPS)
  // ... autres champs
}

enum ExecutionType {
  REPS
  DURATION
}
```

#### 2. Interface utilisateur
Pour les exercices de type `DURATION` :
- Afficher un chronomètre au lieu du compteur de répétitions
- Permettre de démarrer/arrêter le chronomètre
- Enregistrer le temps réalisé pour chaque série
- Afficher l'objectif de temps (depuis `durationSec`)

**Exemple d'interface :**
```
┌─────────────────────────────┐
│  CHAISE MURALE             │
├─────────────────────────────┤
│  Série 2/3                 │
│                            │
│  ⏱️ Objectif: 60s          │
│                            │
│      00:32                 │
│   [En cours...]            │
│                            │
│  [⏸️ Pause] [⏹️ Terminer]  │
└─────────────────────────────┘
```

#### 3. Statistiques et progression
- Enregistrer les temps réalisés pour chaque série
- Calculer le temps total d'effort
- Afficher la progression (temps moyen par exercice)
- Graphiques d'évolution des performances

#### 4. Exemples d'exercices statiques typiques
- Chaise murale
- Planche abdominale
- Gainage latéral
- L-sit
- Maintien en haut de traction
- Front lever hold
- Back lever hold

#### 5. Implémentation technique

**Frontend :**
- Modifier `ActiveWorkoutPage.tsx` pour gérer le mode DURATION
- Créer un composant `ExerciseTimer` dédié
- Adapter l'affichage selon le type d'exercice

**Backend :**
- Migration Prisma pour ajouter `executionType`
- Mettre à jour les endpoints pour supporter le nouveau type
- Adapter la validation des données

**Base de données :**
- Seed pour créer des exercices statiques par défaut
- Migration pour convertir les exercices existants

#### 6. Tests à effectuer
- [ ] Créer un exercice de type DURATION
- [ ] Démarrer/arrêter le chrono pendant l'exécution
- [ ] Vérifier l'enregistrement du temps
- [ ] Tester la progression entre les séries
- [ ] Valider les statistiques de progression
- [ ] Tester en mode hors-ligne (PWA)

## 📅 Roadmap

### Version 2.0 - Exercices statiques
- [ ] Implémenter le chronomètre pour exercices statiques
- [ ] Ajouter des exercices statiques au catalogue par défaut
- [ ] Créer des graphiques de progression spécifiques

### Version 2.1 - Améliorations audio
- [ ] Notification sonore fin de repos
- [ ] Compte à rebours vocal
- [ ] Sons de motivation personnalisables

### Version 2.2 - Social & Partage
- [ ] Partager ses séances sur les réseaux
- [ ] Défis entre amis
- [ ] Classements communautaires

### Version 2.3 - Intelligence artificielle
- [ ] Suggestions d'exercices basées sur l'historique
- [ ] Ajustement automatique des charges/temps
- [ ] Détection de fatigue et suggestions de repos

## 💡 Suggestions d'améliorations

Vous avez des idées ? N'hésitez pas à :
1. Créer une issue sur GitHub
2. Proposer une pull request
3. Contacter l'équipe de développement

---

**Date de dernière mise à jour :** 10 décembre 2024
**Prochaine revue :** Janvier 2025
