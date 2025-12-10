# 🤖 Déploiement Automatique avec GitHub Actions

## Configuration

### 1. Générer une clé SSH pour GitHub Actions

Sur votre **machine locale** (pas le VPS) :

```bash
# Générer une nouvelle paire de clés SSH
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Afficher la clé privée (à copier dans GitHub Secrets)
cat ~/.ssh/github_actions_deploy

# Afficher la clé publique (à ajouter au VPS)
cat ~/.ssh/github_actions_deploy.pub
```

### 2. Ajouter la clé publique au VPS

Connectez-vous à votre VPS et ajoutez la clé publique :

```bash
ssh ubuntu@votre-vps

# Ajouter la clé publique aux authorized_keys
nano ~/.ssh/authorized_keys
# Collez la clé publique (celle qui finit par github-actions-deploy)
# Sauvegardez avec Ctrl+X, Y, Enter

# Vérifier les permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### 3. Configurer les secrets GitHub

1. Allez sur votre dépôt GitHub : https://github.com/Paulclaus67/Fit-Forge-Muscu
2. Cliquez sur **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **New repository secret**

Ajoutez ces 3 secrets :

#### `VPS_HOST`
```
193.70.84.47
```
(ou votre nom de domaine si vous préférez)

#### `VPS_USERNAME`
```
ubuntu
```
(ou votre nom d'utilisateur SSH)

#### `VPS_SSH_KEY`
```
-----BEGIN OPENSSH PRIVATE KEY-----
[Collez ici le contenu COMPLET de ~/.ssh/github_actions_deploy]
-----END OPENSSH PRIVATE KEY-----
```

### 4. Tester le déploiement automatique

Une fois configuré, il suffit de :

```bash
# Sur votre machine locale
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin prod
```

Et GitHub Actions déploiera automatiquement sur votre VPS ! 🎉

### 5. Voir les logs de déploiement

1. Allez sur GitHub → **Actions**
2. Cliquez sur le dernier workflow "Deploy to Production"
3. Vous verrez tous les logs du déploiement en temps réel

## Avantages

✅ **Push automatique** : Pushez sur `prod` et c'est déployé  
✅ **Logs centralisés** : Tous les logs dans GitHub  
✅ **Rollback facile** : Revertez un commit et c'est redéployé  
✅ **Pas de connexion SSH manuelle** : Tout est automatisé  

## Sécurité

- ✅ La clé SSH est chiffrée dans les GitHub Secrets
- ✅ Seul GitHub Actions peut l'utiliser
- ✅ Pas d'exposition des credentials
- ✅ Clé dédiée au déploiement (peut être révoquée sans affecter vos accès)

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

## Commandes utiles

### Désactiver temporairement le déploiement automatique
Renommez `.github/workflows/deploy-prod.yml` en `.github/workflows/deploy-prod.yml.disabled`

### Tester la connexion SSH
```bash
ssh -i ~/.ssh/github_actions_deploy ubuntu@193.70.84.47
```

### Révoquer la clé de déploiement
Sur le VPS :
```bash
nano ~/.ssh/authorized_keys
# Supprimez la ligne avec "github-actions-deploy"
```

---

**Important :** Ne commitez JAMAIS la clé privée dans le repository ! Elle doit rester uniquement dans les GitHub Secrets.
