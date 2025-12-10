# 🤖 Déploiement Automatique avec GitHub Actions

## Configuration (Méthode simple - Mot de passe)

### 1. Ajouter les secrets GitHub

1. Allez sur votre dépôt GitHub : https://github.com/Paulclaus67/Fit-Forge-Muscu
2. Cliquez sur **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **New repository secret**

Ajoutez ces **3 secrets** :

#### `VPS_HOST`
```
193.70.84.47
```

#### `VPS_USERNAME`
```
ubuntu
```

#### `VPS_PASSWORD`
```
[Votre mot de passe SSH ubuntu]
```

C'est tout ! Pas besoin de générer de clés SSH ! 🎉

### 2. Tester le déploiement

Une fois les 3 secrets ajoutés :

```powershell
cd C:\Users\pclau\application\muscu-pwa

# Faire un petit commit test
git commit --allow-empty -m "test: déploiement automatique"
git push origin prod
```

### 3. Voir les logs de déploiement

1. Allez sur GitHub → **Actions**
2. Cliquez sur le dernier workflow "Deploy to Production"
3. Vous verrez tous les logs en temps réel

## Avantages

✅ **Pas de clé SSH à générer**  
✅ **Configuration en 2 minutes**  
✅ **Push sur prod = déploiement automatique**  
✅ **Logs centralisés dans GitHub**  

## Sécurité

- ✅ Le mot de passe est chiffré dans les GitHub Secrets
- ✅ Seul GitHub Actions peut l'utiliser
- ✅ Pas d'exposition des credentials

## Workflow de déploiement

```
1. Vous : git push origin prod
         ↓
2. GitHub : Détecte le push sur prod
         ↓
3. GitHub Actions : Se connecte au VPS via SSH
         ↓
4. VPS : Pull le code + Rebuild Docker + Restart
         ↓
5. ✅ Déploiement terminé !
```

## Alternative avancée : Avec clé SSH

Si vous préférez une **clé SSH dédiée** (plus sécurisé) au lieu du mot de passe :

### Générer une clé SSH

Sur votre VPS :

```bash
# Se connecter au VPS
ssh ubuntu@193.70.84.47

# Créer une nouvelle paire de clés pour GitHub Actions
mkdir -p ~/.ssh
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy -N ""

# Afficher la clé publique
cat ~/.ssh/github_actions_deploy.pub

# Afficher la clé privée (pour GitHub)
cat ~/.ssh/github_actions_deploy
```

### Ajouter à GitHub Secrets

Remplacez le secret `VPS_PASSWORD` par `VPS_SSH_KEY` :

1. Supprimes le secret `VPS_PASSWORD` 
2. Créez un nouveau secret `VPS_SSH_KEY`
3. Collez le contenu complet de la clé privée

### Modifiez le workflow

Remplacez `password: ${{ secrets.VPS_PASSWORD }}` par `key: ${{ secrets.VPS_SSH_KEY }}`

## Commandes utiles

### Désactiver temporairement le déploiement
Renommez `.github/workflows/deploy-prod.yml` en `.github/workflows/deploy-prod.yml.disable`

### Forcer un redéploiement
```bash
git commit --allow-empty -m "chore: redéploiement manuel"
git push origin prod
```

### Voir tous les déploiements
https://github.com/Paulclaus67/Fit-Forge-Muscu/actions
