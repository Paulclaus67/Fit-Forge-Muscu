# 🌳 Stratégie de Branching

Ce document décrit la stratégie de branching utilisée dans FitForge Muscu.

## Vue d'ensemble

```
main (production releases)
  ↑
prod (current production)
  ↑
develop (staging/integration)
  ↑
feature/* (features)
bugfix/* (bug fixes)
hotfix/* (urgent fixes)
```

## Types de branches

### 1️⃣ `main` - Production Stable

**Statut**: ✅ Production
**Protection**: ✅ Protégée (2 reviews required)
**Règle de merge**: Merge depuis `prod` uniquement
**Versioning**: Tagged releases (v1.0.0)

```bash
# Créer une release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### 2️⃣ `prod` - Production Actuelle

**Statut**: 🔴 Live en production
**Protection**: ✅ Protégée
**Règle de merge**: Merge depuis `develop` après validation
**Auto-deploy**: ✅ Oui (GitHub Actions)

```bash
# Déployer
git checkout prod
git merge develop
git push origin prod  # ← Déclenche le déploiement
```

### 3️⃣ `develop` - Branche d'Intégration

**Statut**: 🟡 Staging
**Protection**: ⚠️ Pas de force push
**Règle de merge**: Merge depuis feature/* après review
**Environnement**: Staging/Testing

```bash
# Créer une feature
git checkout -b feature/ma-feature
...
# Créer une PR vers develop
```

### 4️⃣ `feature/*` - Nouvelles Fonctionnalités

**Format**: `feature/description-courte`
**Source**: `develop`
**Cible**: `develop` (via PR)
**Durée**: 1-7 jours typiquement

```bash
# Exemple
git checkout -b feature/add-dark-mode
git commit -m "feat: Add dark mode toggle"
git push origin feature/add-dark-mode
# → Créer une PR vers develop
```

### 5️⃣ `bugfix/*` - Corrections de Bugs

**Format**: `bugfix/description-courte`
**Source**: `develop`
**Cible**: `develop` (via PR)
**Durée**: 1-2 jours typiquement

```bash
# Exemple
git checkout -b bugfix/fix-login-validation
git commit -m "fix: Fix email validation in login form"
git push origin bugfix/fix-login-validation
# → Créer une PR vers develop
```

### 🚨 `hotfix/*` - Correctifs Urgents

**Format**: `hotfix/description-courte`
**Source**: `prod` ou `main`
**Cible**: `prod` ET `develop`
**Durée**: ASAP
**Severity**: Critique

```bash
# Urgent! Un bug en production
git checkout -b hotfix/fix-payment-issue
git commit -m "fix(hotfix): Fix critical payment bug"

# Merge dans prod immédiatement
git checkout prod
git merge --no-ff hotfix/fix-payment-issue
git push origin prod  # ← Deploy immédiat

# Aussi dans develop
git checkout develop
git merge --no-ff hotfix/fix-payment-issue
git push origin develop
```

## Workflow par exemple

### Ajouter une nouvelle feature

```bash
# 1. Mettre à jour develop
git checkout develop
git pull origin develop

# 2. Créer une branche feature
git checkout -b feature/add-export-workout

# 3. Développer
# ... editer les fichiers ...
git add .
git commit -m "feat: Add export workout to CSV"

# 4. Pousser et créer une PR
git push origin feature/add-export-workout
# Sur GitHub: Create Pull Request vers develop

# 5. Reviewer approuve et merge
# Sur GitHub: Squash and merge

# 6. Supprimer la branche locale
git branch -d feature/add-export-workout
```

### Promouvoir de develop → prod

```bash
# 1. Vérifier que develop est stable
git checkout develop
git pull origin develop

# 2. Vérifier les tests
npm test

# 3. Merger dans prod
git checkout prod
git merge develop
git push origin prod
# ← GitHub Actions déclenche le déploiement

# 4. Vérifier le déploiement
# Allez sur production et testez
```

### Déployer un hotfix critique

```bash
# 1. Le bug est en production prod
# 2. Créer une hotfix
git checkout -b hotfix/critical-bug
# ... fixer le bug ...
git commit -m "fix(hotfix): Critical bug fix"

# 3. Merger dans prod IMMÉDIATEMENT
git checkout prod
git merge hotfix/critical-bug
git push origin prod  # ← Deploy rapide

# 4. Merger aussi dans develop
git checkout develop
git merge hotfix/critical-bug
git push origin develop

# 5. Nettoyer
git branch -d hotfix/critical-bug
```

## Règles importantes

✅ **À faire**:
- Créer une branche par feature/bugfix
- Faire des commits clairs et descriptifs
- Utiliser des PR pour la review
- Tester avant de merger
- Squash and merge pour un historique propre

❌ **À éviter**:
- Commiter directement sur develop/prod
- Force push sur les branches protégées
- Commits avec des messages vagues ("fix", "update")
- Merger sans review
- Laisser des branches mortes

## Protection des branches

Les branches principales sont protégées:

| Branche | Règles |
|---------|--------|
| `main` | Require 2 PR reviews, require status checks |
| `prod` | Require 1 PR review, require status checks, auto-merge |
| `develop` | Require 1 PR review, require status checks |

## Cleanup automatique

```bash
# Supprimer les branches locales qui n'existent plus
git fetch -p

# Supprimer toutes les branches feature finies
git branch -d feature/*
```

## Questions fréquentes

**Q: Quelle branche dois-je utiliser?**
A: Pour une feature → `feature/*`, pour un bug → `bugfix/*`

**Q: Comment puis-je synchroniser ma branche avec develop?**
A: 
```bash
git fetch origin
git rebase origin/develop
# ou si déjà en conflit
git pull origin develop
```

**Q: J'ai commité sur la mauvaise branche!**
A:
```bash
git reset HEAD~1  # Annuler le commit
git stash         # Sauvegarder les changements
git checkout feature/correcte
git stash pop     # Restaurer
```

**Q: Comment forcer un merge?**
A: 
```bash
git merge --no-ff feature/ma-feature  # Crée un merge commit
```
