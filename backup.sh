#!/bin/bash

# Script de backup automatique pour Muscu PWA
# Usage: ./backup.sh

set -e

echo "💾 Backup de Muscu PWA"
echo "======================"
echo ""

# Configuration
BACKUP_DIR="/opt/fitforge-backups"
DB_PATH="/opt/fitforge-data/dev.db"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d-%H%M%S)

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Créer le répertoire de backup si nécessaire
if [ ! -d "$BACKUP_DIR" ]; then
    echo "Création du répertoire de backup..."
    mkdir -p "$BACKUP_DIR"
fi

# Vérifier que la base de données existe
if [ ! -f "$DB_PATH" ]; then
    echo -e "${RED}❌ Base de données introuvable: $DB_PATH${NC}"
    exit 1
fi

# Créer le backup
echo -e "${GREEN}📦 Création du backup...${NC}"
BACKUP_FILE="$BACKUP_DIR/muscu-pwa-backup-$DATE.tar.gz"

# Backup de la base de données + .env
tar -czf "$BACKUP_FILE" \
    -C /opt/fitforge-data dev.db \
    -C /opt/Fit-Forge-Muscu .env 2>/dev/null || true

if [ -f "$BACKUP_FILE" ]; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✅ Backup créé: $BACKUP_FILE (taille: $SIZE)${NC}"
else
    echo -e "${RED}❌ Erreur lors de la création du backup${NC}"
    exit 1
fi

# Nettoyer les anciens backups
echo -e "${YELLOW}🧹 Nettoyage des backups de plus de $RETENTION_DAYS jours...${NC}"
find "$BACKUP_DIR" -name "muscu-pwa-backup-*.tar.gz" -mtime +$RETENTION_DAYS -delete
REMAINING=$(ls -1 "$BACKUP_DIR"/muscu-pwa-backup-*.tar.gz 2>/dev/null | wc -l)
echo -e "${GREEN}✅ Backups restants: $REMAINING${NC}"

# Liste des backups récents
echo ""
echo "📋 Backups récents:"
ls -lh "$BACKUP_DIR"/muscu-pwa-backup-*.tar.gz 2>/dev/null | tail -5 || echo "Aucun backup"

echo ""
echo -e "${GREEN}✅ Backup terminé avec succès !${NC}"
echo ""
echo "Pour restaurer un backup:"
echo "  tar -xzf $BACKUP_FILE -C /"
