#!/bin/bash

# Script de vérification de santé des services
# Usage: ./health-check.sh

echo "🏥 Vérification de santé - Muscu PWA"
echo "====================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Fonction pour vérifier un service
check_service() {
    local name=$1
    local url=$2
    
    if curl -f -s -o /dev/null "$url"; then
        echo -e "${GREEN}✅ $name - OK${NC}"
        return 0
    else
        echo -e "${RED}❌ $name - ERREUR${NC}"
        return 1
    fi
}

# Vérifier les containers Docker
echo "🐳 État des containers Docker:"
docker compose -f docker-compose.prod.yml ps
echo ""

# Vérifier le backend
echo "🔍 Test des services:"
check_service "Backend API (local)" "http://localhost:4000/health"
check_service "Frontend (local)" "http://localhost:5173"

# Si les domaines sont configurés
if [ ! -z "$1" ]; then
    echo ""
    echo "🌐 Test des domaines publics:"
    check_service "API publique" "https://api.fitforge-muscu.fr/health"
    check_service "Frontend public" "https://fitforge-muscu.fr"
fi

# Vérifier la base de données
echo ""
echo "💾 Base de données:"
if [ -f "/opt/fitforge-data/dev.db" ]; then
    SIZE=$(du -h /opt/fitforge-data/dev.db | cut -f1)
    echo -e "${GREEN}✅ Base de données présente (taille: $SIZE)${NC}"
else
    echo -e "${RED}❌ Base de données introuvable${NC}"
fi

# Utilisation des ressources
echo ""
echo "📊 Utilisation des ressources:"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Espace disque
echo ""
echo "💿 Espace disque:"
df -h / | tail -n 1

echo ""
echo "Pour voir les logs en temps réel:"
echo "  docker compose -f docker-compose.prod.yml logs -f"
