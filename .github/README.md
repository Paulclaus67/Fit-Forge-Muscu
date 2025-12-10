# 🔄 CI/CD Pipeline

Ce dossier contient les workflows GitHub Actions pour l'intégration et le déploiement continus.

## 📋 Workflows Disponibles

### 1. CI/CD Pipeline (`ci.yml`)

Exécuté automatiquement sur chaque push et pull request vers `main` ou `develop`.

#### Jobs

**🔍 Lint & Type Check**
- Vérifie la syntaxe TypeScript (backend et frontend)
- Lance ESLint sur le frontend
- Bloque si des erreurs TypeScript sont détectées

**🧪 Run Tests** (À implémenter)
- Prêt pour l'ajout de tests unitaires
- Dépend du job Lint & Type Check

**🏗️ Build Application**
- Génère le client Prisma
- Compile le backend (TypeScript → JavaScript)
- Build le frontend pour production
- Upload les artifacts (7 jours de rétention)

**🔒 Security Audit**
- Scan des vulnérabilités npm
- Exécuté en parallèle (non bloquant)

### 2. Deploy to Production (`deploy.yml`)

Déclenché manuellement ou lors d'une release.

**Configuration requise :**
- Définir les secrets GitHub pour le déploiement
- Configurer la cible de déploiement

## 🚀 Utilisation

### Déclencher le CI

Le CI se déclenche automatiquement :
```bash
git push origin main
# ou
git push origin develop
```

### Déclencher le déploiement manuellement

1. Aller sur GitHub → Actions
2. Sélectionner "Deploy to Production"
3. Cliquer sur "Run workflow"

## ⚙️ Configuration

### Secrets Requis

Aucun secret requis pour le CI de base. Pour le déploiement, ajoutez :

```
Settings → Secrets and variables → Actions → New repository secret
```

### Variables d'Environnement

Les workflows utilisent Node.js 18. Pour changer :

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # Changer ici
```

## 📊 Status Badges

Ajoutez ces badges à votre README :

```markdown
![CI/CD](https://github.com/Paulclaus67/Fit-Forge-Muscu/actions/workflows/ci.yml/badge.svg)
```

## 🔧 Troubleshooting

### Le Lint échoue

Le linting est configuré pour accepter jusqu'à 50 warnings. Pour corriger :

```bash
cd frontend
npm run lint -- --fix
```

### TypeScript Check échoue

```bash
cd backend  # ou frontend
npx tsc --noEmit
```

Corrigez les erreurs affichées.

### Build échoue

Vérifiez localement :

```bash
npm run build:backend
npm run build:frontend
```

### Cache problématique

Si les dépendances causent des problèmes, GitHub Actions utilise un cache. 
Pour le vider : Settings → Actions → Caches → Delete

## 📝 Ajouter des Tests

Pour activer les tests dans le CI, décommentez dans `ci.yml` :

```yaml
- name: Run Backend Tests
  working-directory: ./backend
  run: npm test

- name: Run Frontend Tests
  working-directory: ./frontend
  run: npm test
```

Puis ajoutez les scripts dans `package.json` :

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 🎯 Bonnes Pratiques

1. **Toujours tester localement** avant de push
   ```bash
   npm run lint
   npm run build
   ```

2. **Commits atomiques** - Un commit = une fonctionnalité/fix

3. **Messages descriptifs** - Utilisez les préfixes conventionnels

4. **Pull Requests** - Utilisez des PR pour les features importantes

5. **Review** - Demandez une review avant de merger

## 📈 Améliorations Futures

- [ ] Ajouter des tests unitaires
- [ ] Ajouter des tests E2E (Playwright/Cypress)
- [ ] Coverage reporting (Codecov)
- [ ] Déploiement automatique sur merge
- [ ] Preview deployments pour les PR
- [ ] Notifications Slack/Discord
- [ ] Performance budgets

## 🔗 Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Actions Marketplace](https://github.com/marketplace?type=actions)

---

**Questions ?** Ouvrez une [Discussion](https://github.com/Paulclaus67/Fit-Forge-Muscu/discussions)
