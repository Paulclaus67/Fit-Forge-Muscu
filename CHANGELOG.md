# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.1.0] - 2025-12-10

### ✨ Ajouté
- **Wake Lock API** : L'écran reste maintenant allumé pendant toute la durée de la séance
  - Empêche la mise en veille automatique du téléphone
  - Se réactive automatiquement si l'application revient au premier plan
  - Compatible iOS et Android
- Documentation des fonctionnalités futures (FUTURE_FEATURES.md)
  - Roadmap pour le chronomètre d'exercices statiques (chaise, planche, etc.)
  - Planification des versions 2.x

### 🐛 Corrigé
- **Chrono de repos** : Démarre maintenant automatiquement après avoir cliqué sur "Série terminée"
- **Problème de mise en veille** : Le téléphone ne se met plus en veille pendant l'entraînement
- **Problème de rechargement** : L'application ne recharge plus la page lors du retour de l'arrière-plan

### 🔧 Amélioré
- **Responsivité** : La page d'exercice s'adapte maintenant à toutes les tailles d'écran
  - Support des petits écrans (320px+)
  - Support des écrans paysage
  - Utilisation des unités viewport dynamiques (dvh/dvw)
  - Media queries optimisées pour tous les formats
- **CSS** : Amélioration du chrono géant avec des breakpoints plus précis
- **TypeScript** : Ajout des types pour l'API Wake Lock

### 📝 Documentation
- Création du fichier FUTURE_FEATURES.md pour la roadmap
- Documentation de l'implémentation future du chronomètre pour exercices statiques

## [1.0.0] - 2025-12-10

### ✨ Ajouté
- Configuration complète VS Code avec settings, extensions et debug
- Scripts de développement automatisés (dev.ps1, dev.sh)
- Package.json racine avec scripts unifiés
- GitHub Actions pour CI/CD
- Templates d'issues GitHub (bug report, feature request)
- Docker et Docker Compose pour le développement
- Documentation API complète
- Guide de contribution (CONTRIBUTING.md)
- Configuration Prettier pour le formatage
- Badges et liens utiles dans README
- Configuration TypeScript améliorée

### 🔧 Modifié
- README.md restructuré avec plus d'informations
- Structure de projet documentée
- Instructions de démarrage améliorées

### 🧹 Supprimé
- Fichiers markdown temporaires de documentation

### 🔐 Sécurité
- Configuration .gitignore renforcée
- Variables d'environnement sécurisées
- Limite de taille pour les uploads (10MB)

---

## [0.1.0] - 2025-12-10

### ✨ Version initiale
- Application PWA avec React 19 et TypeScript
- Backend Express avec Prisma ORM
- Authentification JWT
- Gestion des exercices et workouts
- Plan hebdomadaire personnalisé
- Système de thèmes (clair/sombre)
- Base de données SQLite
- Service Worker pour mode offline
