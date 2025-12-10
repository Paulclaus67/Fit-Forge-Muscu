#!/bin/bash

# Script de déploiement automatique pour Muscu PWA
# Usage: ./deploy.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement de Muscu PWA v1.1.0"
echo "=================================="
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "docker-compose.prod.yml" ]; then
    echo -e "${RED}❌ Erreur: docker-compose.prod.yml introuvable${NC}"
    echo "Assurez-vous d'être dans le répertoire racine du projet"
    exit 1
fi

# Vérifier que .env existe
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env introuvable${NC}"
    echo "Création depuis .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  IMPORTANT: Éditez .env avec vos valeurs de production !${NC}"
    read -p "Appuyez sur Entrée après avoir configuré .env..."
fi

# Vérifier que JWT_SECRET a été changé
if grep -q "CHANGE_ME_IN_PROD" .env; then
    echo -e "${RED}❌ Erreur: JWT_SECRET n'a pas été configuré !${NC}"
    echo "Générez un secret sécurisé avec:"
    echo "  node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\""
    exit 1
fi

# Créer le répertoire pour les données si nécessaire
echo -e "${GREEN}📂 Vérification du répertoire de données...${NC}"
if [ ! -d "/opt/fitforge-data" ]; then
    echo "Création de /opt/fitforge-data..."
    sudo mkdir -p /opt/fitforge-data
    sudo touch /opt/fitforge-data/dev.db
    sudo chmod 644 /opt/fitforge-data/dev.db
fi

# Pull les dernières modifications
echo -e "${GREEN}📥 Mise à jour du code depuis Git...${NC}"
git fetch origin
git checkout prod
git pull origin prod

# Arrêter les anciens containers
echo -e "${GREEN}🛑 Arrêt des anciens containers...${NC}"
docker compose -f docker-compose.prod.yml down || true

# Build des nouvelles images
echo -e "${GREEN}🏗️  Build des images Docker...${NC}"
docker compose -f docker-compose.prod.yml build --no-cache

# Démarrer les services
echo -e "${GREEN}🚀 Démarrage des services...${NC}"
docker compose -f docker-compose.prod.yml up -d

# Attendre que le backend soit prêt
echo -e "${GREEN}⏳ Attente du démarrage du backend...${NC}"
sleep 5

# Exécuter les migrations Prisma
echo -e "${GREEN}🗄️  Application des migrations de base de données...${NC}"
docker compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy

# Vérifier l'état des services
echo -e "${GREEN}✅ Vérification des services...${NC}"
docker compose -f docker-compose.prod.yml ps

# Afficher les logs récents
echo ""
echo -e "${GREEN}📋 Derniers logs:${NC}"
docker compose -f docker-compose.prod.yml logs --tail=20

echo ""
echo -e "${GREEN}✅ Déploiement terminé avec succès !${NC}"
echo ""
echo "Services disponibles:"
echo "  - Frontend: http://localhost:5173"
echo "  - Backend:  http://localhost:4000"
echo ""
echo "Commandes utiles:"
echo "  - Voir les logs:      docker compose -f docker-compose.prod.yml logs -f"
echo "  - Redémarrer:         docker compose -f docker-compose.prod.yml restart"
echo "  - Arrêter:            docker compose -f docker-compose.prod.yml down"
echo ""
