# 🔧 Configuration des Secrets GitHub pour le Déploiement

## ⚠️ Statut actuel
Le déploiement automatique est configuré mais **nécessite les secrets GitHub**.

## 📋 Secrets à configurer

Pour que le déploiement fonctionne, vous devez ajouter ces secrets dans les paramètres GitHub:

### 🔐 Secrets requis (pour VPS)

| Secret | Valeur | Description |
|--------|--------|-------------|
| `VPS_HOST` | `193.70.84.47` | Adresse IP du VPS |
| `VPS_USERNAME` | `root` | Utilisateur SSH (généralement `root`) |
| `VPS_PASSWORD` | `votre_password` | Mot de passe SSH du VPS |
| `VPS_PORT` | `22` | Port SSH (défaut: 22) |

### 📍 Comment ajouter les secrets

#### Étape 1: Aller aux paramètres
1. Allez sur: https://github.com/Paulclaus67/Fit-Forge-Muscu
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Secrets and variables**
4. Cliquez sur **Actions**

#### Étape 2: Ajouter chaque secret
1. Cliquez sur **New repository secret**
2. Remplissez les champs:
   - **Name**: (ex: `VPS_HOST`)
   - **Value**: (ex: `193.70.84.47`)
3. Cliquez sur **Add secret**

Répétez pour chaque secret.

### ✅ Checklist

- [ ] `VPS_HOST` ajouté
- [ ] `VPS_USERNAME` ajouté
- [ ] `VPS_PASSWORD` ajouté
- [ ] `VPS_PORT` ajouté (optionnel si défaut 22)

## 🚀 Après configuration

Une fois les secrets configurés:

1. **Le déploiement se déclenchera automatiquement** lors d'un `git push` sur la branche `prod`
2. **Ou déclenchez manuellement** en créant une release GitHub

```bash
# Créer un tag et déclencher le déploiement
git tag -a v1.0.1 -m "Release description"
git push origin v1.0.1
```

## 📊 Workflow de déploiement

```
git push → branch push → deploy-prod.yml → VPS deployment
                    ↓
           test.yml (tests)
                    ↓
           ci.yml (CI/CD)
```

## 🔍 Vérifier le statut du déploiement

Allez sur: https://github.com/Paulclaus67/Fit-Forge-Muscu/actions

Vous verrez:
- ✅ Status des workflows
- 📋 Logs détaillés
- ⏱️ Durée d'exécution

## 📝 Notes

- Les secrets ne sont **jamais affichés** dans les logs
- Ils sont **chiffrés** dans GitHub
- Seul le propriétaire peut les modifier

## 🆘 Problèmes courants

### Workflow échoue après configuration des secrets
- Vérifiez que les credentials SSH sont corrects
- Vérifiez la connectivité VPS (essayez: `ssh root@193.70.84.47`)
- Consultez les logs du workflow sur GitHub Actions

### Accès SSH refusé
- Vérifiez le mot de passe
- Vérifiez que SSH est activé sur le VPS
- Vérifiez le port (défaut: 22)

### Déploiement avorté
- Consultez les logs complets sur GitHub Actions
- Vérifiez que Docker est installé sur le VPS
- Vérifiez les permissions des fichiers

## 💡 Alternative: Déploiement manuel

Si les workflows ne fonctionnent pas, déployez manuellement:

```bash
# Se connecter au VPS
ssh root@193.70.84.47

# Aller au répertoire du projet
cd /opt/Fit-Forge-Muscu

# Mettre à jour le code
git fetch origin
git checkout prod
git pull origin prod

# Redémarrer les containers
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

---

**Une fois configuré, le déploiement sera totalement automatisé!** 🚀
