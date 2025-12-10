# 🤝 Guide de Contribution

Merci de contribuer à **Fit Forge Muscu** ! Ce document vous guidera dans le processus de contribution.

## 📋 Table des matières

- [Code de Conduite](#code-de-conduite)
- [Comment Contribuer](#comment-contribuer)
- [Configuration de Développement](#configuration-de-développement)
- [Structure du Projet](#structure-du-projet)
- [Standards de Code](#standards-de-code)
- [Process de Pull Request](#process-de-pull-request)

## 🤖 Code de Conduite

- Soyez respectueux et inclusif
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est bon pour la communauté
- Faites preuve d'empathie envers les autres membres

## 💡 Comment Contribuer

### Signaler des Bugs

1. Vérifiez que le bug n'a pas déjà été signalé dans les [Issues](https://github.com/Paulclaus67/Fit-Forge-Muscu/issues)
2. Créez une nouvelle issue avec le label `bug`
3. Incluez :
   - Description claire du problème
   - Étapes pour reproduire
   - Comportement attendu vs actuel
   - Captures d'écran si applicable
   - Environnement (OS, navigateur, version Node)

### Proposer des Fonctionnalités

1. Créez une issue avec le label `enhancement`
2. Décrivez clairement la fonctionnalité souhaitée
3. Expliquez pourquoi elle serait utile
4. Proposez une implémentation possible

### Soumettre du Code

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add: amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 🛠️ Configuration de Développement

### Prérequis

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Installation

```bash
# Cloner le repo
git clone https://github.com/Paulclaus67/Fit-Forge-Muscu.git
cd Fit-Forge-Muscu

# Installer toutes les dépendances
npm run install:all

# Configurer la base de données
npm run setup

# Démarrer en développement
npm run dev
```

### Variables d'Environnement

Créez un fichier `.env` dans le dossier `backend/` :

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=4000
```

## 📁 Structure du Projet

```
muscu-pwa/
├── backend/              # API Express + Prisma
│   ├── prisma/          # Schéma et migrations BDD
│   ├── src/
│   │   ├── routes/      # Routes API
│   │   ├── middleware/  # Middlewares
│   │   └── utils/       # Utilitaires
│   └── package.json
├── frontend/            # App React + Vite
│   ├── src/
│   │   ├── api/        # Clients API
│   │   ├── components/ # Composants React
│   │   ├── pages/      # Pages
│   │   └── context/    # Context API
│   └── package.json
└── package.json        # Scripts racine
```

## ✨ Standards de Code

### TypeScript

- Utilisez TypeScript strict mode
- Typez tous les paramètres et retours de fonction
- Évitez `any`, préférez `unknown` si nécessaire

### Style de Code

- **Prettier** pour le formatage (automatique)
- **ESLint** pour le linting
- Format automatique à la sauvegarde (VS Code)

```bash
# Linter le code
npm run lint

# Formater le code
npm run format
```

### Conventions de Nommage

- **Fichiers** : `camelCase.ts` ou `PascalCase.tsx` (composants)
- **Variables/Fonctions** : `camelCase`
- **Classes/Types/Interfaces** : `PascalCase`
- **Constantes** : `UPPER_SNAKE_CASE`
- **Composants React** : `PascalCase`

### Commits

Utilisez des messages de commit clairs avec préfixes :

- `Add:` Nouvelle fonctionnalité
- `Fix:` Correction de bug
- `Update:` Mise à jour de code existant
- `Refactor:` Refactoring sans changement de fonctionnalité
- `Docs:` Documentation
- `Style:` Formatage, style
- `Test:` Ajout ou modification de tests
- `Chore:` Tâches de maintenance

**Exemples :**
```bash
git commit -m "Add: user profile picture upload"
git commit -m "Fix: workout not saving properly"
git commit -m "Update: improve dashboard performance"
```

## 🔄 Process de Pull Request

### Avant de Soumettre

- [ ] Le code compile sans erreurs
- [ ] Le linter passe sans warnings
- [ ] Tous les tests passent (si applicables)
- [ ] La documentation est à jour
- [ ] Les commits sont clairs et bien organisés

### Template de PR

```markdown
## Description
[Décrivez vos changements]

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Checklist
- [ ] Code testé localement
- [ ] Linter passé
- [ ] Documentation mise à jour
- [ ] Capture d'écran ajoutée (si UI)

## Screenshots (si applicable)
[Ajoutez des captures d'écran]
```

### Review Process

1. Au moins un mainteneur doit approuver
2. Tous les commentaires doivent être résolus
3. Les tests CI/CD doivent passer
4. Le code sera mergé par un mainteneur

## 🧪 Tests

```bash
# Lancer les tests (à venir)
npm test

# Tests avec coverage
npm run test:coverage
```

## 📝 Documentation

- Commentez le code complexe
- Mettez à jour le README si nécessaire
- Documentez les nouvelles APIs
- Ajoutez des exemples d'utilisation

## 🐛 Debug

### Backend
```bash
cd backend
npm run dev
# Utiliser le debugger VS Code (F5)
```

### Frontend
```bash
cd frontend
npm run dev
# Ouvrir les DevTools du navigateur
```

## 🎨 Design System

- Utilisez Tailwind CSS pour le styling
- Respectez les composants UI existants dans `frontend/src/components/ui/`
- Maintenez la cohérence avec le design actuel
- Testez en mode clair ET sombre

## 🌍 Internationalisation

- Actuellement en français
- Pour ajouter d'autres langues, créer une issue d'abord

## 📱 PWA

- Testez les fonctionnalités offline
- Vérifiez que les service workers fonctionnent
- Testez sur mobile (responsive)

## 🔒 Sécurité

- Ne committez JAMAIS de secrets ou tokens
- Utilisez les variables d'environnement
- Validez toutes les entrées utilisateur
- Signalez les vulnérabilités en privé

## 💬 Questions ?

- Ouvrez une [Discussion](https://github.com/Paulclaus67/Fit-Forge-Muscu/discussions)
- Contactez les mainteneurs
- Consultez la documentation existante

## 📄 Licence

En contribuant, vous acceptez que vos contributions soient sous licence MIT.

---

**Merci de contribuer à Fit Forge Muscu ! 💪**
