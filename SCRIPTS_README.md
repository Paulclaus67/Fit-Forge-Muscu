# 🛠️ Scripts de Déploiement et Maintenance

Ce dossier contient des scripts pour faciliter le déploiement et la maintenance de l'application Muscu PWA sur votre VPS.

## 📜 Scripts disponibles

### 1. `deploy.sh` - Déploiement automatique
Déploie ou met à jour l'application sur le VPS.

**Usage :**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Ce que fait le script :**
- ✅ Vérifie la configuration (.env)
- ✅ Pull les dernières modifications de Git
- ✅ Build les images Docker
- ✅ Redémarre les services
- ✅ Applique les migrations de base de données

---

### 2. `health-check.sh` - Vérification de santé
Vérifie que tous les services fonctionnent correctement.

**Usage :**
```bash
chmod +x health-check.sh
./health-check.sh          # Vérification locale
./health-check.sh public   # Vérification + domaines publics
```

**Ce que vérifie le script :**
- ✅ État des containers Docker
- ✅ Disponibilité du backend et frontend
- ✅ Présence de la base de données
- ✅ Utilisation des ressources (CPU, RAM, disque)

---

### 3. `backup.sh` - Sauvegarde automatique
Crée une sauvegarde de la base de données et de la configuration.

**Usage :**
```bash
chmod +x backup.sh
./backup.sh
```

**Ce que fait le script :**
- ✅ Sauvegarde la base de données SQLite
- ✅ Sauvegarde le fichier .env
- ✅ Crée une archive compressée
- ✅ Nettoie les backups de plus de 30 jours
- ✅ Stocke dans `/opt/fitforge-backups/`

**Automatiser les backups :**
```bash
# Éditer le crontab
crontab -e

# Ajouter cette ligne pour un backup quotidien à 3h du matin
0 3 * * * /opt/Fit-Forge-Muscu/backup.sh >> /var/log/muscu-backup.log 2>&1
```

---

## 🚀 Guide de déploiement rapide

### Première installation

1. **Connectez-vous à votre VPS :**
   ```bash
   ssh root@193.70.84.47
   ```

2. **Clonez le projet :**
   ```bash
   mkdir -p /opt/Fit-Forge-Muscu
   cd /opt/Fit-Forge-Muscu
   git clone https://github.com/Paulclaus67/Fit-Forge-Muscu.git .
   git checkout prod
   ```

3. **Configurez l'environnement :**
   ```bash
   cp .env.example .env
   nano .env
   
   # Modifiez ces valeurs :
   # - JWT_SECRET: Générer avec node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   # - VITE_API_URL: https://api.fitforge-muscu.fr
   ```

4. **Rendez les scripts exécutables :**
   ```bash
   chmod +x deploy.sh health-check.sh backup.sh
   ```

5. **Lancez le déploiement :**
   ```bash
   ./deploy.sh
   ```

6. **Vérifiez que tout fonctionne :**
   ```bash
   ./health-check.sh
   ```

### Mises à jour futures

```bash
cd /opt/Fit-Forge-Muscu
./deploy.sh
```

C'est tout ! Le script s'occupe de tout automatiquement.

---

## 📋 Commandes Docker utiles

### Voir les logs
```bash
# Tous les services
docker compose -f docker-compose.prod.yml logs -f

# Un service spécifique
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
```

### Redémarrer les services
```bash
# Tous les services
docker compose -f docker-compose.prod.yml restart

# Un service spécifique
docker compose -f docker-compose.prod.yml restart backend
```

### Arrêter les services
```bash
docker compose -f docker-compose.prod.yml down
```

### Nettoyer les ressources Docker
```bash
# Nettoyer les images inutilisées
docker image prune -a

# Nettoyer tout (containers, images, volumes non utilisés)
docker system prune -a --volumes
```

---

## 🔧 Reverse Proxy

### Configuration Caddy (recommandé)

Éditez `/etc/caddy/Caddyfile` :
```caddyfile
fitforge-muscu.fr, www.fitforge-muscu.fr {
    reverse_proxy localhost:5173
    encode gzip
}

api.fitforge-muscu.fr {
    reverse_proxy localhost:4000
    encode gzip
}
```

Rechargez :
```bash
systemctl reload caddy
```

### Configuration Nginx (alternative)

Créez `/etc/nginx/sites-available/fitforge-muscu` :
```nginx
server {
    listen 80;
    server_name fitforge-muscu.fr www.fitforge-muscu.fr;
    
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}

server {
    listen 80;
    server_name api.fitforge-muscu.fr;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

Activez et SSL :
```bash
ln -s /etc/nginx/sites-available/fitforge-muscu /etc/nginx/sites-enabled/
certbot --nginx -d fitforge-muscu.fr -d www.fitforge-muscu.fr -d api.fitforge-muscu.fr
systemctl reload nginx
```

---

## 🆘 Dépannage

### Les services ne démarrent pas
```bash
# Voir les erreurs
docker compose -f docker-compose.prod.yml logs

# Reconstruire sans cache
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

### Erreur de base de données
```bash
# Vérifier les permissions
ls -l /opt/fitforge-data/dev.db

# Corriger les permissions
chmod 644 /opt/fitforge-data/dev.db
```

### Port déjà utilisé
```bash
# Voir ce qui utilise le port 4000
netstat -tulpn | grep 4000

# Tuer le processus si nécessaire
kill -9 <PID>
```

---

## 📞 Support

Pour plus d'informations, consultez :
- [Guide complet de déploiement](./DEPLOIEMENT_VPS.md)
- [Documentation du projet](./README.md)
- [GitHub Issues](https://github.com/Paulclaus67/Fit-Forge-Muscu/issues)

---

**Version :** 1.1.0  
**Dernière mise à jour :** 10 décembre 2024
