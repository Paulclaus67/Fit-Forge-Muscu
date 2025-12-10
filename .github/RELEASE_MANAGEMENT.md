# 📦 Release Management

## Versioning

Utilisez [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH
v1.2.3
```

- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

## Processus de Release

### 1. Préparation

```bash
# Créer une branche release
git checkout -b release/v1.0.0

# Mettre à jour la version
# - frontend/package.json
# - backend/package.json
# - CHANGELOG.md
```

### 2. Testing

```bash
# Build et test
npm run build
npm test
npm run lint
```

### 3. Merge et Tag

```bash
# Merger dans main
git checkout main
git merge --no-ff release/v1.0.0

# Créer un tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Pousser
git push origin main v1.0.0
```

### 4. Publication

- Allez sur GitHub > Releases
- Cliquez "Create a new release"
- Sélectionnez le tag créé
- Remplissez la description
- Publiez

### 5. Déploiement

```bash
# Merger dans prod (déclenche le déploiement)
git checkout prod
git merge main
git push origin prod
```

## CHANGELOG Format

```markdown
## [1.0.0] - 2025-12-10

### Added
- New feature description
- Another feature

### Changed
- Feature change description

### Fixed
- Bug fix description

### Deprecated
- Deprecated feature

### Removed
- Removed feature

### Security
- Security fix description

## [0.9.0] - 2025-12-05
...
```

## Release Checklist

- [ ] Version bumped (package.json)
- [ ] CHANGELOG mis à jour
- [ ] Tests passent
- [ ] Build réussit
- [ ] No console warnings
- [ ] Documentation mise à jour
- [ ] Tag créé
- [ ] Release GitHub publiée
- [ ] Déploiement OK
- [ ] Post-deploy checklist complété

## Hotfixes

Pour un bug critique en production:

```bash
# Créer une branche hotfix
git checkout -b hotfix/v1.0.1

# Fixer le bug et tester
...

# Merger dans prod et main
git checkout prod
git merge --no-ff hotfix/v1.0.1
git tag v1.0.1

git checkout main
git merge --no-ff hotfix/v1.0.1

# Pousser
git push origin prod main v1.0.1
```

## Rollback

Si quelque chose va mal en production:

```bash
# Revenir à la version précédente
git revert <commit-hash>
git push origin prod

# Ou reset à une version antérieure
git reset --hard v1.0.0
git push origin prod --force
```

⚠️ **Force push est dangereux - à éviter si possible!**

## Automatisation

Les workflows GitHub automatisent:
- ✅ Tests et linting
- ✅ Build production
- ✅ Déploiement sur `prod` branch
- ✅ Notifications

Consultez `.github/workflows/` pour plus de détails.
