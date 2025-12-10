# 🚀 Déploiement VPS - Guide Express

## ⚡ Pour déployer en 5 minutes

### 1️⃣ Connexion SSH au VPS
```bash
ssh root@193.70.84.47
```

### 2️⃣ Installation (première fois uniquement)
```bash
# Cloner le projet
mkdir -p /opt/Fit-Forge-Muscu
cd /opt/Fit-Forge-Muscu
git clone https://github.com/Paulclaus67/Fit-Forge-Muscu.git .
git checkout prod

# Configurer l'environnement
cp .env.example .env
nano .env
```

**Dans .env, modifiez :**
```bash
JWT_SECRET="VOTRE_SECRET_ICI"  # Générer avec: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
VITE_API_URL=https://api.fitforge-muscu.fr
```

### 3️⃣ Déployer
```bash
# Rendre les scripts exécutables
chmod +x deploy.sh health-check.sh backup.sh

# Lancer le déploiement
./deploy.sh
```

### 4️⃣ Vérifier
```bash
./health-check.sh
```

---

## 🔄 Pour mettre à jour l'application

```bash
ssh root@193.70.84.47
cd /opt/Fit-Forge-Muscu
./deploy.sh
```

**C'est tout !** 🎉

---

## 📋 Commandes rapides

```bash
# Voir les logs en direct
docker compose -f docker-compose.prod.yml logs -f

# Redémarrer
docker compose -f docker-compose.prod.yml restart

# Faire un backup
./backup.sh

# Vérifier la santé
./health-check.sh
```

---

## 🌐 Accès après déploiement

- **Frontend :** https://fitforge-muscu.fr
- **API :** https://api.fitforge-muscu.fr
- **Localement :** http://193.70.84.47:5173 (frontend) et http://193.70.84.47:4000 (api)

---

## 📚 Documentation complète

- [Guide détaillé de déploiement](./DEPLOIEMENT_VPS.md)
- [Documentation des scripts](./SCRIPTS_README.md)
- [README principal](./README.md)

---

**Besoin d'aide ?** Consultez le guide complet `DEPLOIEMENT_VPS.md` 📖
