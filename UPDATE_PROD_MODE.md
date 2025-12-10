# 🔧 Mise à jour pour passer en mode production

## Problème résolu
Le mode "dev" apparaissait en production car les containers utilisaient `npm run dev` au lieu de builds optimisés.

## ✅ Solution appliquée
- Création de `Dockerfile.prod` pour backend et frontend
- Build TypeScript pour le backend
- Build Vite + serve pour le frontend
- Mise à jour de `docker-compose.prod.yml`

## 🚀 Commandes pour mettre à jour sur le VPS

```bash
# Se connecter au VPS
ssh ubuntu@vps-dcb926af

# Aller dans le dossier
cd /opt/Fit-Forge-Muscu

# Pull les changements
git fetch origin
git pull origin prod

# Reconstruire et redémarrer (rebuild complet nécessaire)
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d

# Vérifier
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f
```

## 🎯 Résultat attendu
- ✅ Plus de "mode dev" visible
- ✅ Build optimisé et minifié
- ✅ Meilleures performances
- ✅ Moins de ressources utilisées

---

**Note :** Le rebuild prendra un peu plus de temps car il compile TypeScript et build Vite, mais c'est normal !
