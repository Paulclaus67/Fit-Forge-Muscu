# 📖 GitHub Actions Setup

## Workflows configurés

### 1. **CI/CD Pipeline** (`.github/workflows/ci.yml`)
- ✅ Lint automatique
- ✅ Tests unitaires
- ✅ Build frontend
- ✅ Validation TypeScript

### 2. **Tests** (`.github/workflows/tests.yml`)
- ✅ Tests sur chaque PR
- ✅ Tests multi-navigateurs
- ✅ Coverage reporting

### 3. **Déploiement** (`.github/workflows/deploy-prod.yml`)
- ✅ Déploiement automatique sur push vers `prod`
- ✅ Build optimisé
- ✅ SSH vers VPS
- ✅ Rollback automatique en cas d'erreur

## Secrets GitHub à configurer

Pour que les workflows fonctionnent, configurez ces secrets dans les paramètres du repository:

### Secrets de déploiement
```
VPS_HOST        - Adresse IP/domaine du VPS
VPS_USER        - Utilisateur SSH
VPS_KEY         - Clé privée SSH
VPS_PORT        - Port SSH (généralement 22)
```

### Secrets de base de données (si nécessaire)
```
DATABASE_URL    - String de connexion PostgreSQL
```

## Configuration des secrets

1. Allez à: `Settings` > `Secrets and variables` > `Actions`
2. Cliquez sur `New repository secret`
3. Entrez le nom et la valeur
4. Cliquez sur `Add secret`

## Triggers automatiques

| Workflow | Trigger | Branche |
|----------|---------|---------|
| CI/CD | Push / PR | main, develop, prod |
| Tests | Push / PR | main, develop, prod |
| Deploy | Push | prod (production) |

## Vérifier les logs

Allez à: `Actions` > Sélectionnez un workflow > Cliquez sur un run

## Dépannage

### Les secrets ne fonctionnent pas
- ✅ Vérifiez que le secret existe
- ✅ Vérifiez le nom exact (sensible à la casse)
- ✅ Relancez le workflow

### Le déploiement échoue
- ✅ Vérifiez les logs GitHub Actions
- ✅ Vérifiez la connectivité SSH au VPS
- ✅ Vérifiez les permissions du répertoire sur le VPS

### Les tests échouent
- ✅ Exécutez localement: `npm test`
- ✅ Vérifiez les changements récents
- ✅ Consultez les détails du run GitHub
