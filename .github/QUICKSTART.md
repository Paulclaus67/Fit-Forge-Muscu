# 🚀 Démarrage rapide pour développeurs

Bienvenue dans FitForge Muscu! Ce guide vous aidera à démarrer.

## ⚡ En 5 minutes

### 1. Cloner et installer

```bash
git clone https://github.com/Paulclaus67/Fit-Forge-Muscu.git
cd Fit-Forge-Muscu

# Backend
cd backend && npm install && npm run dev

# Frontend (dans une autre terminal)
cd frontend && npm install && npm run dev
```

### 2. Ouvrir dans le navigateur

```
http://localhost:5173
```

### 3. Créer une branche

```bash
git checkout -b feature/ma-feature
```

### 4. Faire un commit

```bash
git commit -m "feat: description courte"
git push origin feature/ma-feature
```

### 5. Créer une Pull Request

Allez sur GitHub et cliquez "Create Pull Request"

---

## 📚 Documentation complète

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guide complet pour contribuer
- **[GIT_WORKFLOW.md](.github/GIT_WORKFLOW.md)** - Workflow Git
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Code de conduite
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - API endpoints
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Guide de déploiement

---

## 🐛 Trouver quelque chose à faire

### Facile (pour débuter)
- Consultez les issues avec le label `good first issue`
- Fixez des bugs simples
- Améliorez la documentation

### Intermédiaire
- Implémentez une feature demandée
- Refactorisez du code
- Améliorez la performance

### Avancé
- Refonte majeure
- Nouvelles architectures
- Optimisation complexe

---

## 💡 Tips & Tricks

### Exécuter les tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

### Vérifier le lint

```bash
npm run lint
npm run format
```

### Build production

```bash
cd frontend && npm run build
```

### Voir les logs

```bash
# Backend
npm run dev  # Logs en temps réel

# Frontend
npm run dev  # Logs en temps réel
```

---

## ❓ Questions fréquentes

### Où trouver l'API documentation?
→ Voir [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

### Comment déployer?
→ Voir [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### Comment configurer la base de données?
→ Voir [backend/README.md](backend/README.md)

### Où signaler un bug?
→ Ouvrez une [issue](../../issues)

### Comment demander une feature?
→ Ouvrez une [discussion](../../discussions)

---

## 🎯 Checklist avant de soumettre une PR

- [ ] J'ai lu CONTRIBUTING.md
- [ ] Mon code suit le style du projet
- [ ] J'ai testé mes changements
- [ ] Les tests passent localement
- [ ] J'ai écrit des commits clairs
- [ ] Ma PR a une description claire

---

## 🤝 Besoin d'aide?

- **Consultez la documentation**: Les réponses y sont généralement
- **Regardez les issues fermées**: Peut-être que quelqu'un a le même problème
- **Ouvrez une discussion**: Pour les questions générales
- **Contactez les mainteneurs**: Pour les problèmes bloquants

---

## 🎓 Ressources utiles

- [Git Tutorial](https://git-scm.com/book/en/v2)
- [GitHub Guides](https://guides.github.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)

---

Merci de contribuer à FitForge Muscu! 💪
