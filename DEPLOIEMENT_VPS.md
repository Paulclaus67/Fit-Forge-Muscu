# 🚀 Guide de Déploiement VPS - Muscu PWA

Guide complet pour déployer l'application sur votre VPS (193.70.84.47).

## 📋 Prérequis VPS

Votre VPS doit avoir :
- ✅ Docker installé
- ✅ Docker Compose installé
- ✅ Git installé
- ✅ Domaines configurés (DNS pointant vers 193.70.84.47)
- ✅ Caddy ou Nginx pour le reverse proxy

## 🔧 Étape 1 : Connexion au VPS

```bash
# Connexion SSH à votre VPS
ssh root@193.70.84.47
# ou
ssh votre-user@193.70.84.47
```

## 📦 Étape 2 : Installation des prérequis (si nécessaire)

### Vérifier si Docker est installé
```bash
docker --version
docker compose version
```

### Si Docker n'est pas installé
```bash
# Installation Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Vérifier l'installation
docker --version
```

## 📂 Étape 3 : Cloner le projet sur le VPS

```bash
# Créer le répertoire pour l'application
mkdir -p /opt/Fit-Forge-Muscu
cd /opt/Fit-Forge-Muscu

# Cloner le dépôt (branche prod)
git clone https://github.com/Paulclaus67/Fit-Forge-Muscu.git .

# Ou si déjà cloné, mettre à jour
git fetch origin
git checkout prod
git pull origin prod
```

## 🔐 Étape 4 : Créer le fichier .env de production

```bash
# Créer le fichier .env
nano .env
```

Copiez cette configuration (à adapter) :
```bash
# Backend
DATABASE_URL="file:./dev.db"
JWT_SECRET="VOTRE_SECRET_ULTRA_SECURISE_ICI_123456789abcdef"
PORT=4000

# Frontend
VITE_API_URL=https://api.fitforge-muscu.fr
```

**IMPORTANT :** Générez un JWT_SECRET sécurisé :
```bash
# Générer un secret aléatoire
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Appuyez sur `Ctrl+X`, puis `Y`, puis `Entrée` pour sauvegarder.

## 💾 Étape 5 : Créer le répertoire pour la base de données

```bash
# Créer le dossier pour les données persistantes
mkdir -p /opt/fitforge-data

# Créer le fichier de base de données (sera initialisé par Prisma)
touch /opt/fitforge-data/dev.db

# Donner les permissions appropriées
chmod 644 /opt/fitforge-data/dev.db
```

## 🏗️ Étape 6 : Build et démarrage des containers

```bash
# Retour au dossier de l'application
cd /opt/Fit-Forge-Muscu

# Build des images Docker
docker compose -f docker-compose.prod.yml build

# Lancer les services en arrière-plan
docker compose -f docker-compose.prod.yml up -d
```

## 🗄️ Étape 7 : Initialiser la base de données

```bash
# Exécuter les migrations Prisma
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# (Optionnel) Seed de la base avec des données de démo
docker compose -f docker-compose.prod.yml exec backend npx prisma db seed
```

## 🌐 Étape 8 : Configuration du reverse proxy (Caddy)

### Si vous utilisez Caddy

```bash
# Éditer le Caddyfile
nano /etc/caddy/Caddyfile
```

Ajoutez cette configuration :
```caddyfile
fitforge-muscu.fr, www.fitforge-muscu.fr {
    reverse_proxy localhost:5173
    encode gzip
    log {
        output file /var/log/caddy/fitforge-frontend.log
    }
}

api.fitforge-muscu.fr {
    reverse_proxy localhost:4000
    encode gzip
    log {
        output file /var/log/caddy/fitforge-backend.log
    }
}
```

Rechargez Caddy :
```bash
systemctl reload caddy
```

### Si vous utilisez Nginx

```bash
# Créer la configuration nginx
nano /etc/nginx/sites-available/fitforge-muscu
```

```nginx
# Frontend
server {
    listen 80;
    listen [::]:80;
    server_name fitforge-muscu.fr www.fitforge-muscu.fr;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    listen [::]:80;
    server_name api.fitforge-muscu.fr;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activer le site et recharger Nginx :
```bash
ln -s /etc/nginx/sites-available/fitforge-muscu /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Installer le certificat SSL avec Certbot

```bash
# Installer certbot
apt install certbot python3-certbot-nginx  # Pour Nginx
# ou
apt install certbot python3-certbot-apache  # Pour Apache

# Obtenir les certificats SSL
certbot --nginx -d fitforge-muscu.fr -d www.fitforge-muscu.fr -d api.fitforge-muscu.fr
```

## ✅ Étape 9 : Vérification du déploiement

```bash
# Vérifier que les containers tournent
docker ps

# Voir les logs du backend
docker compose -f docker-compose.prod.yml logs -f backend

# Voir les logs du frontend
docker compose -f docker-compose.prod.yml logs -f frontend

# Vérifier l'état des services
docker compose -f docker-compose.prod.yml ps
```

## 🧪 Étape 10 : Tests

1. **Tester le backend :**
   ```bash
   curl http://localhost:4000/health
   # ou
   curl https://api.fitforge-muscu.fr/health
   ```

2. **Tester le frontend :**
   - Ouvrir dans un navigateur : https://fitforge-muscu.fr
   - Vérifier que la page se charge
   - Tester l'inscription/connexion

## 🔄 Commandes utiles pour la maintenance

### Mettre à jour l'application

```bash
cd /opt/Fit-Forge-Muscu

# Pull les dernières modifications
git pull origin prod

# Rebuild et redémarrer
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# Appliquer les migrations si nécessaire
docker compose -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

### Voir les logs

```bash
# Logs en temps réel
docker compose -f docker-compose.prod.yml logs -f

# Logs d'un service spécifique
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend

# Dernières 100 lignes
docker compose -f docker-compose.prod.yml logs --tail=100
```

### Redémarrer les services

```bash
# Redémarrer tous les services
docker compose -f docker-compose.prod.yml restart

# Redémarrer un service spécifique
docker compose -f docker-compose.prod.yml restart backend
docker compose -f docker-compose.prod.yml restart frontend
```

### Arrêter les services

```bash
# Arrêter sans supprimer
docker compose -f docker-compose.prod.yml stop

# Arrêter et supprimer les containers
docker compose -f docker-compose.prod.yml down

# Arrêter et supprimer + volumes (ATTENTION : perte de données)
docker compose -f docker-compose.prod.yml down -v
```

### Sauvegarder la base de données

```bash
# Créer un backup
cp /opt/fitforge-data/dev.db /opt/fitforge-data/backup-$(date +%Y%m%d-%H%M%S).db

# Ou avec compression
tar -czf /opt/fitforge-data/backup-$(date +%Y%m%d-%H%M%S).tar.gz /opt/fitforge-data/dev.db
```

### Automatiser les backups (cron)

```bash
# Éditer le crontab
crontab -e

# Ajouter cette ligne pour un backup quotidien à 3h du matin
0 3 * * * cp /opt/fitforge-data/dev.db /opt/fitforge-data/backup-$(date +\%Y\%m\%d).db && find /opt/fitforge-data/backup-*.db -mtime +7 -delete
```

## 🔒 Sécurité

### Firewall (UFW)

```bash
# Autoriser SSH
ufw allow 22/tcp

# Autoriser HTTP/HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Activer le firewall
ufw enable
```

### Limiter l'accès SSH

```bash
# Éditer la config SSH
nano /etc/ssh/sshd_config

# Désactiver la connexion root par mot de passe
PermitRootLogin prohibit-password

# Redémarrer SSH
systemctl restart sshd
```

## 🚨 Troubleshooting

### Le backend ne démarre pas
```bash
# Vérifier les logs
docker compose -f docker-compose.prod.yml logs backend

# Vérifier que le port 4000 est libre
netstat -tulpn | grep 4000

# Reconstruire l'image
docker compose -f docker-compose.prod.yml build --no-cache backend
docker compose -f docker-compose.prod.yml up -d backend
```

### Le frontend ne démarre pas
```bash
# Vérifier les logs
docker compose -f docker-compose.prod.yml logs frontend

# Vérifier que VITE_API_URL est correct dans .env
cat .env | grep VITE_API_URL

# Rebuild
docker compose -f docker-compose.prod.yml build --no-cache frontend
docker compose -f docker-compose.prod.yml up -d frontend
```

### Erreurs de permissions sur la base de données
```bash
# Donner les bonnes permissions
chmod 644 /opt/fitforge-data/dev.db
chown -R 1000:1000 /opt/fitforge-data
```

### Le site n'est pas accessible depuis l'extérieur
```bash
# Vérifier que les containers écoutent
docker compose -f docker-compose.prod.yml ps

# Vérifier que les ports sont bien mappés
netstat -tulpn | grep -E '4000|5173'

# Vérifier la config du reverse proxy
nginx -t  # pour Nginx
caddy validate --config /etc/caddy/Caddyfile  # pour Caddy
```

## 📊 Monitoring

### Utilisation des ressources

```bash
# Stats des containers
docker stats

# Espace disque
df -h

# Taille de la base de données
du -sh /opt/fitforge-data/dev.db
```

## 📞 Support

En cas de problème :
1. Vérifier les logs : `docker compose logs`
2. Consulter la documentation : `/opt/Fit-Forge-Muscu/README.md`
3. Créer une issue sur GitHub

---

**Date de mise à jour :** 10 décembre 2024  
**Version :** 1.1.0  
**Statut :** ✅ Prêt pour la production
