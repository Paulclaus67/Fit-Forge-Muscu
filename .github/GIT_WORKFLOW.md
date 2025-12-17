# 🌳 Git Workflow

## Branches

### Branches principales
- **`main`** - Code stable en production (tagged releases)
- **`prod`** - Code actuellement en production (auto-déployé)
- **`develop`** - Branche de développement principale

### Branches de feature
- **`feature/*`** - Nouvelles fonctionnalités (ex: `feature/login-form`)
- **`bugfix/*`** - Correctifs de bugs (ex: `bugfix/validation-error`)
- **`hotfix/*`** - Correctifs urgents en prod (ex: `hotfix/critical-bug`)

## Flux de travail

### Créer une nouvelle feature

```bash
# 1. Mettre à jour develop
git checkout develop
git pull origin develop

# 2. Créer une branche feature
git checkout -b feature/ma-fonctionnalite

# 3. Faire les changements et committer
git commit -m "feat: description de la feature"

# 4. Pousser la branche
git push origin feature/ma-fonctionnalite

# 5. Créer une Pull Request sur GitHub
```

### Merger une PR

```bash
# Sur GitHub:
# 1. Attendez l'approbation
# 2. Tous les checks passent
# 3. Cliquez "Squash and merge" ou "Merge"
```

### Déployer en production

```bash
# 1. Créer une release
git tag v1.0.0
git push origin v1.0.0

# 2. Merger develop → main
git checkout main
git merge develop
git push origin main

# 3. Merger main → prod (auto-déploie)
git checkout prod
git merge main
git push origin prod
```

## Conventions de commits

Utilisez [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Documentation
- `style:` - Formatage, pas de code change
- `refactor:` - Refactorisation sans nouvelle feature
- `perf:` - Amélioration de performance
- `test:` - Ajout/modification de tests
- `chore:` - Changements de build, dépendances, etc.

### Exemples

```
feat(auth): Add JWT token refresh mechanism
fix(ui): Fix button styling on mobile devices
docs: Update installation guide
refactor(api): Simplify error handling
```

## Rules de protection des branches

### `main` et `prod`
- ✅ Require pull request reviews (2 minimum)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Dismiss stale pull request approvals
- ✅ Restrict who can push
- ✅ Require signed commits

### `develop`
- ✅ Require pull request reviews (1 minimum)
- ✅ Require status checks to pass
- ✅ Allow auto-merge

## Rebase vs Merge

**Préférez le squash and merge**:
```bash
git merge --squash feature/ma-feature
```

Avantages:
- ✅ Historique plus propre
- ✅ Commits logiquement groupés
- ✅ Facile à reverter
