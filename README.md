# 💪 Muscu PWA

Application web progressive (PWA) pour la gestion et le suivi d'entraînements de musculation.

## 📋 Description

Muscu PWA est une application complète permettant de :
- 📊 Suivre vos séances d'entraînement
- 🗓️ Planifier votre programme hebdomadaire
- 📈 Visualiser votre progression
- 💾 Gérer vos exercices personnalisés
- 🎨 Profiter d'une interface moderne avec thèmes clair/sombre

## 🚀 Technologies

### Frontend
- **React** 19.2 avec TypeScript
- **Vite** pour le build rapide
- **Tailwind CSS** pour le styling
- **React Router** pour la navigation
- **Chart.js** pour les graphiques
- **PWA** avec service worker

### Backend
- **Node.js** avec Express
- **TypeScript**
- **Prisma ORM** avec SQLite
- **JWT** pour l'authentification
- **bcrypt** pour le hashing des mots de passe

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Étapes d'installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/votre-username/muscu-pwa.git
cd muscu-pwa
```

2. **Installer les dépendances du backend**
```bash
cd backend
npm install
```

3. **Configurer la base de données**
```bash
# Créer le fichier .env dans le dossier backend
# DATABASE_URL="file:./dev.db"
# JWT_SECRET="votre_secret_jwt"
# PORT=4000

# Exécuter les migrations
npm run prisma:migrate

# (Optionnel) Peupler la base avec des données de test
npx prisma db seed
```

4. **Installer les dépendances du frontend**
```bash
cd ../frontend
npm install
```

## 🎮 Utilisation

### Développement

**Option 1 : Démarrage rapide avec npm (recommandé)**
```bash
npm run dev
```
Cette commande démarre automatiquement le backend ET le frontend.

**Option 2 : Avec PowerShell**
```powershell
.\dev.ps1
```

**Option 3 : Avec Docker**
```bash
docker-compose up
```

**Option 4 : Démarrage manuel**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**URLs d'accès:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:4000`
- Prisma Studio: `npm run prisma:studio` (dans `/backend`)

### Production

**Build du frontend :**
```bash
cd frontend
npm run build
```

**Build du backend :**
```bash
cd backend
npm run build
npm start
```

## 📁 Structure du projet

```
muscu-pwa/
├── .github/             # GitHub Actions & Templates
│   ├── workflows/       # CI/CD pipelines
│   └── ISSUE_TEMPLATE/  # Templates d'issues
├── .vscode/             # Configuration VS Code
├── backend/             # API Node.js
│   ├── prisma/          # Schéma et migrations de la BDD
│   ├── src/
│   │   ├── routes/      # Routes API
│   │   ├── middleware/  # Middlewares Express
│   │   └── utils/       # Utilitaires
│   ├── Dockerfile       # Container backend
│   └── package.json
├── frontend/            # Application React
│   ├── src/
│   │   ├── api/        # Clients API
│   │   ├── components/ # Composants React
│   │   ├── context/    # Context API
│   │   ├── hooks/      # Hooks personnalisés
│   │   └── pages/      # Pages de l'application
│   ├── Dockerfile       # Container frontend
│   └── package.json
├── docker-compose.yml   # Orchestration Docker
├── API_DOCUMENTATION.md # Documentation API complète
├── CONTRIBUTING.md      # Guide de contribution
└── README.md
```

## 🔑 Fonctionnalités principales

### Authentification
- Inscription et connexion sécurisées
- Gestion de session avec JWT
- Protection des routes

### Gestion des exercices
- Liste complète des exercices
- Détails avec instructions
- Filtrage et recherche
- Favoris

### Planification
- Programme hebdomadaire personnalisé
- Séances d'entraînement organisées
- Suivi de progression

### Interface utilisateur
- Design responsive
- Mode clair/sombre
- Animations fluides
- PWA installable

## 🎨 Thèmes

L'application supporte deux thèmes avec une palette de couleurs optimisée :
- **Thème clair** : Interface lumineuse et épurée
- **Thème sombre** : Confort visuel en conditions de faible luminosité

## 🔧 Scripts disponibles

### Backend
- `npm run dev` - Démarrage en mode développement
- `npm run build` - Build pour production
- `npm start` - Démarrage du serveur en production
- `npm run prisma:migrate` - Exécuter les migrations
- `npm run prisma:studio` - Ouvrir Prisma Studio

### Frontend
- `npm run dev` - Serveur de développement
- `npm run build` - Build pour production
- `npm run preview` - Prévisualiser le build
- `npm run lint` - Linter le code

## 📝 API Endpoints

Consultez la [documentation API complète](./API_DOCUMENTATION.md) pour tous les détails.

### Aperçu rapide

- **Authentification** : `/auth/register`, `/auth/login`, `/auth/me`
- **Exercices** : `/exercises`, `/exercises/:id`
- **Entraînements** : `/workouts` (GET, POST, PUT, DELETE)
- **Plan hebdomadaire** : `/weekly-plan` (GET, PUT)

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez le [guide de contribution](./CONTRIBUTING.md) pour commencer.

### Liens utiles

- 📚 [Documentation API](./API_DOCUMENTATION.md)
- 🤝 [Guide de contribution](./CONTRIBUTING.md)
- 🐛 [Signaler un bug](https://github.com/Paulclaus67/Fit-Forge-Muscu/issues/new?template=bug_report.md)
- ✨ [Proposer une fonctionnalité](https://github.com/Paulclaus67/Fit-Forge-Muscu/issues/new?template=feature_request.md)

## 🚀 Déploiement

### Avec Docker
```bash
docker-compose up -d
```

### Build manuel
```bash
npm run build
```

### Variables d'environnement de production
Assurez-vous de configurer :
- `DATABASE_URL` - Chemin vers la base de données
- `JWT_SECRET` - Clé secrète forte et unique
- `PORT` - Port du serveur (défaut: 4000)
- `NODE_ENV=production`

## 📊 Badges

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19.2-blue)
![Node](https://img.shields.io/badge/Node-18+-green)

## 📄 Licence

MIT - Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 👤 Auteur

**Paulclaus67**
- GitHub: [@Paulclaus67](https://github.com/Paulclaus67)
- Projet: [Fit Forge Muscu](https://github.com/Paulclaus67/Fit-Forge-Muscu)

Créé avec ❤️ pour les passionnés de musculation 💪
