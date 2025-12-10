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

**Démarrer le backend :**
```bash
cd backend
npm run dev
```
Le serveur démarre sur `http://localhost:4000`

**Démarrer le frontend :**
```bash
cd frontend
npm run dev
```
L'application est accessible sur `http://localhost:5173`

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
├── backend/              # API Node.js
│   ├── prisma/          # Schéma et migrations de la BDD
│   ├── src/
│   │   ├── routes/      # Routes API
│   │   ├── middleware/  # Middlewares Express
│   │   └── utils/       # Utilitaires
│   └── package.json
├── frontend/            # Application React
│   ├── src/
│   │   ├── api/        # Clients API
│   │   ├── components/ # Composants React
│   │   ├── context/    # Context API
│   │   ├── hooks/      # Hooks personnalisés
│   │   └── pages/      # Pages de l'application
│   └── package.json
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

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

### Exercices
- `GET /api/exercises` - Liste des exercices
- `GET /api/exercises/:id` - Détail d'un exercice

### Entraînements
- `GET /api/workouts` - Liste des workouts
- `POST /api/workouts` - Créer un workout
- `GET /api/workouts/:id` - Détail d'un workout
- `PUT /api/workouts/:id` - Modifier un workout
- `DELETE /api/workouts/:id` - Supprimer un workout

### Plan hebdomadaire
- `GET /api/weekly-plan` - Plan de la semaine
- `PUT /api/weekly-plan` - Mettre à jour le plan

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT

## 👤 Auteur

Créé avec ❤️ pour les passionnés de musculation
