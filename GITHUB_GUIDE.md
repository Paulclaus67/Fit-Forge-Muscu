# 🚀 Guide de publication sur GitHub

Ce guide vous explique comment publier votre projet Muscu PWA sur GitHub.

## 📋 Prérequis

- Compte GitHub (créez-en un sur https://github.com si vous n'en avez pas)
- Git installé sur votre machine (déjà fait ✅)

## 🎯 Étapes pour créer et pousser votre dépôt

### 1. Créer un nouveau dépôt sur GitHub

1. Allez sur https://github.com
2. Connectez-vous à votre compte
3. Cliquez sur le bouton **"+"** en haut à droite, puis **"New repository"**
4. Remplissez les informations :
   - **Repository name** : `muscu-pwa` (ou un autre nom de votre choix)
   - **Description** : "Application PWA pour la gestion d'entraînements de musculation"
   - **Public** ou **Private** : choisissez selon vos préférences
   - ⚠️ **NE cochez PAS** "Initialize this repository with a README" (nous avons déjà un README)
   - ⚠️ **NE cochez PAS** "Add .gitignore" (nous avons déjà un .gitignore)
   - ⚠️ **NE cochez PAS** "Choose a license" (nous avons déjà une licence)
5. Cliquez sur **"Create repository"**

### 2. Lier votre dépôt local à GitHub

Une fois le dépôt créé, GitHub vous affichera des instructions. Utilisez celles-ci dans PowerShell :

```powershell
cd c:\Users\pclau\application\muscu-pwa
git remote add origin https://github.com/VOTRE-USERNAME/muscu-pwa.git
git branch -M main
git push -u origin main
```

**Remplacez** `VOTRE-USERNAME` par votre nom d'utilisateur GitHub !

### 3. Commandes complètes à exécuter

Voici toutes les commandes à copier-coller dans PowerShell :

```powershell
# Se placer dans le projet
cd c:\Users\pclau\application\muscu-pwa

# Ajouter le remote GitHub (MODIFIEZ VOTRE-USERNAME !)
git remote add origin https://github.com/VOTRE-USERNAME/muscu-pwa.git

# Renommer la branche en 'main'
git branch -M main

# Pousser vers GitHub
git push -u origin main
```

### 4. Authentification

Lors du premier push, Git vous demandera de vous authentifier :

#### Option A : Token d'accès personnel (recommandé)
1. Allez dans **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**
2. Cliquez sur **Generate new token** > **Generate new token (classic)**
3. Donnez un nom : "Muscu PWA"
4. Sélectionnez les scopes : `repo` (cochez toute la section)
5. Cliquez sur **Generate token**
6. **COPIEZ LE TOKEN** (vous ne pourrez plus le voir après !)
7. Utilisez ce token comme mot de passe lors du push

#### Option B : GitHub CLI
```powershell
# Installer GitHub CLI si pas déjà fait
winget install GitHub.cli

# S'authentifier
gh auth login
```

## ✅ Vérification

Une fois poussé, allez sur `https://github.com/VOTRE-USERNAME/muscu-pwa` pour voir votre projet en ligne !

## 🔄 Commandes Git utiles pour la suite

### Ajouter des modifications
```powershell
git add .
git commit -m "Description de vos changements"
git push
```

### Voir l'état du dépôt
```powershell
git status
```

### Voir l'historique
```powershell
git log --oneline
```

### Créer une branche
```powershell
git checkout -b nom-de-la-branche
git push -u origin nom-de-la-branche
```

## 📝 Fichiers sensibles

⚠️ **IMPORTANT** : Le fichier `.gitignore` est configuré pour exclure :
- Les fichiers `.env` (secrets et mots de passe)
- Les `node_modules/`
- La base de données `*.db`
- Les fichiers de build

**N'oubliez pas** de configurer les variables d'environnement sur votre serveur de production !

## 🎨 Badges GitHub (optionnel)

Vous pouvez ajouter des badges en haut du README.md :

```markdown
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19.2-blue)
![Node](https://img.shields.io/badge/Node-18+-green)
```

## 🌐 GitHub Pages (optionnel)

Si vous voulez héberger la documentation :

1. Allez dans **Settings** > **Pages**
2. Source : Déploiement depuis une branche
3. Branche : `main` / dossier `/ (root)`
4. Cliquez sur **Save**

## 🤝 Collaborer

Pour ajouter des collaborateurs :
1. Allez dans **Settings** > **Collaborators**
2. Cliquez sur **Add people**
3. Entrez leur nom d'utilisateur GitHub

## 📱 Commandes rapides récapitulatives

```powershell
# Configuration initiale (une seule fois)
git remote add origin https://github.com/VOTRE-USERNAME/muscu-pwa.git
git branch -M main
git push -u origin main

# Workflow quotidien
git add .
git commit -m "Description des changements"
git push

# Récupérer les dernières modifications
git pull
```

---

**Félicitations ! 🎉** Votre projet est maintenant sur GitHub !
