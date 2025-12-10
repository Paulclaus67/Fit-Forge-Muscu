# Script de déploiement manuel pour FitForge Muscu
# Usage: .\deploy-manual.ps1 -Host "193.70.84.47" -User "root" -Port 22

param(
    [string]$Host = "193.70.84.47",
    [string]$User = "root",
    [int]$Port = 22
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Déploiement manuel de FitForge Muscu" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📍 Configuration:" -ForegroundColor Green
Write-Host "   Host: $Host"
Write-Host "   User: $User"
Write-Host "   Port: $Port"
Write-Host ""

# Vérifier la connectivité SSH
Write-Host "🔍 Vérification de la connexion SSH..." -ForegroundColor Yellow
try {
    $sshTest = ssh -p $Port "${User}@${Host}" "echo 'SSH OK'" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Connexion SSH établie" -ForegroundColor Green
    } else {
        throw "Connexion échouée"
    }
} catch {
    Write-Host "❌ Erreur: Impossible de se connecter au VPS" -ForegroundColor Red
    Write-Host "   Vérifiez les paramètres (host, user, port)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Lancement du déploiement..." -ForegroundColor Yellow

$deployScript = @"
echo '1️⃣  Mise à jour du code...'
cd /opt/Fit-Forge-Muscu
git fetch origin
git checkout prod
git pull origin prod

echo '2️⃣  Arrêt des containers...'
docker compose -f docker-compose.prod.yml down

echo '3️⃣  Build des images...'
docker compose -f docker-compose.prod.yml build --no-cache

echo '4️⃣  Démarrage des services...'
docker compose -f docker-compose.prod.yml up -d

echo '5️⃣  Migration de la base de données...'
docker compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy || true

echo '6️⃣  Vérification du statut...'
docker compose -f docker-compose.prod.yml ps

echo ''
echo '✅ Déploiement terminé avec succès!'
"@

try {
    ssh -p $Port "${User}@${Host}" $deployScript
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✨ Déploiement complété avec succès!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔍 Vérifiez votre application:" -ForegroundColor Green
        Write-Host "   Frontend: https://votre-domaine.com"
        Write-Host "   Backend API: https://votre-domaine.com/api"
    } else {
        Write-Host "❌ Erreur lors du déploiement" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    exit 1
}
