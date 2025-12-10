# 🚀 Guide de Déploiement Rapide

Ce guide vous accompagne pas à pas pour déployer Fit Forge Muscu en production.

## 📋 Pré-requis

- [ ] Serveur avec Node.js 18+ installé
- [ ] Base de données PostgreSQL (recommandé) ou SQLite
- [ ] Nom de domaine configuré
- [ ] Certificat SSL/HTTPS

## 🎯 Étape 1 : Préparation Backend (15 min)

### 1.1 Cloner et installer

```bash
git clone https://github.com/Paulclaus67/Fit-Forge-Muscu.git
cd Fit-Forge-Muscu/backend
npm install
```

### 1.2 Générer un JWT Secret fort

```bash
node generate-secret.js
```

**Copiez le secret généré !**

### 1.3 Configurer l'environnement

Créez `.env` à partir de `.env.production.example` :

```bash
cp .env.production.example .env
```

Éditez `.env` et remplissez :

```env
NODE_ENV=production
PORT=4000
JWT_SECRET=votre_secret_genere_ci_dessus
DATABASE_URL="postgresql://user:pass@host:5432/fitforge"
CORS_ORIGIN=https://votredomaine.com
```

### 1.4 Configurer la base de données

```bash
# Appliquer les migrations
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate

# Créer les données initiales (exercices)
npx prisma db seed
```

### 1.5 Builder

```bash
npm run build
```

### 1.6 Tester localement

```bash
npm start
# Vérifier: http://localhost:4000/health
```

## 🎨 Étape 2 : Préparation Frontend (10 min)

### 2.1 Installer

```bash
cd ../frontend
npm install
```

### 2.2 Configurer l'environnement

Créez `.env.production` :

```bash
cp .env.production.example .env.production
```

Éditez `.env.production` :

```env
VITE_API_URL=https://api.votredomaine.com
```

### 2.3 Builder

```bash
npm run build
```

Le dossier `dist/` contient votre application prête !

## 🌐 Étape 3 : Déploiement

### Option A : Vercel (Recommandé - Le plus simple)

#### Backend sur Vercel

1. Installer Vercel CLI :
```bash
npm i -g vercel
```

2. Dans `backend/` :
```bash
vercel
```

3. Configurer les variables d'environnement :
   - Aller sur Vercel Dashboard
   - Settings → Environment Variables
   - Ajouter JWT_SECRET, DATABASE_URL, etc.

#### Frontend sur Vercel

1. Dans `frontend/` :
```bash
vercel
```

2. Ajouter la variable `VITE_API_URL`

### Option B : VPS avec PM2

#### Backend

1. Installer PM2 :
```bash
npm install -g pm2
```

2. Démarrer :
```bash
cd backend
pm2 start dist/index.js --name fitforge-api
pm2 save
pm2 startup
```

#### Frontend avec Nginx

1. Installer Nginx :
```bash
sudo apt install nginx
```

2. Copier le build :
```bash
sudo cp -r frontend/dist/* /var/www/fitforge/
```

3. Configurer Nginx (`/etc/nginx/sites-available/fitforge`) :

```nginx
server {
    listen 80;
    server_name votredomaine.com;
    root /var/www/fitforge;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy vers l'API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Activer et recharger :
```bash
sudo ln -s /etc/nginx/sites-available/fitforge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. Configurer SSL avec Certbot :
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votredomaine.com
```

### Option C : Docker (Production-ready)

```bash
# À la racine du projet
docker-compose -f docker-compose.prod.yml up -d
```

## ✅ Étape 4 : Vérifications Post-Déploiement

### 4.1 Healthchecks

```bash
# Backend
curl https://api.votredomaine.com/health
# Doit retourner: {"status":"ok"}

# Frontend
curl https://votredomaine.com
# Doit retourner le HTML
```

### 4.2 Test des fonctionnalités

- [ ] Inscription d'un utilisateur
- [ ] Connexion
- [ ] Création d'un workout
- [ ] Accès au planning
- [ ] Mode offline (PWA)

### 4.3 Monitoring

Configurer un outil de monitoring :

- **Uptime Robot** (gratuit) : https://uptimerobot.com
- **Better Uptime** : https://betteruptime.com
- **Sentry** (erreurs) : https://sentry.io

## 🔐 Étape 5 : Sécurité Post-Déploiement

### 5.1 Checklist Sécurité

- [ ] HTTPS activé partout
- [ ] JWT_SECRET fort et unique
- [ ] CORS configuré strictement
- [ ] Rate limiting actif
- [ ] Helmet headers actifs
- [ ] Firewall configuré
- [ ] Backups automatiques configurés

### 5.2 Configurer les backups

#### PostgreSQL (exemple)

```bash
# Script de backup quotidien
0 2 * * * pg_dump fitforge > /backups/fitforge-$(date +\%Y\%m\%d).sql
```

#### SQLite

```bash
# Backup quotidien
0 2 * * * cp /path/to/prod.db /backups/backup-$(date +\%Y\%m\%d).db
```

## 📊 Étape 6 : Monitoring et Logs

### PM2 Logs

```bash
pm2 logs fitforge-api
pm2 monit
```

### Nginx Logs

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## 🆘 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier les logs
pm2 logs fitforge-api

# Vérifier le port
lsof -i :4000

# Vérifier les variables d'env
pm2 env 0
```

### Le frontend affiche des erreurs API

1. Vérifier que `VITE_API_URL` est correct
2. Vérifier le CORS du backend
3. Ouvrir les DevTools → Network

### Base de données inaccessible

```bash
# Tester la connexion PostgreSQL
psql "postgresql://user:pass@host:5432/fitforge"

# Vérifier les migrations
cd backend
npx prisma migrate status
```

## 📈 Optimisations Post-Déploiement

### Performance

1. **Activer la compression Gzip** (Nginx) :
```nginx
gzip on;
gzip_types text/css application/javascript application/json;
```

2. **Cache des assets statiques** :
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

3. **CDN** (Optionnel) :
   - Cloudflare (gratuit)
   - AWS CloudFront
   - Vercel Edge Network

### Base de données

1. Ajouter des index si nécessaire :
```sql
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_workout_user ON "Workout"("userId");
```

## 🎉 C'est déployé !

Votre application est maintenant en production !

### Prochaines étapes

- [ ] Configurer les alertes email
- [ ] Ajouter Google Analytics (optionnel)
- [ ] Mettre en place un changelog public
- [ ] Créer une page de status (status.votredomaine.com)

### Support

- 📚 [Documentation complète](./README.md)
- 🐛 [Signaler un bug](https://github.com/Paulclaus67/Fit-Forge-Muscu/issues)
- 💬 [Discussions](https://github.com/Paulclaus67/Fit-Forge-Muscu/discussions)

---

**Félicitations ! Votre app est en ligne ! 🚀💪**
