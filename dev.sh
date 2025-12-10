#!/bin/bash
# Script pour démarrer le projet complet en développement

echo "🚀 Démarrage de Fit Forge Muscu..."

# Vérifier si node_modules existe dans backend
if [ ! -d "backend/node_modules" ]; then
  echo "📦 Installation des dépendances backend..."
  cd backend && npm install && cd ..
fi

# Vérifier si node_modules existe dans frontend
if [ ! -d "frontend/node_modules" ]; then
  echo "📦 Installation des dépendances frontend..."
  cd frontend && npm install && cd ..
fi

# Vérifier si la base de données existe
if [ ! -f "backend/prisma/dev.db" ]; then
  echo "🗄️ Initialisation de la base de données..."
  cd backend && npx prisma migrate dev && npx prisma db seed && cd ..
fi

# Démarrer le backend et le frontend en parallèle
echo "✅ Démarrage des serveurs..."
trap 'kill $(jobs -p)' EXIT

cd backend && npm run dev &
cd frontend && npm run dev &

wait
