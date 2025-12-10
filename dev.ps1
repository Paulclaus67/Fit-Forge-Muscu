# Script PowerShell pour démarrer le projet complet en développement

Write-Host "🚀 Démarrage de Fit Forge Muscu..." -ForegroundColor Green

# Vérifier si node_modules existe dans backend
if (!(Test-Path "backend/node_modules")) {
    Write-Host "📦 Installation des dépendances backend..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

# Vérifier si node_modules existe dans frontend
if (!(Test-Path "frontend/node_modules")) {
    Write-Host "📦 Installation des dépendances frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

# Vérifier si la base de données existe
if (!(Test-Path "backend/prisma/dev.db")) {
    Write-Host "🗄️ Initialisation de la base de données..." -ForegroundColor Yellow
    Set-Location backend
    npx prisma migrate dev
    npx prisma db seed
    Set-Location ..
}

# Démarrer le backend et le frontend en parallèle
Write-Host "✅ Démarrage des serveurs..." -ForegroundColor Green

$backend = Start-Job -ScriptBlock { 
    Set-Location $using:PWD\backend
    npm run dev 
}

$frontend = Start-Job -ScriptBlock { 
    Set-Location $using:PWD\frontend
    npm run dev 
}

Write-Host "🎯 Backend: http://localhost:4000" -ForegroundColor Cyan
Write-Host "🎯 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Appuyez sur Ctrl+C pour arrêter les serveurs" -ForegroundColor Yellow

# Attendre et afficher les logs
try {
    while ($true) {
        Receive-Job -Job $backend
        Receive-Job -Job $frontend
        Start-Sleep -Seconds 1
    }
}
finally {
    Write-Host "🛑 Arrêt des serveurs..." -ForegroundColor Red
    Stop-Job -Job $backend, $frontend
    Remove-Job -Job $backend, $frontend
}
