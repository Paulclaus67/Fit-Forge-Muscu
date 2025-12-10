# 🌿 Git Workflow - Branches Strategy

## Structure des Branches

```
main (protected)
├── dev (development)
│   └── Features → Pull Request → main
└── prod (production)
    ├── Stable releases
    └── Hotfixes only
```

## 📋 Branches Disponibles

### 1. **main** (Protected - Integration)
- Branche de **release candidate**
- Reçoit les PRs validées de `dev`
- Représente les versions stables
- **Protection:** Require PR review + passing checks

### 2. **dev** (Development - Active)
- Branche de **développement principal**
- Tous les features y sont fusionnés
- Tests automatisés requis
- Se déploie sur **staging**

### 3. **prod** (Production - Stable)
- Branche de **production**
- Reçoit uniquement les **releases testées** de `main`
- **Zero tolerance** pour les bugs
- Se déploie en production

---

## 🚀 Workflow de Déploiement

```
Feature Branch
    ↓ (git commit + push)
Pull Request vers dev
    ↓ (tests automatisés)
Code Review + Merge
    ↓ (staging deployment)
Tests d'intégration
    ↓ (OK?)
Pull Request dev → main
    ↓ (release candidate)
QA/UAT tests
    ↓ (OK?)
Pull Request main → prod
    ↓ (production deployment)
✅ Live
```

---

## 💻 Commandes Courantes

### Créer une feature
```bash
git checkout dev
git pull origin dev
git checkout -b feature/nom-feature
# ... faire les changements
git commit -m "feat: description"
git push -u origin feature/nom-feature
# Ouvrir PR sur GitHub
```

### Mettre à jour dev
```bash
git checkout dev
git pull origin dev
```

### Fusionner dev → main (release)
```bash
git checkout main
git pull origin main
git merge --no-ff dev
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin main --tags
```

### Hotfix en production
```bash
git checkout prod
git pull origin prod
git checkout -b hotfix/bug-critical
# ... corriger le bug
git commit -m "fix: bug critique"
git push origin hotfix/bug-critical
# PR hotfix → prod + main
```

---

## 🔒 Protection des Branches

### main
- ✅ Require pull request reviews (min 1)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Restrict who can push

### prod
- ✅ Require pull request reviews (min 2)
- ✅ Require status checks to pass
- ✅ Require conversation resolution
- ✅ Restrict who can push (admin only)

---

## 🎯 Principes

| Branch | Purpose | Deploie à | Stabilité |
|--------|---------|-----------|-----------|
| **dev** | Développement | Staging | 🟡 Medium |
| **main** | Release candidate | Pre-prod | 🟢 High |
| **prod** | Production | Production | 🟢🟢 Very High |

---

## 📊 Status Actuel

```
✅ main: e41c590 (Lighthouse performance optimization + planning UI improvements)
✅ dev: Tracking origin/dev
✅ prod: Tracking origin/prod
```

**Branches pushées vers GitHub:** ✅

---

## 🔄 Sync avec GitHub

```bash
# Voir toutes les branches
git branch -a

# Mettre à jour depuis remote
git fetch origin

# Switch vers une branche
git checkout dev          # Passer à dev
git checkout prod         # Passer à prod

# Pull derniers changements
git pull origin dev
git pull origin prod
```

---

## ⚠️ Important

- **Ne jamais commit directement** sur `main` ou `prod`
- **Toujours utiliser des PRs** pour les changements
- **Tester localement** avant de pusher
- **Suivre les conventions de commit** (feat:, fix:, docs:)

---

**Créé le:** December 10, 2025  
**Branches actives:** 3 (main, dev, prod)  
**Commits:** 11 commits
